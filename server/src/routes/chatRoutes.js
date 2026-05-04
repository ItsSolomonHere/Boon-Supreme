import { Router } from "express";
import { z } from "zod";
import { postChat } from "../controllers/chatController.js";

const router = Router();

const chatSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string().min(1),
});

router.post("/", (req, res, next) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  req.body = parsed.data;
  next();
}, postChat);

export default router;
