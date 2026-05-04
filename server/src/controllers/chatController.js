import { randomUUID } from "crypto";
import OpenAI from "openai";
import ChatMessage from "../models/ChatMessage.js";
import MenuItem from "../models/MenuItem.js";
import { BUSINESS } from "../config/business.js";

const KEYWORDS = [
  {
    keys: ["hour", "open", "close", "time"],
    reply: `${BUSINESS.hoursLine}. Call ${BUSINESS.phoneLocal}.`,
  },
  {
    keys: ["menu", "food", "dish", "eat", "pilau", "chicken", "vegan"],
    reply:
      "Browse our full menu online — mains, sides, vegan options, and drinks. Crowd favourites include Pilau, Kienyeji Chicken, and Biryani. Filter by vegan or spicy on the Menu page!",
  },
  {
    keys: ["deliver", "delivery", "bolt", "glovo", "uber"],
    reply:
      "We deliver via Bolt Food, Glovo, and Uber Eats — straight to your door across Nairobi.",
  },
  {
    keys: ["mpesa", "pay", "payment"],
    reply:
      "You can pay with M-Pesa (paybill 247247, account BOON), card, or cash on delivery at checkout.",
  },
  {
    keys: ["address", "location", "where", "trm", "plus code", "qvjq"],
    reply: `We're at ${BUSINESS.address}. Plus code: ${BUSINESS.plusCode}. Phone ${BUSINESS.phoneLocal}.`,
  },
  {
    keys: ["dine", "takeaway", "take out", "pickup", "sit down"],
    reply: `We offer ${BUSINESS.services.toLowerCase()}.`,
  },
  {
    keys: ["price", "cheap", "expensive", "budget", "cost per person"],
    reply: `Typical spend is about ${BUSINESS.typicalSpend}. Individual dishes are listed in KES on our menu.`,
  },
  {
    keys: ["call", "phone", "whatsapp", "contact", "reach"],
    reply: `Call us on ${BUSINESS.phoneLocal} (${BUSINESS.phoneE164}).`,
  },
];

function botReply(message) {
  const lower = message.toLowerCase();
  for (const row of KEYWORDS) {
    if (row.keys.some((k) => lower.includes(k))) {
      return row.reply;
    }
  }
  return `Hi! Ask about our menu, ${BUSINESS.services.toLowerCase()}, hours, payments, or find us at ${BUSINESS.address}.`;
}

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

async function buildMenuContext() {
  const menuItems = await MenuItem.find()
    .select("name priceKES category popular vegan spicy description")
    .sort({ category: 1, popular: -1, name: 1 })
    .lean();

  if (!menuItems.length) {
    return "Menu data is currently unavailable in the database.";
  }

  return menuItems
    .map((item) => {
      const badges = [
        item.popular ? "popular" : null,
        item.vegan ? "vegan" : null,
        item.spicy ? "spicy" : null,
      ]
        .filter(Boolean)
        .join(", ");
      const badgeText = badges ? ` [${badges}]` : "";
      return `- ${item.name} (${item.category}) - KES ${item.priceKES}${badgeText}: ${item.description || "No description"}`;
    })
    .join("\n");
}

async function generateOpenAiReply(sessionId, userMessage) {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const menuContext = await buildMenuContext();
  const history = await ChatMessage.find({ sessionId })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
  /** Oldest first; does not include the current user message (saved after this call). */
  const orderedHistory = history.reverse();

  const completion = await openai.responses.create({
    model,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are Boon Supreme Restaurant's assistant. Be helpful, concise, and friendly. " +
              "Always ground food recommendations and prices in the provided menu context. " +
              "Do not invent dishes or prices. If uncertain, say so and suggest checking the menu page. " +
              `Restaurant: ${BUSINESS.address}. Phone ${BUSINESS.phoneLocal} (${BUSINESS.phoneE164}). ` +
              `Plus code: ${BUSINESS.plusCode}. ${BUSINESS.hoursLine}. ` +
              `Services: ${BUSINESS.services}. ${BUSINESS.typicalSpend}. ` +
              "Delivery via Bolt Food, Glovo, Uber Eats. " +
              "Payment options: M-Pesa paybill 247247 account BOON, card, cash on delivery.\n\n" +
              "Current menu:\n" +
              menuContext,
          },
        ],
      },
      ...orderedHistory.map((msg) => ({
        role: msg.role,
        content: [{ type: "input_text", text: msg.content }],
      })),
      {
        role: "user",
        content: [{ type: "input_text", text: userMessage }],
      },
    ],
    temperature: 0.4,
    max_output_tokens: 280,
  });

  return (
    completion.output_text?.trim() ||
    "I can help with menu picks, prices, and delivery options. What are you craving?"
  );
}

export async function postChat(req, res, next) {
  try {
    let { sessionId, message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message required" });
    }
    if (!sessionId) sessionId = randomUUID();

    let reply = "";
    if (process.env.OPENAI_API_KEY) {
      try {
        reply = await generateOpenAiReply(sessionId, message);
      } catch (err) {
        console.error("OpenAI chat error:", err.message);
        reply = botReply(message);
      }
    } else {
      reply = botReply(message);
    }
    await ChatMessage.create({ sessionId, role: "user", content: message });
    await ChatMessage.create({ sessionId, role: "assistant", content: reply });

    res.json({ sessionId, reply });
  } catch (e) {
    next(e);
  }
}
