export interface ImageVersion {
  id: number;
  relic_id: number;
  plan_id: number;
  position: string;
  stage: string;
  version_no: string;
  image_type: string;
  file_path: string;
  capture_at: string;
  note: string;
  archived: boolean;
  archived_at: string | null;
}

export interface ImagePairSummary {
  relic_id: number;
  plan_id: number;
  position: string;
  pre: ImageVersion[];
  post: ImageVersion[];
  missing: string[];
  archivable: boolean;
  archived: boolean;
}

export type ImageVersionPayload = Pick<
  ImageVersion,
  "relic_id" | "plan_id" | "position" | "stage" | "capture_at" | "note" | "file_path"
>;
