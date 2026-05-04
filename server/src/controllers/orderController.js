import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

export async function createOrder(req, res, next) {
  try {
    const { items, customer, paymentMethod, mpesaCode } = req.body;
    let total = 0;
    const resolved = [];
    for (const line of items) {
      const menu = await MenuItem.findById(line.menuItemId);
      if (!menu) {
        return res.status(400).json({ error: `Invalid menu item ${line.menuItemId}` });
      }
      const qty = line.qty;
      const price = menu.priceKES;
      total += price * qty;
      resolved.push({ menuItemId: menu._id, qty, price });
    }
    const order = await Order.create({
      items: resolved,
      total,
      customer,
      paymentMethod,
      mpesaCode: mpesaCode || "",
      status: "pending",
    });
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate("items.menuItemId");
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(order);
  } catch (e) {
    next(e);
  }
}

export async function listOrders(_req, res, next) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("items.menuItemId");
    res.json(orders);
  } catch (e) {
    next(e);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("items.menuItemId");
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(order);
  } catch (e) {
    next(e);
  }
}
