import { mockData } from "../mocks/seedData";
import type {
  ImageComparisonGroup,
  ImageGapItem,
  ImageUploadForm,
  ImageVersion
} from "../types/ImageVersion";
import { groupImageVersions } from "../utils/imageGrouper";

const endpoint = "/api/image-version";

export interface ImageArchivePayload {
  relic_id: number;
  plan_id: number;
  position: string;
}

interface GroupOverview {
  archived: ImageComparisonGroup[];
  ready: ImageComparisonGroup[];
  pending: ImageComparisonGroup[];
  gap_list: ImageGapItem[];
}

async function readJsonOrThrow(res: Response) {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload?.message ?? `请求失败（${res.status}）`);
  }
  return payload;
}

export async function listImageVersion(): Promise<ImageVersion[]> {
  try {
    const res = await fetch(endpoint);
    if (res.ok) return (await res.json()) as ImageVersion[];
  } catch {
    // Local mock fallback keeps the UI available during offline review.
  }
  return mockData.imageVersion as unknown as ImageVersion[];
}

/** 对照档案总览：已归档 / 可归档 / 待配缺口。接口失败时由前端按同一口径兜底分组。 */
export async function listImageGroups(): Promise<GroupOverview> {
  try {
    const res = await fetch(`${endpoint}/groups`);
    if (res.ok) return await res.json();
  } catch {
    // fall through to local fallback
  }
  const rows = await listImageVersion();
  const groups = groupImageVersions(rows);
  return {
    archived: groups.filter((g) => g.status === "ARCHIVED"),
    ready: groups.filter((g) => g.status === "READY"),
    pending: groups.filter((g) => g.status === "PENDING"),
    gap_list: groups
      .filter((g) => g.status === "PENDING")
      .map((g) => ({
        relic_id: g.relic_id,
        plan_id: g.plan_id,
        position: g.position,
        missing: g.missing_sides.map((s) => (s === "PRE_OP" ? "缺术前影像" : "缺术后影像"))
      }))
  };
}

/** 上传（补传）影像：multipart 表单；同部位重复提交只新增版本，旧版不删。 */
export async function saveImageVersion(form: ImageUploadForm): Promise<ImageVersion> {
  if (!form.file) {
    throw new Error("请选择需要上传的影像文件");
  }
  const body = new FormData();
  body.append("relic_id", String(form.relic_id));
  body.append("plan_id", String(form.plan_id));
  body.append("position", form.position.trim());
  body.append("stage", form.stage);
  body.append("capture_at", form.capture_at ? new Date(form.capture_at).toISOString() : "");
  body.append("note", form.note ?? "");
  body.append("file", form.file);

  const res = await fetch(endpoint, { method: "POST", body });
  return (await readJsonOrThrow(res)) as ImageVersion;
}

/** 归档对照组：仅在术前术后都有版本时成功。 */
export async function archiveImageGroup(payload: ImageArchivePayload): Promise<{ archived_versions: number }> {
  const res = await fetch(`${endpoint}/archive`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return readJsonOrThrow(res);
}
