import type { ImageVersion } from "../models/ImageVersion";
import type { ImageStage } from "../constants/ImageStage";

export type GroupArchiveStatus = "READY" | "PENDING" | "ARCHIVED";

export interface ImageComparisonGroup {
  relic_id: number;
  plan_id: number;
  position: string;
  pre_versions: ImageVersion[];
  post_versions: ImageVersion[];
  /** 待配缺口：缺术前 / 缺术后；两侧齐全时为空数组。 */
  missing_sides: ImageStage[];
  /** READY=两侧齐全可归档；PENDING=缺一侧留在待配区；ARCHIVED=已归档。 */
  status: GroupArchiveStatus;
  version_count: number;
  latest_pre?: ImageVersion;
  latest_post?: ImageVersion;
  latest_capture_at?: string;
}

/** 按 文物 + 方案 + 部位 把影像版本聚成对照组。 */
export function groupImageVersions(rows: ImageVersion[]): ImageComparisonGroup[] {
  const groupMap = new Map<string, ImageVersion[]>();
  for (const row of rows) {
    const key = `${row.relic_id}#${row.plan_id}#${row.position.trim()}`;
    const list = groupMap.get(key);
    if (list) list.push(row);
    else groupMap.set(key, [row]);
  }

  const groups: ImageComparisonGroup[] = [];
  for (const list of groupMap.values()) {
    const pre = list
      .filter((row) => row.stage === "PRE_OP")
      .sort((a, b) => b.version_no - a.version_no);
    const post = list
      .filter((row) => row.stage === "POST_OP")
      .sort((a, b) => b.version_no - a.version_no);
    const missingSides: ImageStage[] = [];
    if (pre.length === 0) missingSides.push("PRE_OP");
    if (post.length === 0) missingSides.push("POST_OP");

    // 组状态以是否“全部已归档”为准；归档后补传的新版本 archive_status=PENDING，
    // 整组自动退回 READY（两侧仍齐全），需要重新评审。
    const allArchived = list.every((row) => row.archive_status === "ARCHIVED");
    const status: GroupArchiveStatus = allArchived
      ? "ARCHIVED"
      : missingSides.length > 0
        ? "PENDING"
        : "READY";
    const latestCapture = list
      .map((row) => row.capture_at)
      .sort()
      .reverse()[0];

    groups.push({
      relic_id: list[0].relic_id,
      plan_id: list[0].plan_id,
      position: list[0].position,
      pre_versions: pre,
      post_versions: post,
      missing_sides: missingSides,
      status,
      version_count: list.length,
      latest_pre: pre[0],
      latest_post: post[0],
      latest_capture_at: latestCapture
    });
  }

  return groups.sort((a, b) => (b.latest_capture_at ?? "").localeCompare(a.latest_capture_at ?? ""));
}

export const GAP_TEXT: Record<ImageStage, string> = {
  PRE_OP: "缺术前影像",
  POST_OP: "缺术后影像"
};
