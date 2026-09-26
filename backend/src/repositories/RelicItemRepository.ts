import { fileStore } from "./FileStore";
import { seed } from "../seed";

const TABLE = "relicItem";

export const relicItemRepository = {
  findAll(): Record<string, unknown>[] {
    return fileStore.seedIfAbsent(TABLE, seed.relicItem as unknown as Array<Record<string, unknown>>);
  },
  save(row: Record<string, unknown>) {
    return fileStore.insert(TABLE, row);
  }
};
