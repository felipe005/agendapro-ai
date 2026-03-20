import { Router } from "express";
import authRoutes from "./authRoutes.js";
import clientRoutes from "./clientRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", app: "AgendaPro AI" });
});

router.use("/auth", authRoutes);
router.use("/clients", authMiddleware, clientRoutes);
router.use("/appointments", authMiddleware, appointmentRoutes);
router.use("/dashboard", authMiddleware, dashboardRoutes);

export default router;

