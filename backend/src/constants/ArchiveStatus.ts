/**
 * 影像对照组归档状态：
 * - PENDING  待配区：术前/术后至少缺一侧，或归档后又补传了新版本
 * - ARCHIVED 已归档：术前术后齐全且评审确认归档
 */
export const ARCHIVE_STATUSES = ["PENDING", "ARCHIVED"] as const;
export type ArchiveStatus = (typeof ARCHIVE_STATUSES)[number];
