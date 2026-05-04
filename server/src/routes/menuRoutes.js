import { Router } from "express";
import { z } from "zod";
import {
  listMenu,
  getMenuBySlug,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { auth, requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

const menuItemSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  priceKES: z.number().positive(),
  category: z.enum(["mains", "sides", "vegan", "drinks"]),
  image: z.string().optional(),
  popular: z.boolean().optional(),
  vegan: z.boolean().optional(),
  spicy: z.boolean().optional(),
});

function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    req.body = parsed.data;
    next();
  };
}

router.get("/", listMenu);

router.post("/", auth, requireAuth, requireAdmin, validateBody(menuItemSchema), createMenuItem);
router.put(
  "/:id",
  auth,
  requireAuth,
  requireAdmin,
  validateBody(menuItemSchema.partial()),
  updateMenuItem
);
router.delete("/:id", auth, requireAuth, requireAdmin, deleteMenuItem);

router.get("/:slug", getMenuBySlug);

export default router;
