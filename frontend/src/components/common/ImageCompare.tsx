import { formatDate, formatGap, formatStage } from "../../utils/formatters";
import type { ImagePairSummary, ImageVersion } from "../../types/ImageVersion";
import { StatusBadge } from "./StatusBadge";

function VersionList({ versions }: { versions: ImageVersion[] }) {
  return (
    <ul className="version-list">
      {versions.map((version) => (
        <li key={version.id}>
          <div className="version-head">
            <StatusBadge value={version.version_no} />
            <time>{formatDate(version.capture_at)}</time>
          </div>
          <p className="version-note">{version.note || "（无说明）"}</p>
          <p className="version-file">{version.file_path || "未关联文件"}</p>
        </li>
      ))}
    </ul>
  );
}

function StageColumn({ stage, versions }: { stage: string; versions: ImageVersion[] }) {
  if (versions.length === 0) {
    return (
      <div className="stage-column">
        <h4>{formatStage(stage)}</h4>
        <div className="gap-slot">缺{formatStage(stage)}影像</div>
      </div>
    );
  }
  return (
    <div className="stage-column">
      <h4>
        {formatStage(stage)}（{versions.length} 版）
      </h4>
      <VersionList versions={versions} />
    </div>
  );
}

export function ImageCompare({
  pair,
  relicName,
  planTitle,
  archiving = false,
  onArchive
}: {
  pair: ImagePairSummary;
  relicName?: string;
  planTitle?: string;
  archiving?: boolean;
  onArchive?: (pair: ImagePairSummary) => void;
}) {
  return (
    <article className="compare-card">
      <header className="compare-head">
        <div>
          <strong>{pair.position}</strong>
          <span className="compare-meta">
            {relicName ?? `文物 #${pair.relic_id}`} · {planTitle ?? `方案 #${pair.plan_id}`}
          </span>
        </div>
        {pair.archived ? <StatusBadge value="ARCHIVED" /> : pair.archivable ? <StatusBadge value="READY" /> : <StatusBadge value="PENDING" />}
      </header>
      <div className="compare-grid">
        <StageColumn stage="PRE" versions={pair.pre} />
        <StageColumn stage="POST" versions={pair.post} />
      </div>
      <footer className="compare-foot">
        {pair.missing.length > 0 ? (
          <span className="gap-text">缺口：缺{formatGap(pair.missing)}影像，配齐后方可归档</span>
        ) : pair.archived ? (
          <span className="gap-text done">术前术后已配齐，档案已归档</span>
        ) : (
          <span className="gap-text done">术前术后已配齐，可归档</span>
        )}
        {!pair.archived && pair.archivable && onArchive && (
          <button type="button" disabled={archiving} onClick={() => onArchive(pair)}>
            {archiving ? "归档中…" : "归档"}
          </button>
        )}
      </footer>
    </article>
  );
}
