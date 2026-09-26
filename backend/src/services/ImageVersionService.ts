import { imageVersionRepository } from "../repositories/ImageVersionRepository";
import { relicItemRepository } from "../repositories/RelicItemRepository";
import { restorationPlanRepository } from "../repositories/RestorationPlanRepository";
import { groupImageVersions, GAP_TEXT } from "../utils/ImageVersionGrouper";
import { IMAGE_STAGES, isImageStage, type ImageStage } from "../constants/ImageStage";
import type { ImageVersion } from "../models/ImageVersion";
import type { ImageArchivePayload, ImageVersionPayload } from "../types/ImageVersionPayload";
import type { UploadedFile } from "../middlewares/imageUploadMiddleware";
import { badRequest, notFound, ERROR_CODES } from "../utils/AppError";
import { writeAuditLog } from "../utils/auditLog";

function toNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function parsePayload(body: Record<string, unknown>): ImageVersionPayload {
  const relic_id = toNumber(body.relic_id);
  const plan_id = toNumber(body.plan_id);
  const position = typeof body.position === "string" ? body.position.trim() : "";
  const stage = body.stage;
  if (!relic_id || !plan_id || !position || !isImageStage(stage)) {
    throw badRequest(ERROR_CODES.VALIDATION_FAILED, "relic_id, plan_id, position and valid stage are required");
  }
  return {
    relic_id,
    plan_id,
    position,
    stage,
    capture_at: typeof body.capture_at === "string" && body.capture_at ? body.capture_at : undefined,
    note: typeof body.note === "string" ? body.note : ""
  };
}

export const imageVersionService = {
  list(): ImageVersion[] {
    return imageVersionRepository.findAll();
  },

  /** 影像对照档案：按文物+方案+部位分组，标注缺口与归档状态。 */
  listGroups() {
    const groups = groupImageVersions(imageVersionRepository.findAll());
    return {
      archived: groups.filter((group) => group.status === "ARCHIVED"),
      ready: groups.filter((group) => group.status === "READY"),
      pending: groups.filter((group) => group.status === "PENDING"),
      gap_list: groups
        .filter((group) => group.status === "PENDING")
        .map((group) => ({
          relic_id: group.relic_id,
          plan_id: group.plan_id,
          position: group.position,
          missing: group.missing_sides.map((side) => GAP_TEXT[side])
        }))
    };
  },

  /** 上传（补传）一版影像：同一部位追加新版，旧照片一律保留不删。 */
  upload(body: Record<string, unknown>, file: UploadedFile | undefined, actor: string | number = "system") {
    const payload = parsePayload(body);
    if (!file) {
      throw badRequest(ERROR_CODES.IMAGE_FILE_REQUIRED);
    }
    const relic = relicItemRepository.findAll().find((row) => row.id === payload.relic_id);
    if (!relic) throw badRequest(ERROR_CODES.VALIDATION_FAILED, `relic ${payload.relic_id} not found`);
    const plan = restorationPlanRepository
      .findAll()
      .find((row) => row.id === payload.plan_id && row.relic_id === payload.relic_id);
    if (!plan) throw badRequest(ERROR_CODES.VALIDATION_FAILED, "plan not found or does not belong to the relic");

    const existed = imageVersionRepository.findByGroup(payload);
    const record = imageVersionRepository.appendVersion({
      ...payload,
      file_path: file.publicPath,
      file_name: file.originalName,
      capture_at: payload.capture_at ?? new Date().toISOString(),
      note: payload.note ?? ""
    });

    writeAuditLog({
      actor,
      action: existed.length > 0 ? "ImageVersion.versionAdd" : "ImageVersion.upload",
      target_type: "ImageVersion",
      target_id: `${payload.relic_id}/${payload.plan_id}/${payload.position}#v${record.version_no}`,
      detail: `${payload.stage} ${file.fileName}`
    });

    const afterGroup = groupImageVersions(imageVersionRepository.findAll()).find(
      (group) =>
        group.relic_id === payload.relic_id &&
        group.plan_id === payload.plan_id &&
        group.position === payload.position
    );
    if (afterGroup && afterGroup.missing_sides.length > 0) {
      writeAuditLog({
        actor,
        action: "ImageVersion.gapPending",
        target_type: "ImageGroup",
        target_id: `${payload.relic_id}/${payload.plan_id}/${payload.position}`,
        detail: afterGroup.missing_sides.map((side) => GAP_TEXT[side]).join("、")
      });
    }
    return record;
  },

  /** 归档对照组：术前术后两侧都必须有影像，否则留在待配区并返回缺口。 */
  archive(body: ImageArchivePayload, actor: string | number = "system") {
    const relic_id = toNumber(body?.relic_id);
    const plan_id = toNumber(body?.plan_id);
    const position = typeof body?.position === "string" ? body.position.trim() : "";
    if (!relic_id || !plan_id || !position) {
      throw badRequest(ERROR_CODES.VALIDATION_FAILED, "relic_id, plan_id and position are required");
    }
    const key = { relic_id, plan_id, position };
    const group = groupImageVersions(imageVersionRepository.findAll()).find(
      (item) =>
        item.relic_id === relic_id && item.plan_id === plan_id && item.position === position
    );
    if (!group) throw notFound(ERROR_CODES.IMAGE_GROUP_NOT_FOUND);
    if (group.missing_sides.length > 0) {
      throw badRequest(
        ERROR_CODES.IMAGE_SIDE_MISSING,
        `${position}：${group.missing_sides.map((side) => GAP_TEXT[side]).join("、")}，暂不能归档`
      );
    }

    const rows = imageVersionRepository.markGroupArchived(key);
    writeAuditLog({
      actor,
      action: "ImageVersion.archive",
      target_type: "ImageGroup",
      target_id: `${relic_id}/${plan_id}/${position}`,
      detail: `${rows.length} 个版本（旧照片全部保留）`
    });
    return { ...key, archived_versions: rows.length };
  },

  stages(): ImageStage[] {
    return [...IMAGE_STAGES];
  }
};
