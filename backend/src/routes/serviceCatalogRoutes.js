import { Router } from "express";
import { serviceCatalogController } from "../controllers/serviceCatalogController.js";

const router = Router();

router.get("/", serviceCatalogController.list);
router.post("/", serviceCatalogController.create);
router.put("/:id", serviceCatalogController.update);
router.delete("/:id", serviceCatalogController.remove);

export default router;
