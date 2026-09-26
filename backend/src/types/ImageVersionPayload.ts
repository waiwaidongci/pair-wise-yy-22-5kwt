export interface ImageVersionPayload {
  relic_id?: number | string;
  plan_id?: number | string;
  position?: string;
  stage?: string;
  capture_at?: string;
  note?: string;
  file_path?: string;
}

export interface ImageVersionArchivePayload {
  relic_id?: number | string;
  plan_id?: number | string;
  position?: string;
}
