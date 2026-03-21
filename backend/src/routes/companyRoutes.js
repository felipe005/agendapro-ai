import { Router } from "express";
import { companyController } from "../controllers/companyController.js";

const router = Router();

router.get("/", companyController.getProfile);
router.put("/", companyController.updateProfile);
router.put("/hours", companyController.updateBusinessHours);
router.get("/availability", companyController.getAvailableSlots);

export default router;
