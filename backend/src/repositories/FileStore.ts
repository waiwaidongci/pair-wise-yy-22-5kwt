import fs from "fs";
import path from "path";
import { config } from "../config/env";

/**
 * 轻量 JSON 文件存储：所有实体表保存在 dataDir 下的 store.json。
 * 使用命名卷挂载 dataDir，保证服务重启 / docker compose down 后记录仍可读回。
 * 写入采用临时文件 + rename 的原子写，避免重启瞬间读到半截文件。
 */

type StoreShape = Record<string, Array<Record<string, unknown>>>;

const storePath = path.join(config.dataDir, "store.json");
let cache: StoreShape | null = null;

function ensureDataDir() {
  fs.mkdirSync(config.dataDir, { recursive: true });
  fs.mkdirSync(path.join(config.dataDir, "uploads"), { recursive: true });
}

function readStore(): StoreShape {
  if (cache) return cache;
  ensureDataDir();
  if (fs.existsSync(storePath)) {
    try {
      cache = JSON.parse(fs.readFileSync(storePath, "utf8")) as StoreShape;
      return cache;
    } catch (err) {
      // 文件损坏时不直接吞掉：备份后由调用方重新播种。
      const backup = `${storePath}.corrupt-${Date.now()}`;
      fs.renameSync(storePath, backup);
      console.warn("[fileStore] store.json unreadable, backed up to", backup, err);
    }
  }
  cache = {};
  return cache;
}

function flush() {
  ensureDataDir();
  const tmp = `${storePath}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(cache, null, 2), "utf8");
  fs.renameSync(tmp, storePath);
}

export const fileStore = {
  get storePath() {
    return storePath;
  },
  /** 首次启动（或存储文件缺失）时用种子数据初始化，已有记录一律保留不覆盖。 */
  seedIfAbsent(table: string, rows: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
    const store = readStore();
    if (!Array.isArray(store[table]) || store[table].length === 0) {
      store[table] = rows.map((row) => ({ ...row }));
      flush();
    }
    return store[table] as Array<Record<string, unknown>>;
  },
  findAll(table: string): Array<Record<string, unknown>> {
    const store = readStore();
    if (!Array.isArray(store[table])) store[table] = [];
    return store[table] as Array<Record<string, unknown>>;
  },
  insert(table: string, row: Record<string, unknown>): Record<string, unknown> {
    const store = readStore();
    if (!Array.isArray(store[table])) store[table] = [];
    store[table].push(row);
    flush();
    return row;
  },
  update(
    table: string,
    id: number,
    patch: Record<string, unknown>
  ): Record<string, unknown> | undefined {
    const store = readStore();
    const rows = Array.isArray(store[table]) ? store[table] : [];
    const target = rows.find((row) => row.id === id);
    if (!target) return undefined;
    Object.assign(target, patch);
    flush();
    return target;
  },
  nextId(table: string): number {
    const rows = this.findAll(table);
    return rows.reduce((max, row) => (typeof row.id === "number" && row.id > max ? row.id : max), 0) + 1;
  }
};
