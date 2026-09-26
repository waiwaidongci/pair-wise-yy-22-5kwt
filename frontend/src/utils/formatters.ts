export const formatDate = (value: string) => value ? new Date(value).toLocaleString("zh-CN") : "—";
export const formatStatus = (value: string) => value.replace(/_/g, " ");
export const formatNumber = (value: number) => new Intl.NumberFormat("zh-CN").format(value);
export const formatRisk = (value: string) => ({ LOW: "低", MEDIUM: "中", HIGH: "高", CRITICAL: "严重", EXTREME: "极高" }[value] ?? value);
export const formatImageStage = (value: string) => ({ PRE_OP: "术前", POST_OP: "术后" }[value] ?? value);
export const formatArchiveStatus = (value: string) =>
  ({ PENDING: "待配", ARCHIVED: "已归档", READY: "可归档" }[value] ?? value);
