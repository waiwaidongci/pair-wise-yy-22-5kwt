/**
 * 影像阶段：术前 / 术后。同一部位必须两侧都有版本才允许归档。
 */
export const IMAGE_STAGES = ["PRE_OP", "POST_OP"] as const;
export type ImageStage = (typeof IMAGE_STAGES)[number];

export function isImageStage(value: unknown): value is ImageStage {
  return typeof value === "string" && (IMAGE_STAGES as readonly string[]).includes(value);
}
