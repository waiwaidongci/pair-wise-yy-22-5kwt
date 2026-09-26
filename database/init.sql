CREATE TABLE IF NOT EXISTS relic_item (
  id INTEGER PRIMARY KEY,
  relic_code TEXT,
  name TEXT,
  era TEXT,
  material TEXT,
  collection_level TEXT,
  storage_location TEXT,
  current_condition TEXT
);

CREATE TABLE IF NOT EXISTS damage_record (
  id INTEGER PRIMARY KEY,
  relic_id INTEGER,
  damage_type TEXT,
  position_desc TEXT,
  severity TEXT,
  discovered_by TEXT,
  discovered_at TEXT,
  image_url TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS restoration_plan (
  id INTEGER PRIMARY KEY,
  relic_id INTEGER,
  damage_record_id INTEGER,
  plan_title TEXT,
  method TEXT,
  risk_assessment TEXT,
  approval_status TEXT,
  owner_id INTEGER
);

CREATE TABLE IF NOT EXISTS restoration_step (
  id INTEGER PRIMARY KEY,
  plan_id INTEGER,
  step_order TEXT,
  technique TEXT,
  material_used TEXT,
  operator_id INTEGER,
  step_status TEXT,
  finished_at TEXT
);

-- 影像版本：同一文物+方案+部位(position)下可保留多版(version_no)；
-- stage 区分术前(PRE_OP)/术后(POST_OP)，两侧齐全的部位组才允许归档。
CREATE TABLE IF NOT EXISTS image_version (
  id INTEGER PRIMARY KEY,
  relic_id INTEGER NOT NULL,
  plan_id INTEGER NOT NULL,
  position TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('PRE_OP', 'POST_OP')),
  version_no INTEGER NOT NULL,
  image_type TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT,
  capture_at TEXT,
  note TEXT,
  archive_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (archive_status IN ('PENDING', 'ARCHIVED')),
  created_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_image_version_group
  ON image_version (relic_id, plan_id, position);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY,
  actor TEXT,
  action TEXT,
  target_type TEXT,
  target_id TEXT,
  detail TEXT,
  created_at TEXT
);
