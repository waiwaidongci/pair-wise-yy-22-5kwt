const STATUS_TEXT: Record<string, string> = {
  READY_TO_ARCHIVE: "可归档",
  WAIT_MATCH: "待配",
  ARCHIVED: "已归档",
  PENDING: "待配",
  LOCAL_DATA: "本地数据",
  READY: "就绪"
};

export function StatusBadge({ value }: { value: string }) {
  const text = STATUS_TEXT[value] ?? String(value).replace(/_/g, " ");
  return <span className={"badge " + String(value).toLowerCase().replace(/_/g, "-")}>{text}</span>;
}
