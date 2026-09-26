import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { config } from "./config/env";
import { authMiddleware } from "./middlewares/authMiddleware";
import { auditLogMiddleware } from "./middlewares/auditLogMiddleware";
import { requestLoggerMiddleware } from "./middlewares/requestLoggerMiddleware";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import relicItemRoutes from "./routes/RelicItemRoutes";
import damageRecordRoutes from "./routes/DamageRecordRoutes";
import restorationPlanRoutes from "./routes/RestorationPlanRoutes";
import restorationStepRoutes from "./routes/RestorationStepRoutes";
import imageVersionRoutes from "./routes/ImageVersionRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLoggerMiddleware);
app.use(authMiddleware);
app.use(auditLogMiddleware);

// 上传影像随 dataDir 落盘，静态托管保证重启后旧照片仍可访问。
const uploadDir = path.join(config.dataDir, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

app.get("/health", (_req, res) => res.json({ status: "ok", service: "relic-restore" }));
app.use("/api/relic-item", relicItemRoutes);
app.use("/api/damage-record", damageRecordRoutes);
app.use("/api/restoration-plan", restorationPlanRoutes);
app.use("/api/restoration-step", restorationStepRoutes);
app.use("/api/image-version", imageVersionRoutes);
app.use(errorHandlerMiddleware);
app.listen(config.port, () => console.log("relic-restore backend listening on", config.port, "dataDir:", config.dataDir));
