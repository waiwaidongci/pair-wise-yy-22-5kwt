import type { ImageStage } from "../constants/ImageStage";
import type { ArchiveStatus } from "../constants/ArchiveStatus";

export interface ImageVersion {
  id: number;
  relic_id: number;
  plan_id: number;
  /** 部位，例如：口沿 / 腹部 / 底部；同一文物+方案+部位构成一个对照组。 */
  position: string;
  /** 阶段：PRE_OP 术前 / POST_OP 术后。 */
  stage: ImageStage;
  /** 该部位组内的版次（从 1 开始，补传只追加新版本，旧版本不删除）。 */
  version_no: number;
  /** 兼容旧字段：与 stage 保持一致。 */
  image_type: string;
  file_path: string;
  file_name: string;
  capture_at: string;
  note: string;
  archive_status: ArchiveStatus;
  created_at: string;
}
