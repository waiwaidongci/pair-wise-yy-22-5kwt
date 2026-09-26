import { Router } from "express";
import { imageVersionController } from "../controllers/ImageVersionController";
import { imageUploadMiddleware } from "../middlewares/imageUploadMiddleware";

const router = Router();

router.get("/", imageVersionController.list);
router.get("/groups", imageVersionController.listGroups);
router.get("/stages", imageVersionController.stages);
router.post("/", imageUploadMiddleware, imageVersionController.upload);
router.post("/archive", imageVersionController.archive);

export default router;
