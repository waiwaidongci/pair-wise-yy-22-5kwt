import { useMemo, useState } from "react";
import { IMAGE_STAGES, ImageStageText } from "../../constants/ImageStage";
import type { ImageStage } from "../../constants/ImageStage";
import { createImageVersionForm } from "../../constructors/ImageVersionConstructor";
import type { ImageUploadForm } from "../../types/ImageVersion";
import type { RelicItem } from "../../types/RelicItem";
import type { RestorationPlan } from "../../types/RestorationPlan";
import { useImageVersionStore } from "../../stores/ImageVersionStore";

const inputClass = "field-input";

/** 上传面板：选择文物、方案、部位，记录阶段、拍摄时间、说明并选择影像文件。 */
export function UploadImagePanel({ relics, plans }: { relics: RelicItem[]; plans: RestorationPlan[] }) {
  const upload = useImageVersionStore((s) => s.upload);
  const submitting = useImageVersionStore((s) => s.submitting);
  const [form, setForm] = useState<ImageUploadForm>(() => createImageVersionForm());
  const [message, setMessage] = useState<string | null>(null);

  // 方案随文物联动：只能选该文物下的修复方案。
  const planOptions = useMemo(
    () => plans.filter((plan) => !form.relic_id || plan.relic_id === form.relic_id),
    [plans, form.relic_id]
  );
  // 部位建议：取该文物方案下已建组的部位，评审也可直接输入新部位。
  const rows = useImageVersionStore((s) => s.rows);
  const positionOptions = useMemo(() => {
    if (!form.relic_id || !form.plan_id) return [];
    const positions = rows
      .filter((row) => row.relic_id === form.relic_id && row.plan_id === form.plan_id)
      .map((row) => row.position);
    return [...new Set(positions)];
  }, [rows, form.relic_id, form.plan_id]);

  const patch = (partial: Partial<ImageUploadForm>) => setForm((prev) => ({ ...prev, ...partial }));

  const handleRelicChange = (relicId: number) =>
    setForm((prev) => ({ ...prev, relic_id: relicId, plan_id: undefined }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    try {
      const record = await upload(form);
      setMessage(`已上传为「${record.position}」第 ${record.version_no} 版（${ImageStageText[record.stage]}），旧版本保留`);
      setForm(createImageVersionForm({ relic_id: form.relic_id, plan_id: form.plan_id, position: form.position }));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "上传失败");
    }
  };

  const valid = form.relic_id && form.plan_id && form.position.trim() && form.file;

  return (
    <form className="panel upload-panel" onSubmit={handleSubmit}>
      <h2>上传 / 补传影像</h2>
      <p className="panel-tip">同一部位可反复补传，每次提交只新增版本，旧照片不会删除。</p>
      <div className="form-grid">
        <label className="field">
          <span>文物 *</span>
          <select
            className={inputClass}
            value={form.relic_id ?? ""}
            onChange={(e) => handleRelicChange(Number(e.target.value))}
            required
          >
            <option value="" disabled>请选择文物</option>
            {relics.map((relic) => (
              <option key={relic.id} value={relic.id}>{relic.relic_code} · {relic.name}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>修复方案 *</span>
          <select
            className={inputClass}
            value={form.plan_id ?? ""}
            onChange={(e) => patch({ plan_id: Number(e.target.value) })}
            required
            disabled={!form.relic_id}
          >
            <option value="" disabled>请选择方案</option>
            {planOptions.map((plan) => (
              <option key={plan.id} value={plan.id}>{plan.plan_title}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>部位 *（如 口沿 / 腹部 / 莲座）</span>
          <input
            className={inputClass}
            list="position-suggestions"
            value={form.position}
            onChange={(e) => patch({ position: e.target.value })}
            placeholder="填写或选择已建档部位"
            required
          />
          <datalist id="position-suggestions">
            {positionOptions.map((position) => <option key={position} value={position} />)}
          </datalist>
        </label>
        <label className="field">
          <span>阶段 *</span>
          <div className="stage-toggle">
            {IMAGE_STAGES.map((stage: ImageStage) => (
              <button
                type="button"
                key={stage}
                className={form.stage === stage ? `stage-btn active stage-${stage.toLowerCase()}` : "stage-btn"}
                onClick={() => patch({ stage })}
              >
                {ImageStageText[stage]}
              </button>
            ))}
          </div>
        </label>
        <label className="field">
          <span>拍摄时间 *</span>
          <input
            className={inputClass}
            type="datetime-local"
            value={form.capture_at}
            onChange={(e) => patch({ capture_at: e.target.value })}
            required
          />
        </label>
        <label className="field field-wide">
          <span>说明</span>
          <textarea
            className={inputClass}
            rows={2}
            value={form.note}
            onChange={(e) => patch({ note: e.target.value })}
            placeholder="病害现状、修复动作或与旧版的差异"
          />
        </label>
        <label className="field field-wide">
          <span>影像文件 *（jpg / png / webp / gif）</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => patch({ file: e.target.files?.[0] })}
            required
          />
          {form.file ? <span className="file-hint">已选择：{form.file.name}</span> : null}
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" className="primary-btn" disabled={!valid || submitting}>
          {submitting ? "提交中…" : "上传新版本"}
        </button>
        {message ? <span className="form-message">{message}</span> : null}
      </div>
    </form>
  );
}
