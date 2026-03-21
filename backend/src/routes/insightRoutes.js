import { Router } from "express";
import { insightController } from "../controllers/insightController.js";

const router = Router();

router.get("/", insightController.list);

export default router;
