import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { RequestHandler } from "express";
import { config } from "../config/env";

const ALLOWED_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif"
};

export interface UploadedFile {
  originalName: string;
  fileName: string;
  filePath: string;
  publicPath: string;
  mimeType: string;
  size: number;
}

/**
 * 不引入额外依赖的 multipart/form-data 解析：
 * 仅处理单文件字段 file + 文本字段，将影像写入持久化目录 data/uploads。
 */
export const imageUploadMiddleware: RequestHandler = (req, res, next) => {
  const contentType = req.header("content-type") ?? "";
  if (!contentType.startsWith("multipart/form-data")) {
    next();
    return;
  }
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  const boundary = boundaryMatch?.[1] ?? boundaryMatch?.[2];
  if (!boundary) {
    res.status(400).json({ code: "VALIDATION_FAILED", message: "missing multipart boundary" });
    return;
  }

  const chunks: Buffer[] = [];
  let size = 0;
  req.on("data", (chunk: Buffer) => {
    size += chunk.length;
    if (size > config.uploadMaxBytes) {
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on("end", () => {
    try {
      const body = Buffer.concat(chunks);
      const fields: Record<string, string> = {};
      let uploaded: UploadedFile | undefined;
      const delimiter = Buffer.from(`--${boundary}`);

      let start = body.indexOf(delimiter);
      while (start !== -1) {
        const headerStart = start + delimiter.length + 2;
        const next = body.indexOf(delimiter, headerStart);
        if (next === -1) break;
        // 每段结构：头部 \r\n\r\n 内容 \r\n
        const part = body.subarray(headerStart, next);
        const split = part.indexOf("\r\n\r\n");
        if (split !== -1) {
          const rawHeaders = part.subarray(0, split).toString("utf8");
          const content = part.subarray(split + 4, part.length - 2);
          const nameMatch = /name="([^"]+)"/.exec(rawHeaders);
          const filenameMatch = /filename="([^"]*)"/.exec(rawHeaders);
          const fieldName = nameMatch?.[1];
          if (fieldName) {
            if (filenameMatch && filenameMatch[1]) {
              const originalName = path.basename(filenameMatch[1]);
              const mimeMatch = /Content-Type:\s*([^\r\n]+)/i.exec(rawHeaders);
              const mimeType = (mimeMatch?.[1] ?? "").trim().toLowerCase();
              const ext = ALLOWED_EXT[mimeType] ?? (path.extname(originalName) || ".bin");
              const fileName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
              const uploadDir = path.join(config.dataDir, "uploads");
              fs.mkdirSync(uploadDir, { recursive: true });
              const filePath = path.join(uploadDir, fileName);
              fs.writeFileSync(filePath, content);
              uploaded = {
                originalName,
                fileName,
                filePath,
                publicPath: `/uploads/${fileName}`,
                mimeType,
                size: content.length
              };
            } else if (fieldName !== "file") {
              fields[fieldName] = content.toString("utf8");
            }
          }
        }
        start = next;
      }

      req.body = fields;
      (req as unknown as { uploadedFile?: UploadedFile }).uploadedFile = uploaded;
      next();
    } catch (err) {
      next(err);
    }
  });
  req.on("error", next);
};
