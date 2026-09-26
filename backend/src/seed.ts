import type { ImageStage } from "./constants/ImageStage";

/** 生成内嵌 SVG 占位影像，种子数据无需真实文件即可展示前后对比。 */
function placeholderImage(label: string, bg: string, ink = "#f8f4ea"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" font-size="22" text-anchor="middle" dominant-baseline="middle" fill="${ink}" font-family="sans-serif">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const seed = {
  relicItem: [
    {
      id: 1,
      relic_code: "CI-0231",
      name: "青瓷莲花纹碗",
      era: "南朝",
      material: "青瓷",
      collection_level: "一级",
      storage_location: "陶瓷库 A柜 12",
      current_condition: "IN_RESTORATION"
    },
    {
      id: 2,
      relic_code: "BR-1087",
      name: "鎏金铜佛立像",
      era: "唐代",
      material: "铜鎏金",
      collection_level: "一级",
      storage_location: "金属库 B柜 05",
      current_condition: "IN_RESTORATION"
    },
    {
      id: 3,
      relic_code: "PT-0452",
      name: "彩绘陶仕女俑",
      era: "唐代",
      material: "彩绘陶",
      collection_level: "二级",
      storage_location: "陶俑库 C柜 09",
      current_condition: "FRAGILE"
    }
  ],
  damageRecord: [
    {
      id: 1,
      relic_id: 1,
      damage_type: "CRACK",
      position_desc: "口沿磕缺、腹部冲裂",
      severity: "HIGH",
      discovered_by: "周文澜",
      discovered_at: "2026-03-02T09:00:00Z",
      image_url: "/mock/damage-ci-0231.png",
      status: "CLOSED"
    },
    {
      id: 2,
      relic_id: 2,
      damage_type: "PEELING",
      position_desc: "莲座鎏金起翘剥落",
      severity: "MEDIUM",
      discovered_by: "高砚秋",
      discovered_at: "2026-04-18T09:00:00Z",
      image_url: "/mock/damage-br-1087.png",
      status: "TREATING"
    },
    {
      id: 3,
      relic_id: 3,
      damage_type: "LOSS",
      position_desc: "发髻残损、彩绘粉化",
      severity: "HIGH",
      discovered_by: "沈慕白",
      discovered_at: "2026-05-09T09:00:00Z",
      image_url: "/mock/damage-pt-0452.png",
      status: "OPEN"
    }
  ],
  restorationPlan: [
    {
      id: 1,
      relic_id: 1,
      damage_record_id: 1,
      plan_title: "青瓷碗口沿补配与冲裂加固方案",
      method: "树脂补缺 + 可逆粘结加固",
      risk_assessment: "中风险：补配色差需多次比对",
      approval_status: "APPROVED",
      owner_id: 1
    },
    {
      id: 2,
      relic_id: 2,
      damage_record_id: 2,
      plan_title: "铜佛莲座鎏金回贴方案",
      method: "起翘层回贴 + 缓蚀封护",
      risk_assessment: "低风险：保留原始鎏金层",
      approval_status: "APPROVED",
      owner_id: 2
    },
    {
      id: 3,
      relic_id: 3,
      damage_record_id: 3,
      plan_title: "陶俑发髻补塑与彩绘加固方案",
      method: "矿物颜料补色 + Paraloid B72 加固",
      risk_assessment: "高风险：彩绘层粉化严重",
      approval_status: "DRAFT",
      owner_id: 3
    }
  ],
  restorationStep: [
    {
      id: 1,
      plan_id: 1,
      step_order: "1",
      technique: "口沿残片清理与拼对",
      material_used: "无水乙醇",
      operator_id: 1,
      step_status: "DONE",
      finished_at: "2026-06-11T09:00:00Z"
    },
    {
      id: 2,
      plan_id: 2,
      step_order: "1",
      technique: "莲座表面盐分清理",
      material_used: "去离子水",
      operator_id: 2,
      step_status: "DONE",
      finished_at: "2026-06-12T09:00:00Z"
    },
    {
      id: 3,
      plan_id: 3,
      step_order: "1",
      technique: "彩绘层粉化检测",
      material_used: "棉签、B72 稀液",
      operator_id: 3,
      step_status: "DOING",
      finished_at: "2026-06-13T09:00:00Z"
    }
  ],
  imageVersion: [
    // 组 1：青瓷碗 / 方案1 / 口沿 —— 术前术后齐全，已归档
    {
      id: 1,
      relic_id: 1,
      plan_id: 1,
      position: "口沿",
      stage: "PRE_OP" as ImageStage,
      version_no: 1,
      image_type: "PRE_OP",
      file_path: placeholderImage("口沿·术前 v1", "#6b5638"),
      file_name: "kouyan-pre-v1.svg",
      capture_at: "2026-06-10T09:30:00Z",
      note: "口沿三处磕缺，边缘有旧胶粘痕",
      archive_status: "ARCHIVED",
      created_at: "2026-06-10T09:35:00Z"
    },
    {
      id: 2,
      relic_id: 1,
      plan_id: 1,
      position: "口沿",
      stage: "POST_OP" as ImageStage,
      version_no: 1,
      image_type: "POST_OP",
      file_path: placeholderImage("口沿·术后 v1", "#2f5d4a"),
      file_name: "kouyan-post-v1.svg",
      capture_at: "2026-06-20T15:10:00Z",
      note: "补配完成，釉色与原器基本一致",
      archive_status: "ARCHIVED",
      created_at: "2026-06-20T15:15:00Z"
    },
    // 组 2：青瓷碗 / 方案1 / 腹部 —— 术后留了两版，待评审归档（旧版保留）
    {
      id: 3,
      relic_id: 1,
      plan_id: 1,
      position: "腹部",
      stage: "PRE_OP" as ImageStage,
      version_no: 1,
      image_type: "PRE_OP",
      file_path: placeholderImage("腹部·术前 v1", "#6b5638"),
      file_name: "fubu-pre-v1.svg",
      capture_at: "2026-06-10T10:00:00Z",
      note: "腹部一条纵向冲裂，长约 6cm",
      archive_status: "PENDING",
      created_at: "2026-06-10T10:05:00Z"
    },
    {
      id: 4,
      relic_id: 1,
      plan_id: 1,
      position: "腹部",
      stage: "POST_OP" as ImageStage,
      version_no: 1,
      image_type: "POST_OP",
      file_path: placeholderImage("腹部·术后 v1（色差偏大）", "#3f6b52"),
      file_name: "fubu-post-v1.svg",
      capture_at: "2026-06-21T11:00:00Z",
      note: "首版补色偏黄，留档不删除",
      archive_status: "PENDING",
      created_at: "2026-06-21T11:05:00Z"
    },
    {
      id: 5,
      relic_id: 1,
      plan_id: 1,
      position: "腹部",
      stage: "POST_OP" as ImageStage,
      version_no: 2,
      image_type: "POST_OP",
      file_path: placeholderImage("腹部·术后 v2", "#2f5d4a"),
      file_name: "fubu-post-v2.svg",
      capture_at: "2026-06-24T16:30:00Z",
      note: "重新调色后冲裂不可见",
      archive_status: "PENDING",
      created_at: "2026-06-24T16:35:00Z"
    },
    // 组 3：铜佛 / 方案2 / 莲座 —— 只有术前，缺术后（待配缺口）
    {
      id: 6,
      relic_id: 2,
      plan_id: 2,
      position: "莲座",
      stage: "PRE_OP" as ImageStage,
      version_no: 1,
      image_type: "PRE_OP",
      file_path: placeholderImage("莲座·术前 v1", "#6b5638"),
      file_name: "lianzuo-pre-v1.svg",
      capture_at: "2026-07-01T09:00:00Z",
      note: "莲座左侧鎏金起翘约 4cm",
      archive_status: "PENDING",
      created_at: "2026-07-01T09:05:00Z"
    },
    // 组 4：陶俑 / 方案3 / 头部 —— 只有术后（试拍），缺术前（待配缺口）
    {
      id: 7,
      relic_id: 3,
      plan_id: 3,
      position: "头部",
      stage: "POST_OP" as ImageStage,
      version_no: 1,
      image_type: "POST_OP",
      file_path: placeholderImage("头部·术后 v1（试拍）", "#3a4a5d"),
      file_name: "toubu-post-v1.svg",
      capture_at: "2026-08-12T14:00:00Z",
      note: "发髻补泥塑型试拍，尚未补色",
      archive_status: "PENDING",
      created_at: "2026-08-12T14:05:00Z"
    }
  ]
} as const;
