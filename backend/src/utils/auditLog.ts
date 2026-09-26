import fs from "fs";
import path from "path";
import { config } from "../config/env";
import { LOG_TEMPLATES } from "../constants/logTemplates";

export type ImageAuditAction = (typeof LOG_TEMPLATES.ImageVersion)[number];

export interface AuditEntry {
  actor: string | number;
  action: string;
  target_type: string;
  target_id: string;
  detail?: string;
}

/** 写操作落盘到 data/audit.log（JSON Lines），随命名卷持久保存。 */
export function writeAuditLog(entry: AuditEntry) {
  const line = JSON.stringify({ ...entry, created_at: new Date().toISOString() }) + "\n";
  fs.mkdirSync(config.dataDir, { recursive: true });
  fs.appendFileSync(path.join(config.dataDir, "audit.log"), line, "utf8");
  console.info("[audit]", entry.action, entry.target_type, entry.target_id, entry.detail ?? "");
}
