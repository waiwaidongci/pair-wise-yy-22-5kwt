import { useMemo } from "react";
import { ImageStage } from "../constants/ImageStage";
import type { ImagePairSummary, ImageVersion } from "../types/ImageVersion";

const byCaptureAt = (a: ImageVersion, b: ImageVersion) => a.capture_at.localeCompare(b.capture_at);

export function buildImagePairs(rows: ImageVersion[]): ImagePairSummary[] {
  const groups = new Map<string, ImageVersion[]>();
  rows.forEach((row) => {
    const key = `${row.relic_id}#${row.plan_id}#${row.position}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  });
  return [...groups.values()].map((group) => {
    const first = group[0];
    const missing = ImageStage.filter((stage) => !group.some((row) => row.stage === stage));
    return {
      relic_id: first?.relic_id ?? 0,
      plan_id: first?.plan_id ?? 0,
      position: first?.position ?? "",
      pre: group.filter((row) => row.stage === "PRE").sort(byCaptureAt),
      post: group.filter((row) => row.stage === "POST").sort(byCaptureAt),
      missing,
      archivable: missing.length === 0,
      archived: group.length > 0 && group.every((row) => row.archived)
    };
  });
}

export function useImageVersionCompare(pairs: ImagePairSummary[] = []) {
  return useMemo(
    () => ({
      pairs,
      complete: pairs.filter((pair) => pair.missing.length === 0),
      pending: pairs.filter((pair) => pair.missing.length > 0),
      archived: pairs.filter((pair) => pair.archived)
    }),
    [pairs]
  );
}
