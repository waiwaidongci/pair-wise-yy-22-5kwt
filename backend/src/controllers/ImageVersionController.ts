import type { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { imageVersionService } from "../services/ImageVersionService";

const wrap = (err: unknown) => {
  const error = (err ?? {}) as { status?: number; code?: string; message?: string };
  return {
    status: error.status ?? 500,
    code: error.code ?? "INTERNAL_ERROR",
    message: error.message ?? ERROR_MESSAGES.VALIDATION_FAILED
  };
};

export const imageVersionController = {
  list: (_req: Request, res: Response) => res.json(imageVersionService.list()),
  pairs: (_req: Request, res: Response) => res.json(imageVersionService.pairs()),
  create: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(imageVersionService.create(req.body));
    } catch (err) {
      next(wrap(err));
    }
  },
  archive: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(imageVersionService.archive(req.body));
    } catch (err) {
      next(wrap(err));
    }
  }
};
