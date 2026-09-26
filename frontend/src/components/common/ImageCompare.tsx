import { formatDate } from "../../utils/formatters";
import type { ImageVersion } from "../../types/ImageVersion";
import { StageBadge } from "./StageBadge";

interface ImageCompareProps {
  /** 术前当前选中版本（缺一侧时传 undefined，展示占位）。 */
  pre?: ImageVersion;
  /** 术后当前选中版本（缺一侧时传 undefined，展示占位）。 */
  post?: ImageVersion;
  preOptions?: ImageVersion[];
  postOptions?: ImageVersion[];
  onSelectVersion?: (side: "PRE_OP" | "POST_OP", versionNo: number) => void;
}

function VersionPane({
  title,
  version,
  options,
  onSelect
}: {
  title: string;
  version?: ImageVersion;
  options?: ImageVersion[];
  onSelect?: (versionNo: number) => void;
}) {
  return (
    <figure className="compare-pane">
      <figcaption className="compare-head">
        <StageBadge stage={title === "术前" ? "PRE_OP" : "POST_OP"} />
        {options && options.length > 0 ? (
          <label className="version-pick">
            版本
            <select
              value={version?.version_no ?? ""}
              onChange={(e) => onSelect?.(Number(e.target.value))}
            >
              {options.map((v) => (
                <option key={v.id} value={v.version_no}>
                  第 {v.version_no} 版
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </figcaption>
      {version ? (
        <>
          <img className="compare-img" src={version.file_path} alt={`${title} 第${version.version_no}版`} />
          <div className="compare-meta">
            <span>第 {version.version_no} 版 · {formatDate(version.capture_at)}</span>
            {version.note ? <p>{version.note}</p> : null}
          </div>
        </>
      ) : (
        <div className="compare-missing">
          <span className="missing-mark">？</span>
          <p>缺{title}影像</p>
        </div>
      )}
    </figure>
  );
}

/**
 * 术前/术后对照组件：文物档案页与影像页共用。
 * 同一部位保留多版时，可分别切换两侧版本；旧版本不删除、可回看。
 */
export function ImageCompare({ pre, post, preOptions, postOptions, onSelectVersion }: ImageCompareProps) {
  return (
    <div className="image-compare">
      <VersionPane title="术前" version={pre} options={preOptions} onSelect={(v) => onSelectVersion?.("PRE_OP", v)} />
      <div className="compare-vs" aria-hidden>对照</div>
      <VersionPane title="术后" version={post} options={postOptions} onSelect={(v) => onSelectVersion?.("POST_OP", v)} />
    </div>
  );
}
