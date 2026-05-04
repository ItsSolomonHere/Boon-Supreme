import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { api } from "../api/client";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { cn } from "../lib/utils";
import { BUSINESS } from "../config/business";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const payload = {
        message: text,
        ...(sessionId ? { sessionId } : {}),
      };
      const { data } = await api.post("/api/chat", payload);
      if (data.sessionId) setSessionId(data.sessionId);
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry — something went wrong. Try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-3">
      {open ? (
        <div
          className="flex h-[min(420px,70vh)] w-[min(100vw-2rem,22rem)] flex-col rounded-2xl border border-brand-green/15 bg-brand-cream shadow-warm"
          role="dialog"
          aria-label="Chat assistant"
        >
          <div className="border-b border-brand-green/10 px-4 py-3">
            <p className="font-display font-semibold text-brand-green-deep">
              Boon Supreme Assistant
            </p>
            <p className="text-xs text-brand-green-deep/60">
              Menu, hours, {BUSINESS.services.join("/").toLowerCase()} ·{" "}
              <a href={`tel:${BUSINESS.phoneE164}`} className="underline-offset-2 hover:underline">
                {BUSINESS.phoneLocal}
              </a>
            </p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.length === 0 ? (
              <p className="text-sm text-brand-green-deep/70">
                Hi! How can we help you today?
              </p>
            ) : null}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[90%] rounded-xl px-3 py-2 text-sm",
                  msg.role === "user"
                    ? "ml-auto bg-brand-green text-brand-cream"
                    : "mr-auto bg-white text-brand-green-deep shadow-sm"
                )}
              >
                {msg.content}
              </div>
            ))}
            {loading ? (
              <p className="text-xs text-brand-green-deep/50">Typing…</p>
            ) : null}
            <div ref={bottomRef} />
          </div>
          <form
            className="flex gap-2 border-t border-brand-green/10 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1"
              aria-label="Chat message"
            />
            <Button type="submit" variant="gold" size="icon" disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : null}
      <Button
        variant="gold"
        size="icon"
        className="h-14 w-14 rounded-full shadow-warm"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
    </div>
  );
}
