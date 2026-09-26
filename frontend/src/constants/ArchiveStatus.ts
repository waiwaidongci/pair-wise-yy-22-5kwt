/** 影像对照组归档状态：待配 / 已归档。 */
export const ARCHIVE_STATUSES = ["PENDING", "ARCHIVED"] as const;
export type ArchiveStatus = (typeof ARCHIVE_STATUSES)[number];

export const ArchiveStatusText: Record<ArchiveStatus, string> = {
  PENDING: "待配",
  ARCHIVED: "已归档"
};

/** 对照组展示状态：缺一侧进待配区，两侧齐全可归档，归档后锁定。 */
export const GROUP_STATUSES = ["READY", "PENDING", "ARCHIVED"] as const;
export type GroupStatus = (typeof GROUP_STATUSES)[number];

export const GroupStatusText: Record<GroupStatus, string> = {
  READY: "可归档",
  PENDING: "待配",
  ARCHIVED: "已归档"
};
