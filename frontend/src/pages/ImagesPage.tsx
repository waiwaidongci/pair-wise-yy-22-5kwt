import { useEffect, useMemo, useState } from "react";
import { ImageStage, ImageStageText } from "../constants/ImageStage";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { createImageVersionForm, type ImageVersionForm } from "../constructors/ImageVersionConstructor";
import { useImageVersionCompare } from "../hooks/useImageVersionCompare";
import { useImageVersionStore } from "../stores/ImageVersionStore";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { ImageCompare } from "../components/common/ImageCompare";
import { StatCard } from "../components/common/StatCard";
import { EmptyState } from "../components/common/EmptyState";

export function ImagesPage() {
  const { rows, pairs, error, load, upload, archive } = useImageVersionStore();
  const relics = useRelicItemStore((state) => state.rows);
  const loadRelics = useRelicItemStore((state) => state.load);
  const plans = useRestorationPlanStore((state) => state.rows);
  const loadPlans = useRestorationPlanStore((state) => state.load);

  const [form, setForm] = useState<ImageVersionForm>(createImageVersionForm());
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [archivingKey, setArchivingKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    void load();
    void loadRelics();
    void loadPlans();
  }, [load, loadRelics, loadPlans]);

  const { complete, pending, archived } = useImageVersionCompare(pairs);

  const relicNames = useMemo(() => new Map(relics.map((relic) => [relic.id, relic.name])), [relics]);
  const planTitles = useMemo(() => new Map(plans.map((plan) => [plan.id, plan.plan_title])), [plans]);
  const relicPlans = useMemo(
    () => plans.filter((plan) => String(plan.relic_id) === form.relic_id),
    [plans, form.relic_id]
  );
  const knownPositions = useMemo(
    () => [...new Set(rows.filter((row) => String(row.relic_id) === form.relic_id).map((row) => row.position))],
    [rows, form.relic_id]
  );

  const patch = (changes: Partial<ImageVersionForm>) => setForm((prev) => ({ ...prev, ...changes }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setNotice(null);
    if (!form.relic_id || !form.plan_id || !form.position.trim() || !form.capture_at) {
      setFormError(ERROR_MESSAGES.VALIDATION_FAILED);
      return;
    }
    setSubmitting(true);
    const ok = await upload({
      relic_id: Number(form.relic_id),
      plan_id: Number(form.plan_id),
      position: form.position.trim(),
      stage: form.stage,
      capture_at: new Date(form.capture_at).toISOString(),
      note: form.note.trim(),
      file_path: file ? `/uploads/${file.name}` : ""
    });
    setSubmitting(false);
    if (!ok) return;
    setNotice(`已新增 ${ImageStageText[form.stage as keyof typeof ImageStageText] ?? form.stage}影像版本，旧版本保留`);
    setForm(createImageVersionForm({ relic_id: form.relic_id, plan_id: form.plan_id, position: form.position }));
    setFile(null);
  };

  const onArchive = async (pair: (typeof pairs)[number]) => {
    setNotice(null);
    const key = `${pair.relic_id}#${pair.plan_id}#${pair.position}`;
    setArchivingKey(key);
    const ok = await archive(pair);
    setArchivingKey(null);
    if (ok) setNotice(`部位「${pair.position}」已归档`);
  };

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">relic-restore</p>
          <h1>影像对照档案</h1>
        </div>
      </section>

      <section className="metrics">
        <StatCard label="影像版本" value={rows.length} />
        <StatCard label="已配齐部位" value={complete.length} />
        <StatCard label="待配部位" value={pending.length} />
        <StatCard label="已归档部位" value={archived.length} />
      </section>

      {(formError || error || notice) && (
        <section className={formError || error ? "banner error" : "banner ok"}>{formError ?? error ?? notice}</section>
      )}

      <section className="panel wide">
        <h2>上传影像</h2>
        <form className="upload-form" onSubmit={submit}>
          <label>
            文物
            <select value={form.relic_id} onChange={(e) => patch({ relic_id: e.target.value, plan_id: "" })} required>
              <option value="">请选择文物</option>
              {relics.map((relic) => (
                <option key={relic.id} value={relic.id}>
                  {relic.relic_code} · {relic.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            修复方案
            <select value={form.plan_id} onChange={(e) => patch({ plan_id: e.target.value })} required disabled={!form.relic_id}>
              <option value="">请选择方案</option>
              {relicPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.plan_title}
                </option>
              ))}
            </select>
          </label>
          <label>
            部位
            <input
              value={form.position}
              onChange={(e) => patch({ position: e.target.value })}
              list="known-positions"
              placeholder="如：腹部裂纹"
              required
            />
            <datalist id="known-positions">
              {knownPositions.map((position) => (
                <option key={position} value={position} />
              ))}
            </datalist>
          </label>
          <label>
            阶段
            <select value={form.stage} onChange={(e) => patch({ stage: e.target.value })}>
              {ImageStage.map((stage) => (
                <option key={stage} value={stage}>
                  {ImageStageText[stage]}
                </option>
              ))}
            </select>
          </label>
          <label>
            拍摄时间
            <input
              type="datetime-local"
              value={form.capture_at}
              onChange={(e) => patch({ capture_at: e.target.value })}
              required
            />
          </label>
          <label>
            影像文件
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <label className="span-2">
            说明
            <textarea
              value={form.note}
              onChange={(e) => patch({ note: e.target.value })}
              rows={2}
              placeholder="拍摄角度、光线、修复进度等"
            />
          </label>
          <div className="form-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? "上传中…" : "上传新版本"}
            </button>
            <span className="hint">同一部位可多次上传，每次生成新版本，旧照片保留不删</span>
          </div>
        </form>
      </section>

      <section className="panel wide">
        <h2>对照档案（术前术后已配齐）</h2>
        {complete.length === 0 ? (
          <EmptyState title="暂无配齐的部位" />
        ) : (
          <div className="compare-list">
            {complete.map((pair) => (
              <ImageCompare
                key={`${pair.relic_id}#${pair.plan_id}#${pair.position}`}
                pair={pair}
                relicName={relicNames.get(pair.relic_id)}
                planTitle={planTitles.get(pair.plan_id)}
                archiving={archivingKey === `${pair.relic_id}#${pair.plan_id}#${pair.position}`}
                onArchive={pair.archived ? undefined : onArchive}
              />
            ))}
          </div>
        )}
      </section>

      <section className="panel wide">
        <h2>待配区（缺术前或术后）</h2>
        {pending.length === 0 ? (
          <EmptyState title="没有待配部位，全部配齐" />
        ) : (
          <div className="compare-list">
            {pending.map((pair) => (
              <ImageCompare
                key={`${pair.relic_id}#${pair.plan_id}#${pair.position}`}
                pair={pair}
                relicName={relicNames.get(pair.relic_id)}
                planTitle={planTitles.get(pair.plan_id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
