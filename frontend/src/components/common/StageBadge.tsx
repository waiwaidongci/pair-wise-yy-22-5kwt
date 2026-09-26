import { ImageStageText, type ImageStage } from "../../constants/ImageStage";

/** 术前/术后阶段徽标，影像页与文物档案页共用。 */
export function StageBadge({ stage }: { stage: ImageStage }) {
  return <span className={`badge stage-${stage.toLowerCase()}`}>{ImageStageText[stage]}</span>;
}
