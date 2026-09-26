export function EmptyState({
  title = "暂无数据",
  hint
}: {
  title?: string;
  hint?: string;
}) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {hint ? <span className="empty-hint">{hint}</span> : null}
    </div>
  );
}
