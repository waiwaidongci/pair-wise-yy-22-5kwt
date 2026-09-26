import { fileStore } from "./FileStore";
import { seed } from "../seed";
import type { ImageVersion } from "../models/ImageVersion";
import type { ImageStage } from "../constants/ImageStage";
import type { ArchiveStatus } from "../constants/ArchiveStatus";

const TABLE = "imageVersion";

export interface ImageGroupKey {
  relic_id: number;
  plan_id: number;
  position: string;
}

export interface NewImageVersionInput extends ImageGroupKey {
  stage: ImageStage;
  file_path: string;
  file_name: string;
  capture_at: string;
  note: string;
}

export const imageVersionRepository = {
  findAll(): ImageVersion[] {
    return fileStore.seedIfAbsent(
      TABLE,
      seed.imageVersion as unknown as Array<Record<string, unknown>>
    ) as unknown as ImageVersion[];
  },
  findByGroup(key: ImageGroupKey): ImageVersion[] {
    return this.findAll().filter(
      (row) =>
        row.relic_id === key.relic_id &&
        row.plan_id === key.plan_id &&
        row.position.trim() === key.position.trim()
    );
  },
  /** 同部位补传：版次取该组当前最大版次 + 1，永远追加，旧照片不删。 */
  appendVersion(input: NewImageVersionInput): ImageVersion {
    const rows = this.findAll();
    const groupRows = rows.filter(
      (row) =>
        row.relic_id === input.relic_id &&
        row.plan_id === input.plan_id &&
        row.position.trim() === input.position.trim()
    );
    const versionNo = groupRows.reduce((max, row) => Math.max(max, Number(row.version_no) || 0), 0) + 1;
    const now = new Date().toISOString();
    const row: ImageVersion = {
      id: fileStore.nextId(TABLE),
      relic_id: input.relic_id,
      plan_id: input.plan_id,
      position: input.position.trim(),
      stage: input.stage,
      version_no: versionNo,
      image_type: input.stage,
      file_path: input.file_path,
      file_name: input.file_name,
      capture_at: input.capture_at,
      note: input.note,
      // 新版本一律为待配；已归档组补传后整组退回，等两侧最新影像重新评审。
      archive_status: "PENDING" as ArchiveStatus,
      created_at: now
    };
    return fileStore.insert(TABLE, row as unknown as Record<string, unknown>) as unknown as ImageVersion;
  },
  /** 归档：把同组所有版本置为 ARCHIVED，旧照片全部保留。 */
  markGroupArchived(key: ImageGroupKey): ImageVersion[] {
    const groupRows = this.findByGroup(key);
    for (const row of groupRows) {
      fileStore.update(TABLE, row.id, { archive_status: "ARCHIVED" });
      row.archive_status = "ARCHIVED";
    }
    return groupRows;
  }
};
