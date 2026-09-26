import type { Request, Response, NextFunction } from "express";
import { imageVersionService } from "../services/ImageVersionService";
import type { UploadedFile } from "../middlewares/imageUploadMiddleware";

type AsyncRoute = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

const wrap = (handler: AsyncRoute) => (req: Request, res: Response, next: NextFunction) => {
  handler(req, res, next).catch(next);
};

export const imageVersionController = {
  list: wrap(async (_req: Request, res: Response) => {
    res.json(imageVersionService.list());
  }),
  listGroups: wrap(async (_req: Request, res: Response) => {
    res.json(imageVersionService.listGroups());
  }),
  stages: wrap(async (_req: Request, res: Response) => {
    res.json(imageVersionService.stages());
  }),
  // controller 层单独包一层校验错误，避免全局中间件吞掉具体上下文。
  upload: wrap(async (req: Request, res: Response) => {
    const file = (req as unknown as { uploadedFile?: UploadedFile }).uploadedFile;
    try {
      const actor = (req as unknown as { user?: { id?: number } }).user?.id ?? "system";
      const record = imageVersionService.upload(req.body as Record<string, unknown>, file, actor);
      res.status(201).json(record);
    } catch (err) {
      if (file) {
        console.warn("[imageVersion] upload rejected, removing staged file", file.fileName);
      }
      throw err;
    }
  }),
  archive: wrap(async (req: Request, res: Response) => {
    const actor = (req as unknown as { user?: { id?: number } }).user?.id ?? "system";
    res.status(200).json(imageVersionService.archive(req.body, actor));
  })
};
