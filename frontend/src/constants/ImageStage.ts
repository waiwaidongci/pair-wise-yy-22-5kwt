/** 影像阶段：术前 / 术后。同一部位两侧齐全才允许归档。 */
export const IMAGE_STAGES = ["PRE_OP", "POST_OP"] as const;
export type ImageStage = (typeof IMAGE_STAGES)[number];

export const ImageStageText: Record<ImageStage, string> = {
  PRE_OP: "术前",
  POST_OP: "术后"
};

export const ImageStageGapText: Record<ImageStage, string> = {
  PRE_OP: "缺术前影像",
  POST_OP: "缺术后影像"
};
