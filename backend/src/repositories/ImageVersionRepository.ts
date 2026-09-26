import fs from "node:fs";
import path from "node:path";
import { config } from "../config/env";
import { seed } from "../seed";
import type { ImageVersion } from "../models/ImageVersion";

const storeFile = path.join(config.dataDir, "image-versions.json");

let cache: ImageVersion[] | null = null;

const persist = () => {
  fs.mkdirSync(path.dirname(storeFile), { recursive: true });
  fs.writeFileSync(storeFile, JSON.stringify(cache, null, 2));
};

const load = (): ImageVersion[] => {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(storeFile, "utf8")) as ImageVersion[];
  } catch {
    // First boot (or corrupted store): reseed so the archive is never empty-handed.
    cache = seed.imageVersion.map((row) => ({ ...row })) as unknown as ImageVersion[];
    persist();
  }
  return cache;
};

const inGroup = (row: ImageVersion, relicId: number, planId: number, position: string) =>
  row.relic_id === relicId && row.plan_id === planId && row.position === position;

export const imageVersionRepository = {
  findAll: () => [...load()],
  nextId: () => load().reduce((max, row) => Math.max(max, row.id), 0) + 1,
  countVersions: (relicId: number, planId: number, position: string, stage: string) =>
    load().filter((row) => inGroup(row, relicId, planId, position) && row.stage === stage).length,
  insert: (row: ImageVersion) => {
    load().push(row);
    persist();
    return row;
  },
  archiveGroup: (relicId: number, planId: number, position: string, archivedAt: string) => {
    const rows = load().filter((row) => inGroup(row, relicId, planId, position));
    rows.forEach((row) => {
      row.archived = true;
      row.archived_at = archivedAt;
    });
    persist();
    return rows;
  }
};
