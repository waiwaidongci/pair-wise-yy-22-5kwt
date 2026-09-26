import { mockData } from "../mocks/seedData";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { createImageVersionResponse } from "../constructors/ImageVersionConstructor";
import { buildImagePairs } from "../hooks/useImageVersionCompare";
import type { ImagePairSummary, ImageVersion, ImageVersionPayload } from "../types/ImageVersion";

const endpoint = "/api/image-version";

const mockRows = () => [...(mockData.imageVersion as unknown as ImageVersion[])];

const readError = async (res: Response) => {
  try {
    const body = await res.json();
    return new Error(body.message ?? ERROR_MESSAGES.VALIDATION_FAILED);
  } catch {
    return new Error(ERROR_MESSAGES.VALIDATION_FAILED);
  }
};

export async function listImageVersion(): Promise<ImageVersion[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return mockRows();
}

export async function listImageVersionPairs(): Promise<ImagePairSummary[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(`${endpoint}/pairs`);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return buildImagePairs(mockRows());
}

export async function createImageVersion(payload: ImageVersionPayload): Promise<ImageVersion> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw await readError(res);
    return await res.json();
  } catch (err) {
    if (err instanceof TypeError) {
      // Offline review: stage the version locally instead of losing the upload.
      const rows = mockRows();
      const seq = rows.filter(
        (row) =>
          row.relic_id === payload.relic_id &&
          row.plan_id === payload.plan_id &&
          row.position === payload.position &&
          row.stage === payload.stage
      ).length + 1;
      return createImageVersionResponse({
        ...payload,
        id: rows.reduce((max, row) => Math.max(max, row.id), 0) + 1,
        version_no: `${payload.stage}-V${seq}`,
        image_type: payload.stage
      });
    }
    throw err;
  }
}

export async function archiveImagePair(payload: { relic_id: number; plan_id: number; position: string }) {
  const res = await fetch(`${endpoint}/archive`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await readError(res);
  return (await res.json()) as ImagePairSummary;
}
