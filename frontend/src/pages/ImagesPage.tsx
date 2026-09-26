import { useEffect, useState } from "react";
import { useImageVersionStore } from "../stores/ImageVersionStore";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { UploadImagePanel } from "../components/image/UploadImagePanel";
import { ImageGroupCard } from "../components/image/ImageGroupCard";
import { EmptyState } from "../components/common/EmptyState";
import { StatCard } from "../components/common/StatCard";
import { GroupStatusText } from "../constants/ArchiveStatus";

type TabKey = "archived" | "ready" | "pending";

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "archived", label: "已归档" },
  { key: "ready", label: "可归档" },
  { key: "pending", label: "待配区" }
];

export function ImagesPage() {
  const imageStore = useImageVersionStore();
  const relicStore = useRelicItemStore();
  const planStore = useRestorationPlanStore();
  const [tab, setTab] = useState<TabKey>("pending");

  useEffect(() => {
    imageStore.load();
    relicStore.load();
    planStore.load();
    // 仅在挂载时加载一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups = imageStore[tab];

  return (
    <main className="page images-page">
      <section className="page-head">
        <div>
          <p className="eyebrow">relic-restore</p>
          <h1>影像对照档案</h1>
          <p className="page-desc">按「文物 · 方案 · 部位」建立术前/术后对照；同一部位保留多版，两侧齐全方可归档。</p>
        </div>
      </section>

      <section className="metrics metrics-4">
        <StatCard label="已归档部位" value={imageStore.archived.length} />
        <StatCard label="可归档（待确认）" value={imageStore.ready.length} />
        <StatCard label="待配部位" value={imageStore.pending.length} />
        <StatCard label="影像版本总数" value={imageStore.rows.length} />
      </section>

      {imageStore.gapList.length > 0 ? (
        <section className="panel gap-summary">
          <h2>待配缺口清单</h2>
          <ul>
            {imageStore.gapList.map((gap) => {
              const relic = relicStore.rows.find((r) => r.id === gap.relic_id);
              return (
                <li key={`${gap.relic_id}-${gap.plan_id}-${gap.position}`}>
                  <strong>{relic?.name ?? `文物#${gap.relic_id}`}「{gap.position}」</strong>
                  {gap.missing.map((m) => (
                    <span key={m} className="gap-chip">{m}</span>
                  ))}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => setTab("pending")}
                  >
                    去补传 →
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <UploadImagePanel relics={relicStore.rows} plans={planStore.rows} />
      {imageStore.error ? <div className="error-banner">{imageStore.error}</div> : null}

      <section className="panel archive-board">
        <div className="tab-bar" role="tablist">
          {TABS.map((item) => (
            <button
              key={item.key}
              role="tab"
              aria-selected={tab === item.key}
              className={tab === item.key ? "tab active" : "tab"}
              onClick={() => setTab(item.key)}
            >
              {item.label}
              <span className="tab-count">{imageStore[item.key].length}</span>
            </button>
          ))}
          <span className="tab-hint">
            {tab === "pending"
              ? "缺术前或术后的部位留在待配区"
              : tab === "ready"
                ? GroupStatusText.READY + "：两侧齐全，评审确认后归档"
                : GroupStatusText.ARCHIVED + "：旧照片全部保留，补传新版本将回到待配区"}
          </span>
        </div>

        {imageStore.loading ? (
          <EmptyState title="影像加载中…" />
        ) : groups.length === 0 ? (
          <EmptyState
            title={tab === "pending" ? "待配区暂无缺口" : tab === "ready" ? "没有待确认归档的部位" : "还没有归档部位"}
            hint={tab === "pending" ? "所有建档部位的术前/术后影像均已齐备" : undefined}
          />
        ) : (
          <div className="group-list">
            {groups.map((group) => (
              <ImageGroupCard
                key={`${group.relic_id}-${group.plan_id}-${group.position}`}
                group={group}
                relics={relicStore.rows}
                plans={planStore.rows}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
