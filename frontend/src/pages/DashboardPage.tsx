import { StatCard } from "../components/common/StatCard";

export function DashboardPage() {
  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">relic-restore</p>
          <h1>修复工作台</h1>
        </div>
      </section>
      <section className="metrics metrics-4">
        <StatCard label="待审批方案" value={0} />
        <StatCard label="重度病害" value={0} />
        <StatCard label="修复中方案" value={0} />
        <StatCard label="影像归档量" value={0} />
      </section>
      <section className="panel">
        <p>工作台统计指标建设中，影像对照档案请前往「影像版本」页。</p>
      </section>
    </main>
  );
}
