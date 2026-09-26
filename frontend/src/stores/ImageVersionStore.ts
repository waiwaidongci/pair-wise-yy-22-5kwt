import { create } from "zustand";
import {
  archiveImageGroup,
  listImageGroups,
  listImageVersion,
  type ImageArchivePayload
} from "../api/ImageVersion";
import { saveImageVersion } from "../api/ImageVersion";
import type { ImageComparisonGroup, ImageUploadForm, ImageVersion } from "../types/ImageVersion";

type State = {
  rows: ImageVersion[];
  archived: ImageComparisonGroup[];
  ready: ImageComparisonGroup[];
  pending: ImageComparisonGroup[];
  gapList: { relic_id: number; plan_id: number; position: string; missing: string[] }[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  load: () => Promise<void>;
  upload: (form: ImageUploadForm) => Promise<ImageVersion>;
  archive: (payload: ImageArchivePayload) => Promise<void>;
  clearError: () => void;
};

export const useImageVersionStore = create<State>((set) => ({
  rows: [],
  archived: [],
  ready: [],
  pending: [],
  gapList: [],
  loading: false,
  submitting: false,
  error: null,

  async load() {
    set({ loading: true, error: null });
    try {
      const [rows, overview] = await Promise.all([listImageVersion(), listImageGroups()]);
      set({
        rows,
        archived: overview.archived,
        ready: overview.ready,
        pending: overview.pending,
        gapList: overview.gap_list,
        loading: false
      });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : "加载失败" });
    }
  },

  async upload(form) {
    set({ submitting: true, error: null });
    try {
      const record = await saveImageVersion(form);
      await useImageVersionStore.getState().load();
      set({ submitting: false });
      return record;
    } catch (err) {
      const message = err instanceof Error ? err.message : "上传失败";
      set({ submitting: false, error: message });
      throw new Error(message);
    }
  },

  async archive(payload) {
    set({ submitting: true, error: null });
    try {
      await archiveImageGroup(payload);
      await useImageVersionStore.getState().load();
      set({ submitting: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "归档失败";
      set({ submitting: false, error: message });
      throw new Error(message);
    }
  },

  clearError() {
    set({ error: null });
  }
}));
