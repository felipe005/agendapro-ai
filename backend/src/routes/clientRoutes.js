import { Router } from "express";
import { clientController } from "../controllers/clientController.js";

const router = Router();

router.post("/", clientController.create);
router.get("/", clientController.list);
router.put("/:id", clientController.update);
router.delete("/:id", clientController.remove);

export default router;

