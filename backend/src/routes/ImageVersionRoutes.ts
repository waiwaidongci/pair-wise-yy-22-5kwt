import { Router } from "express";
import { imageVersionController } from "../controllers/ImageVersionController";

const router = Router();
router.get("/", imageVersionController.list);
router.get("/pairs", imageVersionController.pairs);
router.post("/", imageVersionController.create);
router.post("/archive", imageVersionController.archive);

export default router;
