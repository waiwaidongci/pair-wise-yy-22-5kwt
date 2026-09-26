export const mockData = {
  "relicItem": [
    {
      "id": 1,
      "relic_code": "relic code 1",
      "name": "name 1",
      "era": "era 1",
      "material": "material 1",
      "collection_level": "LOW",
      "storage_location": "storage location 1",
      "current_condition": "current condition 1"
    },
    {
      "id": 2,
      "relic_code": "relic code 2",
      "name": "name 2",
      "era": "era 2",
      "material": "material 2",
      "collection_level": "MEDIUM",
      "storage_location": "storage location 2",
      "current_condition": "current condition 2"
    },
    {
      "id": 3,
      "relic_code": "relic code 3",
      "name": "name 3",
      "era": "era 3",
      "material": "material 3",
      "collection_level": "HIGH",
      "storage_location": "storage location 3",
      "current_condition": "current condition 3"
    }
  ],
  "damageRecord": [
    {
      "id": 1,
      "relic_id": 1,
      "damage_type": "FRAGILE",
      "position_desc": "position desc 1",
      "severity": "severity 1",
      "discovered_by": "discovered by 1",
      "discovered_at": "2026-06-11T09:00:00Z",
      "image_url": "/mock/image_url-1.png",
      "status": "SUBMITTED"
    },
    {
      "id": 2,
      "relic_id": 2,
      "damage_type": "DAMAGED",
      "position_desc": "position desc 2",
      "severity": "severity 2",
      "discovered_by": "discovered by 2",
      "discovered_at": "2026-06-12T09:00:00Z",
      "image_url": "/mock/image_url-2.png",
      "status": "APPROVED"
    },
    {
      "id": 3,
      "relic_id": 3,
      "damage_type": "IN_RESTORATION",
      "position_desc": "position desc 3",
      "severity": "severity 3",
      "discovered_by": "discovered by 3",
      "discovered_at": "2026-06-13T09:00:00Z",
      "image_url": "/mock/image_url-3.png",
      "status": "DRAFT"
    }
  ],
  "restorationPlan": [
    {
      "id": 1,
      "relic_id": 1,
      "damage_record_id": 1,
      "plan_title": "plan title 1",
      "method": "method 1",
      "risk_assessment": "risk assessment 1",
      "approval_status": "SUBMITTED",
      "owner_id": 1
    },
    {
      "id": 2,
      "relic_id": 2,
      "damage_record_id": 2,
      "plan_title": "plan title 2",
      "method": "method 2",
      "risk_assessment": "risk assessment 2",
      "approval_status": "APPROVED",
      "owner_id": 2
    },
    {
      "id": 3,
      "relic_id": 3,
      "damage_record_id": 3,
      "plan_title": "plan title 3",
      "method": "method 3",
      "risk_assessment": "risk assessment 3",
      "approval_status": "DRAFT",
      "owner_id": 3
    }
  ],
  "restorationStep": [
    {
      "id": 1,
      "plan_id": 1,
      "step_order": "step order 1",
      "technique": "technique 1",
      "material_used": "material used 1",
      "operator_id": 1,
      "step_status": "SUBMITTED",
      "finished_at": "2026-06-11T09:00:00Z"
    },
    {
      "id": 2,
      "plan_id": 2,
      "step_order": "step order 2",
      "technique": "technique 2",
      "material_used": "material used 2",
      "operator_id": 2,
      "step_status": "APPROVED",
      "finished_at": "2026-06-12T09:00:00Z"
    },
    {
      "id": 3,
      "plan_id": 3,
      "step_order": "step order 3",
      "technique": "technique 3",
      "material_used": "material used 3",
      "operator_id": 3,
      "step_status": "DRAFT",
      "finished_at": "2026-06-13T09:00:00Z"
    }
  ],
  "imageVersion": [
    {
      "id": 1,
      "relic_id": 1,
      "plan_id": 1,
      "position": "腹部裂纹",
      "stage": "PRE",
      "version_no": "PRE-V1",
      "image_type": "PRE",
      "file_path": "/mock/relic1-belly-pre-v1.png",
      "capture_at": "2026-06-11T09:00:00Z",
      "note": "修复前建档照",
      "archived": false,
      "archived_at": null
    },
    {
      "id": 2,
      "relic_id": 1,
      "plan_id": 1,
      "position": "腹部裂纹",
      "stage": "PRE",
      "version_no": "PRE-V2",
      "image_type": "PRE",
      "file_path": "/mock/relic1-belly-pre-v2.png",
      "capture_at": "2026-06-12T09:00:00Z",
      "note": "补拍侧光角度",
      "archived": false,
      "archived_at": null
    },
    {
      "id": 3,
      "relic_id": 1,
      "plan_id": 1,
      "position": "腹部裂纹",
      "stage": "POST",
      "version_no": "POST-V1",
      "image_type": "POST",
      "file_path": "/mock/relic1-belly-post-v1.png",
      "capture_at": "2026-06-20T09:00:00Z",
      "note": "修复后对照照",
      "archived": false,
      "archived_at": null
    },
    {
      "id": 4,
      "relic_id": 2,
      "plan_id": 2,
      "position": "口沿磕缺",
      "stage": "PRE",
      "version_no": "PRE-V1",
      "image_type": "PRE",
      "file_path": "/mock/relic2-rim-pre-v1.png",
      "capture_at": "2026-06-13T09:00:00Z",
      "note": "待补术后影像",
      "archived": false,
      "archived_at": null
    },
    {
      "id": 5,
      "relic_id": 3,
      "plan_id": 3,
      "position": "表面锈蚀",
      "stage": "POST",
      "version_no": "POST-V1",
      "image_type": "POST",
      "file_path": "/mock/relic3-rust-post-v1.png",
      "capture_at": "2026-06-14T09:00:00Z",
      "note": "待补术前影像",
      "archived": false,
      "archived_at": null
    }
  ]
} as const;
