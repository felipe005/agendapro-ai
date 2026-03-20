import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController.js";

const router = Router();

router.get("/summary", dashboardController.summary);

export default router;

