import { Router } from "express";
import authRoutes from "./authRoutes.js";
import clientRoutes from "./clientRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import companyRoutes from "./companyRoutes.js";
import serviceCatalogRoutes from "./serviceCatalogRoutes.js";
import financeRoutes from "./financeRoutes.js";
import insightRoutes from "./insightRoutes.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", app: "AgendaPro AI" });
});

router.use("/auth", authRoutes);
router.use("/clients", authMiddleware, clientRoutes);
router.use("/appointments", authMiddleware, appointmentRoutes);
router.use("/dashboard", authMiddleware, dashboardRoutes);
router.use("/company", authMiddleware, companyRoutes);
router.use("/services", authMiddleware, serviceCatalogRoutes);
router.use("/finance", authMiddleware, financeRoutes);
router.use("/insights", authMiddleware, insightRoutes);

export default router;
