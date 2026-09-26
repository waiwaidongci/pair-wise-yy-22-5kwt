import { useMemo, useState } from "react";
import type { ImageComparisonGroup, ImageVersion } from "../types/ImageVersion";
import type { ImageStage } from "../constants/ImageStage";

interface CompareSelection {
  pre: number; // 选中的术前版次
  post: number; // 选中的术后版次
}

/**
 * 影像前后对照 hook：管理组内多版切换、缺口判断和分页。
 * 同一部位可以留多版，评审可分别选择术前/术后的任意版本对比。
 */
export function useImageVersionCompare(rows: ImageVersion[] = [], pageSize = 6) {
  const groups = useMemo(() => {
    const map = new Map<string, ImageVersion[]>();
    for (const row of rows) {
      const key = `${row.relic_id}#${row.plan_id}#${row.position.trim()}`;
      map.set(key, [...(map.get(key) ?? []), row]);
    }
    return [...map.values()];
  }, [rows]);

  const [page, setPage] = useState(1);
  const pageRows = useMemo(
    () => groups.slice((page - 1) * pageSize, page * pageSize),
    [groups, page, pageSize]
  );

  return { page, setPage, pageSize, pageRows, total: groups.length };
}

/** 单个对照组内的版本选择与缺口信息。 */
export function useGroupCompare(group: ImageComparisonGroup | undefined) {
  const [selection, setSelection] = useState<CompareSelection>(() => ({
    pre: group?.latest_pre?.version_no ?? 0,
    post: group?.latest_post?.version_no ?? 0
  }));

  const selectVersion = (side: ImageStage, versionNo: number) =>
    setSelection((prev) => (side === "PRE_OP" ? { ...prev, pre: versionNo } : { ...prev, post: versionNo }));

  const preVersion = group?.pre_versions.find((v) => v.version_no === selection.pre) ?? group?.latest_pre;
  const postVersion =
    group?.post_versions.find((v) => v.version_no === selection.post) ?? group?.latest_post;

  return { selection, selectVersion, preVersion, postVersion };
}
