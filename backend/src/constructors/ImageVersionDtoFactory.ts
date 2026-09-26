/** 影像版本响应 DTO 工厂：页面与其他服务不直接散写默认结构。 */
export const createImageVersionDto = (
  overrides: Partial<{
    id: number;
    relic_id: number;
    plan_id: number;
    position: string;
    stage: string;
    version_no: number;
    image_type: string;
    file_path: string;
    file_name: string;
    capture_at: string;
    note: string;
    archive_status: string;
    created_at: string;
  }> = {}
) => ({
  id: 1,
  relic_id: 1,
  plan_id: 1,
  position: "口沿",
  stage: "PRE_OP",
  version_no: 1,
  image_type: "PRE_OP",
  file_path: "/uploads/sample.png",
  file_name: "sample.png",
  capture_at: "2026-06-11T09:00:00Z",
  note: "",
  archive_status: "PENDING",
  created_at: "2026-06-11T09:05:00Z",
  ...overrides
});

export const createImageArchiveDto = (
  overrides: Partial<{ relic_id: number; plan_id: number; position: string }> = {}
) => ({ relic_id: 1, plan_id: 1, position: "口沿", ...overrides });
