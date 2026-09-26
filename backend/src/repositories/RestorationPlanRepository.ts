import { fileStore } from "./FileStore";
import { seed } from "../seed";

const TABLE = "restorationPlan";

export const restorationPlanRepository = {
  findAll(): Record<string, unknown>[] {
    return fileStore.seedIfAbsent(TABLE, seed.restorationPlan as unknown as Array<Record<string, unknown>>);
  },
  save(row: Record<string, unknown>) {
    return fileStore.insert(TABLE, row);
  }
};
