import { fileStore } from "./FileStore";
import { seed } from "../seed";

const TABLE = "damageRecord";

export const damageRecordRepository = {
  findAll(): Record<string, unknown>[] {
    return fileStore.seedIfAbsent(TABLE, seed.damageRecord as unknown as Array<Record<string, unknown>>);
  },
  save(row: Record<string, unknown>) {
    return fileStore.insert(TABLE, row);
  }
};
