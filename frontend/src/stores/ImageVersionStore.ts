import { create } from "zustand";
import { archiveImagePair, createImageVersion, listImageVersion, listImageVersionPairs } from "../api/ImageVersion";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { buildImagePairs } from "../hooks/useImageVersionCompare";
import type { ImagePairSummary, ImageVersion, ImageVersionPayload } from "../types/ImageVersion";

type State = {
  rows: ImageVersion[];
  pairs: ImagePairSummary[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  upload: (payload: ImageVersionPayload) => Promise<boolean>;
  archive: (pair: ImagePairSummary) => Promise<boolean>;
};

export const useImageVersionStore = create<State>((set, get) => ({
  rows: [],
  pairs: [],
  loading: false,
  error: null,
  async load() {
    set({ loading: true, error: null });
    const [rows, pairs] = await Promise.all([listImageVersion(), listImageVersionPairs()]);
    set({ rows, pairs, loading: false });
  },
  async upload(payload) {
    set({ error: null });
    try {
      const saved = await createImageVersion(payload);
      const rows = [...get().rows, saved];
      console.info(LOG_TEMPLATES.ImageVersion[0], saved.id, saved.position, saved.stage, saved.version_no);
      set({ rows, pairs: buildImagePairs(rows) });
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err) });
      return false;
    }
  },
  async archive(pair) {
    set({ error: null });
    try {
      await archiveImagePair({ relic_id: pair.relic_id, plan_id: pair.plan_id, position: pair.position });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err) });
      return false;
    }
    console.info(LOG_TEMPLATES.ImageVersion[4], pair.relic_id, pair.plan_id, pair.position);
    const rows = get().rows.map((row) =>
      row.relic_id === pair.relic_id && row.plan_id === pair.plan_id && row.position === pair.position
        ? { ...row, archived: true, archived_at: new Date().toISOString() }
        : row
    );
    set({ rows, pairs: buildImagePairs(rows) });
    return true;
  }
}));
