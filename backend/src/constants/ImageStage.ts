export const ImageStage = ["PRE", "POST"] as const;
export type ImageStage = (typeof ImageStage)[number];
