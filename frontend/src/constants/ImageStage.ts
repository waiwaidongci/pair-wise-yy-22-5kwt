export const ImageStage = ["PRE", "POST"] as const;
export type ImageStage = (typeof ImageStage)[number];
export const ImageStageText: Record<ImageStage, string> = { PRE: "术前", POST: "术后" };
