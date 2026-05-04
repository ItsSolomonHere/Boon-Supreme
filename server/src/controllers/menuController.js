import MenuItem from "../models/MenuItem.js";

export async function listMenu(req, res, next) {
  try {
    const q = {};
    if (req.query.category) q.category = req.query.category;
    if (req.query.popular === "true") q.popular = true;
    if (req.query.vegan === "true") q.vegan = true;
    if (req.query.spicy === "true") q.spicy = true;
    const items = await MenuItem.find(q).sort({ popular: -1, name: 1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
}

export async function getMenuBySlug(req, res, next) {
  try {
    const param = req.params.slug;
    let item = null;
    if (/^[a-f0-9]{24}$/i.test(param)) {
      item = await MenuItem.findById(param);
    }
    if (!item) {
      item = await MenuItem.findOne({ slug: param });
    }
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function createMenuItem(req, res, next) {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
}

export async function updateMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function deleteMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
