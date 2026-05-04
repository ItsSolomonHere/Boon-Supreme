import { Router } from "express";
import { stkPushStub } from "../controllers/mpesaController.js";

const router = Router();

router.post("/stkpush", stkPushStub);

export default router;
