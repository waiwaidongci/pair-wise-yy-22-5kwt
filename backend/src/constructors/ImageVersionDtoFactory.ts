import { ImageStage } from "../constants/ImageStage";
import type { ImageVersion } from "../models/ImageVersion";
import type { ImageVersionPayload } from "../types/ImageVersionPayload";

export const createImageVersionDto = (overrides = {}) => ({
  id: 1,
  relic_id: 1,
  plan_id: 1,
  position: "position 1",
  stage: "PRE",
  version_no: "PRE-V1",
  image_type: "PRE",
  file_path: "file path 1",
  capture_at: "2026-06-11T09:00:00Z",
  note: "note 1",
  archived: false,
  archived_at: null,
  ...overrides
});

export const createImageVersionEntity = (
  payload: ImageVersionPayload,
  computed: { id: number; version_no: string }
): ImageVersion => ({
  id: computed.id,
  relic_id: Number(payload.relic_id),
  plan_id: Number(payload.plan_id),
  position: String(payload.position ?? "").trim(),
  stage: String(payload.stage ?? "").toUpperCase(),
  version_no: computed.version_no,
  image_type: String(payload.stage ?? "").toUpperCase(),
  file_path: String(payload.file_path ?? ""),
  capture_at: String(payload.capture_at ?? ""),
  note: String(payload.note ?? ""),
  archived: false,
  archived_at: null
});

export interface ImageVersionPairDto {
  relic_id: number;
  plan_id: number;
  position: string;
  pre: ImageVersion[];
  post: ImageVersion[];
  missing: string[];
  archivable: boolean;
  archived: boolean;
}

const byCaptureAt = (a: ImageVersion, b: ImageVersion) => a.capture_at.localeCompare(b.capture_at);

export const createImageVersionPairDto = (rows: ImageVersion[]): ImageVersionPairDto => {
  const first = rows[0];
  const pre = rows.filter((row) => row.stage === ImageStage[0]).sort(byCaptureAt);
  const post = rows.filter((row) => row.stage === ImageStage[1]).sort(byCaptureAt);
  const missing = ImageStage.filter((stage) => !rows.some((row) => row.stage === stage));
  return {
    relic_id: first?.relic_id ?? 0,
    plan_id: first?.plan_id ?? 0,
    position: first?.position ?? "",
    pre,
    post,
    missing,
    archivable: missing.length === 0,
    archived: rows.length > 0 && rows.every((row) => row.archived)
  };
};
