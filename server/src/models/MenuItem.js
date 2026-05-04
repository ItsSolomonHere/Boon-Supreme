import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    priceKES: { type: Number, required: true },
    category: {
      type: String,
      enum: ["mains", "sides", "vegan", "drinks"],
      required: true,
    },
    image: { type: String, default: "" },
    popular: { type: Boolean, default: false },
    vegan: { type: Boolean, default: false },
    spicy: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);
