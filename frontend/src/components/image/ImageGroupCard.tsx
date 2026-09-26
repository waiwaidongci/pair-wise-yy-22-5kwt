import { StatusBadge } from "../common/StatusBadge";
import { ImageCompare } from "../common/ImageCompare";
import { useGroupCompare } from "../../hooks/useImageVersionCompare";
import { useImageVersionStore } from "../../stores/ImageVersionStore";
import { formatDate } from "../../utils/formatters";
import { GroupStatusText } from "../../constants/ArchiveStatus";
import type { ImageComparisonGroup } from "../../types/ImageVersion";
import type { RelicItem } from "../../types/RelicItem";
import type { RestorationPlan } from "../../types/RestorationPlan";

interface GroupCardProps {
  group: ImageComparisonGroup;
  relics: RelicItem[];
  plans: RestorationPlan[];
  onArchived?: () => void;
}

/** 单个部位的对照档案卡：术前术后多版切换、缺口提示、归档操作。 */
export function ImageGroupCard({ group, relics, plans, onArchived }: GroupCardProps) {
  const { selectVersion, preVersion, postVersion } = useGroupCompare(group);
  const archive = useImageVersionStore((s) => s.archive);
  const submitting = useImageVersionStore((s) => s.submitting);

  const relic = relics.find((item) => item.id === group.relic_id);
  const plan = plans.find((item) => item.id === group.plan_id);
  const archived = group.status === "ARCHIVED";

  const handleArchive = async () => {
    await archive({ relic_id: group.relic_id, plan_id: group.plan_id, position: group.position });
    onArchived?.();
  };

  return (
    <article className={`panel group-card group-${group.status.toLowerCase()}`}>
      <header className="group-head">
        <div>
          <h3>
            {relic?.name ?? `文物#${group.relic_id}`} · {group.position}
          </h3>
          <p className="group-sub">
            {relic?.relic_code} · {plan?.plan_title ?? `方案#${group.plan_id}`}
          </p>
        </div>
        <div className="group-head-right">
          <StatusBadge
            value={archived ? "ARCHIVED" : group.status === "READY" ? "READY_TO_ARCHIVE" : "WAIT_MATCH"}
          />
          <span className="group-count">共 {group.version_count} 版</span>
        </div>
      </header>

      {group.status === "PENDING" ? (
        <div className="gap-banner">
          待配缺口：
          {group.missing_sides.map((side) => (
            <span key={side} className="gap-chip">
              {side === "PRE_OP" ? "缺术前影像" : "缺术后影像"}
            </span>
          ))}
          <em>—— 补齐两侧后才能归档</em>
        </div>
      ) : null}

      <ImageCompare
        pre={preVersion}
        post={postVersion}
        preOptions={group.pre_versions}
        postOptions={group.post_versions}
        onSelectVersion={selectVersion}
      />

      <footer className="group-foot">
        <span className="group-updated">
          最近拍摄：{group.latest_capture_at ? formatDate(group.latest_capture_at) : "—"}
        </span>
        {archived ? (
          <span className="archived-tip">已归档（{GroupStatusText.ARCHIVED}版本全部保留）</span>
        ) : group.status === "READY" ? (
          <button type="button" className="primary-btn" disabled={submitting} onClick={handleArchive}>
            {submitting ? "归档中…" : "确认归档该部位"}
          </button>
        ) : (
          <span className="pending-tip">停留在待配区，等待补传</span>
        )}
      </footer>
    </article>
  );
}
