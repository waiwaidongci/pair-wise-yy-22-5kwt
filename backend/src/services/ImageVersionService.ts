import { ImageStage } from "../constants/ImageStage";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { createImageVersionEntity, createImageVersionPairDto } from "../constructors/ImageVersionDtoFactory";
import { imageVersionRepository } from "../repositories/ImageVersionRepository";
import type { ImageVersion } from "../models/ImageVersion";
import type { ImageVersionArchivePayload, ImageVersionPayload } from "../types/ImageVersionPayload";

const fail = (status: number, code: keyof typeof ERROR_CODES): never => {
  throw { status, code, message: ERROR_MESSAGES[code] };
};

const buildPairs = (rows: ImageVersion[]) => {
  const groups = new Map<string, ImageVersion[]>();
  rows.forEach((row) => {
    const key = `${row.relic_id}#${row.plan_id}#${row.position}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  });
  return [...groups.values()].map((group) => createImageVersionPairDto(group));
};

const normalizeKey = (payload: ImageVersionPayload | ImageVersionArchivePayload) => {
  const relicId = Number(payload.relic_id);
  const planId = Number(payload.plan_id);
  const position = String(payload.position ?? "").trim();
  if (!relicId || !planId || !position) fail(400, "VALIDATION_FAILED");
  return { relicId, planId, position };
};

export const imageVersionService = {
  list: () => imageVersionRepository.findAll(),

  pairs: () => buildPairs(imageVersionRepository.findAll()),

  create(payload: ImageVersionPayload) {
    const { relicId, planId, position } = normalizeKey(payload);
    const stage = String(payload.stage ?? "").toUpperCase();
    const captureAt = String(payload.capture_at ?? "").trim();
    if (!captureAt || !(ImageStage as readonly string[]).includes(stage)) fail(400, "VALIDATION_FAILED");
    const seq = imageVersionRepository.countVersions(relicId, planId, position, stage) + 1;
    const entity = createImageVersionEntity(
      { ...payload, relic_id: relicId, plan_id: planId, position, stage, capture_at: captureAt },
      { id: imageVersionRepository.nextId(), version_no: `${stage}-V${seq}` }
    );
    console.info(LOG_TEMPLATES.ImageVersion[0], entity.id, entity.position, entity.stage, entity.version_no);
    return imageVersionRepository.insert(entity);
  },

  archive(payload: ImageVersionArchivePayload) {
    const { relicId, planId, position } = normalizeKey(payload);
    const pair = buildPairs(imageVersionRepository.findAll()).find(
      (item) => item.relic_id === relicId && item.plan_id === planId && item.position === position
    );
    if (!pair || !pair.archivable) {
      console.info(LOG_TEMPLATES.ImageVersion[5], relicId, planId, position, pair?.missing ?? ImageStage);
      fail(409, "IMAGE_PAIR_INCOMPLETE");
    }
    const rows = imageVersionRepository.archiveGroup(relicId, planId, position, new Date().toISOString());
    console.info(LOG_TEMPLATES.ImageVersion[4], relicId, planId, position);
    return createImageVersionPairDto(rows);
  }
};
