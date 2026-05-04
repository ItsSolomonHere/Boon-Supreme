import { Router } from "express";
import { z } from "zod";
import {
  createOrder,
  getOrder,
  listOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { auth, requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

const orderCreateSchema = z.object({
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        qty: z.number().int().positive(),
      })
    )
    .min(1),
  customer: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    address: z.string().optional(),
  }),
  paymentMethod: z.enum(["mpesa", "card", "cash"]),
  mpesaCode: z.string().optional(),
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

router.post("/", validateBody(orderCreateSchema), createOrder);

router.get("/", auth, requireAuth, requireAdmin, listOrders);

router.patch(
  "/:id/status",
  auth,
  requireAuth,
  requireAdmin,
  validateBody(
    z.object({
      status: z.enum(["pending", "preparing", "out_for_delivery", "delivered"]),
    })
  ),
  updateOrderStatus
);

router.get("/:id", getOrder);

export default router;
