import type { ImageComparisonGroup, ImageVersion } from "../types/ImageVersion";

/** 前端与后端一致的分组口径：文物+方案+部位为一个对照组。 */
export function groupImageVersions(rows: ImageVersion[]): ImageComparisonGroup[] {
  const map = new Map<string, ImageVersion[]>();
  for (const row of rows) {
    const key = `${row.relic_id}#${row.plan_id}#${row.position.trim()}`;
    const list = map.get(key);
    if (list) list.push(row);
    else map.set(key, [row]);
  }

  const groups: ImageComparisonGroup[] = [];
  for (const list of map.values()) {
    const pre = list.filter((r) => r.stage === "PRE_OP").sort((a, b) => b.version_no - a.version_no);
    const post = list.filter((r) => r.stage === "POST_OP").sort((a, b) => b.version_no - a.version_no);
    const missingSides: ImageVersion["stage"][] = [];
    if (pre.length === 0) missingSides.push("PRE_OP");
    if (post.length === 0) missingSides.push("POST_OP");
    const allArchived = list.every((r) => r.archive_status === "ARCHIVED");
    groups.push({
      relic_id: list[0].relic_id,
      plan_id: list[0].plan_id,
      position: list[0].position,
      pre_versions: pre,
      post_versions: post,
      missing_sides: missingSides,
      status: allArchived ? "ARCHIVED" : missingSides.length > 0 ? "PENDING" : "READY",
      version_count: list.length,
      latest_pre: pre[0],
      latest_post: post[0],
      latest_capture_at: list.map((r) => r.capture_at).sort().reverse()[0]
    });
  }
  return groups.sort((a, b) => (b.latest_capture_at ?? "").localeCompare(a.latest_capture_at ?? ""));
}
