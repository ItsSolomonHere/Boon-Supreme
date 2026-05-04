import "dotenv/config";
import mongoose from "mongoose";
import MenuItem from "../models/MenuItem.js";
import connectDB from "../config/db.js";

const dishes = [
  {
    name: "Pilau",
    slug: "pilau",
    description: "Fragrant Kenyan pilau with aromatic spices and tender beef.",
    priceKES: 450,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
    popular: true,
    vegan: false,
    spicy: true,
  },
  {
    name: "Kienyeji Chicken",
    slug: "kienyeji-chicken",
    description: "Free-range chicken stewed with traditional herbs and vegetables.",
    priceKES: 650,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80",
    popular: true,
    vegan: false,
    spicy: false,
  },
  {
    name: "Chips Zege",
    slug: "chips-zege",
    description: "Crispy chips topped with fried egg and kachumbari — Nairobi street classic.",
    priceKES: 350,
    category: "sides",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    popular: true,
    vegan: false,
    spicy: false,
  },
  {
    name: "Biryani",
    slug: "biryani",
    description: "Coastal-style chicken biryani with raita and hard-boiled egg.",
    priceKES: 550,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    popular: true,
    vegan: false,
    spicy: true,
  },
  {
    name: "Githeri",
    slug: "githeri",
    description: "Hearty mix of maize and beans, simmered with tomatoes and onions.",
    priceKES: 280,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    popular: false,
    vegan: true,
    spicy: false,
  },
  {
    name: "Matoke",
    slug: "matoke",
    description: "Green bananas cooked in a rich peanut or tomato sauce.",
    priceKES: 320,
    category: "vegan",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    popular: false,
    vegan: true,
    spicy: false,
  },
  {
    name: "Sukuma Wiki",
    slug: "sukuma-wiki",
    description: "Collard greens sautéed with onions and tomatoes — healthy and vibrant.",
    priceKES: 250,
    category: "vegan",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    popular: false,
    vegan: true,
    spicy: false,
  },
  {
    name: "Chapati",
    slug: "chapati",
    description: "Soft layered flatbread, perfect with stews and curries.",
    priceKES: 120,
    category: "sides",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    popular: false,
    vegan: true,
    spicy: false,
  },
  {
    name: "Fried Fish",
    slug: "fried-fish",
    description: "Tilapia fried golden with lemon and kachumbari on the side.",
    priceKES: 750,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    popular: false,
    vegan: false,
    spicy: false,
  },
  {
    name: "Beans Stew",
    slug: "beans-stew",
    description: "Slow-cooked red beans in a thick tomato gravy.",
    priceKES: 290,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
    popular: false,
    vegan: true,
    spicy: false,
  },
];

await connectDB();
await MenuItem.deleteMany({});
await MenuItem.insertMany(dishes);
console.log(`Seeded ${dishes.length} menu items`);
await mongoose.disconnect();
process.exit(0);
