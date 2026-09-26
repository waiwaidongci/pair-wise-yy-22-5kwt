import type { ImageStage } from "../constants/ImageStage";
import type { ArchiveStatus } from "../constants/ArchiveStatus";

export interface ImageVersion {
  id: number;
  relic_id: number;
  plan_id: number;
  /** 部位：同一文物+方案+部位构成一个对照组。 */
  position: string;
  /** 阶段：PRE_OP 术前 / POST_OP 术后。 */
  stage: ImageStage;
  /** 部位组内版次，补传只追加新版本。 */
  version_no: number;
  /** 兼容旧字段，与 stage 保持一致。 */
  image_type: string;
  file_path: string;
  file_name: string;
  capture_at: string;
  note: string;
  archive_status: ArchiveStatus;
  created_at: string;
}

export interface ImageGapItem {
  relic_id: number;
  plan_id: number;
  position: string;
  missing: string[];
}

export interface ImageComparisonGroup {
  relic_id: number;
  plan_id: number;
  position: string;
  pre_versions: ImageVersion[];
  post_versions: ImageVersion[];
  missing_sides: ImageStage[];
  status: "READY" | "PENDING" | "ARCHIVED";
  version_count: number;
  latest_pre?: ImageVersion;
  latest_post?: ImageVersion;
  latest_capture_at?: string;
}

export interface ImageGroupOverview {
  archived: ImageComparisonGroup[];
  ready: ImageComparisonGroup[];
  pending: ImageComparisonGroup[];
  gap_list: ImageGapItem[];
}

/** 上传表单。 */
export interface ImageUploadForm {
  relic_id?: number;
  plan_id?: number;
  position: string;
  stage: ImageStage;
  capture_at: string;
  note: string;
  file?: File;
}
