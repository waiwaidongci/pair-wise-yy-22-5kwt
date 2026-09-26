import type { ImageUploadForm, ImageVersion } from "../types/ImageVersion";
import type { ImageArchivePayload } from "../api/ImageVersion";

/** 新建影像的默认行结构，页面与 store 不直接散写。 */
export const createDefaultImageVersion = (overrides: Partial<ImageVersion> = {}): ImageVersion => ({
  id: 0,
  relic_id: 0,
  plan_id: 0,
  position: "",
  stage: "PRE_OP",
  version_no: 1,
  image_type: "PRE_OP",
  file_path: "",
  file_name: "",
  capture_at: "",
  note: "",
  archive_status: "PENDING",
  created_at: "",
  ...overrides
});

/** 上传表单默认对象，拍摄时间默认当前时刻。 */
export const createImageVersionForm = (
  overrides: Partial<ImageUploadForm> = {}
): ImageUploadForm => ({
  position: "",
  stage: "PRE_OP",
  capture_at: new Date().toISOString().slice(0, 16),
  note: "",
  ...overrides
});

/** 归档请求构造。 */
export const createImageArchiveForm = (
  overrides: Partial<ImageArchivePayload> = {}
): ImageArchivePayload => ({ relic_id: 0, plan_id: 0, position: "", ...overrides });

export const createImageVersionResponse = createDefaultImageVersion;
