import type { ImageVersion } from "../types/ImageVersion";

export const createDefaultImageVersion = (overrides: Partial<ImageVersion> = {}): ImageVersion => ({
  id: 0,
  relic_id: 0,
  plan_id: 0,
  position: "",
  stage: "PRE",
  version_no: "PRE-V1",
  image_type: "PRE",
  file_path: "",
  capture_at: "",
  note: "",
  archived: false,
  archived_at: null,
  ...overrides
});

export interface ImageVersionForm {
  relic_id: string;
  plan_id: string;
  position: string;
  stage: string;
  capture_at: string;
  note: string;
}

export const createImageVersionForm = (overrides: Partial<ImageVersionForm> = {}): ImageVersionForm => ({
  relic_id: "",
  plan_id: "",
  position: "",
  stage: "PRE",
  capture_at: "",
  note: "",
  ...overrides
});

export const createImageVersionResponse = createDefaultImageVersion;
