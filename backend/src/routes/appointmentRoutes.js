import { Router } from "express";
import { appointmentController } from "../controllers/appointmentController.js";

const router = Router();

router.post("/", appointmentController.create);
router.get("/", appointmentController.listByDay);
router.put("/:id", appointmentController.update);
router.patch("/:id/cancel", appointmentController.cancel);

export default router;

