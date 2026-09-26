import type { ImageStage } from "../constants/ImageStage";

/** 影像上传（multipart/form-data）请求体。 */
export interface ImageVersionPayload {
  relic_id: number;
  plan_id: number;
  position: string;
  stage: ImageStage;
  capture_at?: string;
  note?: string;
}

/** 归档请求体：按文物 + 方案 + 部位定位对照组。 */
export interface ImageArchivePayload {
  relic_id: number;
  plan_id: number;
  position: string;
}
