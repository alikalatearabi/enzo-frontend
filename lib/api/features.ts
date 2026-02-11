import apiClient from "./client";

export type FeatureModuleType =
  | "frame"
  | "lightThread"
  | "backLight"
  | "zoom"
  | "thickness"
  | "sandblast"
  | "lol";

export type FeatureModule = {
  id: string;
  name: string;
  type: FeatureModuleType;
  code?: string;
  layerCount?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

type FrameRo = {
  id: string;
  name: string;
  layer_count: number;
};

type SimpleRo = {
  id: string;
  name: string;
};

type SandblastRo = {
  id: string;
  name: string;
  code: string;
};

export async function getAllFeatureModules(): Promise<FeatureModule[]> {
  const [
    frames,
    lightThreads,
    backLights,
    zooms,
    thicknesses,
    sandblasts,
    lols,
  ] = await Promise.all([
    apiClient.get<FrameRo[]>("/frames"),
    apiClient.get<SimpleRo[]>("/lightThreads"),
    apiClient.get<SimpleRo[]>("/backLights"),
    apiClient.get<SimpleRo[]>("/zooms"),
    apiClient.get<SimpleRo[]>("/thicknesss"),
    apiClient.get<SandblastRo[]>("/sandblasts"),
    apiClient.get<SimpleRo[]>("/lols"),
  ]);

  const now = new Date().toISOString();

  const mapped: FeatureModule[] = [
    ...frames.map((f) => ({
      id: f.id,
      name: f.name,
      type: "frame" as const,
      layerCount: f.layer_count,
      createdAt: now,
      updatedAt: now,
    })),
    ...lightThreads.map((lt) => ({
      id: lt.id,
      name: lt.name,
      type: "lightThread" as const,
      createdAt: now,
      updatedAt: now,
    })),
    ...backLights.map((bl) => ({
      id: bl.id,
      name: bl.name,
      type: "backLight" as const,
      createdAt: now,
      updatedAt: now,
    })),
    ...zooms.map((z) => ({
      id: z.id,
      name: z.name,
      type: "zoom" as const,
      createdAt: now,
      updatedAt: now,
    })),
    ...thicknesses.map((t) => ({
      id: t.id,
      name: t.name,
      type: "thickness" as const,
      createdAt: now,
      updatedAt: now,
    })),
    ...sandblasts.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      type: "sandblast" as const,
      createdAt: now,
      updatedAt: now,
    })),
    ...lols.map((l) => ({
      id: l.id,
      name: l.name,
      type: "lol" as const,
      createdAt: now,
      updatedAt: now,
    })),
  ];

  return mapped;
}

type CreateFeatureModulePayload = {
  name: string;
  type: FeatureModuleType;
  code?: string;
  layerCount?: number;
};

type UpdateFeatureModulePayload = CreateFeatureModulePayload & {
  id: string;
};

function getEndpointForType(type: FeatureModuleType): string {
  const endpointMap: Record<FeatureModuleType, string> = {
    frame: "/frames",
    lightThread: "/lightThreads",
    backLight: "/backLights",
    zoom: "/zooms",
    thickness: "/thicknesss",
    sandblast: "/sandblasts",
    lol: "/lols",
  };
  return endpointMap[type];
}

function normalizePayloadForBackend(
  payload: CreateFeatureModulePayload,
): unknown {
  switch (payload.type) {
    case "frame":
      return {
        name: payload.name,
        layer_count: payload.layerCount ?? 1,
      };
    case "sandblast":
      return {
        name: payload.name,
        code: payload.code ?? "",
      };
    default:
      return {
        name: payload.name,
      };
  }
}

export async function createFeatureModule(
  payload: CreateFeatureModulePayload,
): Promise<FeatureModule> {
  const endpoint = getEndpointForType(payload.type);
  const backendPayload = normalizePayloadForBackend(payload);
  const now = new Date().toISOString();

  if (payload.type === "frame") {
    const result = await apiClient.post<FrameRo>(endpoint, backendPayload);
    return {
      id: result.id,
      name: result.name,
      type: "frame",
      layerCount: result.layer_count,
      createdAt: now,
      updatedAt: now,
    };
  } else if (payload.type === "sandblast") {
    const result = await apiClient.post<SandblastRo>(endpoint, backendPayload);
    return {
      id: result.id,
      name: result.name,
      code: result.code,
      type: "sandblast",
      createdAt: now,
      updatedAt: now,
    };
  } else {
    const result = await apiClient.post<SimpleRo>(endpoint, backendPayload);
    return {
      id: result.id,
      name: result.name,
      type: payload.type,
      createdAt: now,
      updatedAt: now,
    };
  }
}

export async function updateFeatureModule(
  payload: UpdateFeatureModulePayload,
): Promise<FeatureModule> {
  const endpoint = getEndpointForType(payload.type);
  const backendPayload = normalizePayloadForBackend(payload);
  const now = new Date().toISOString();

  if (payload.type === "frame") {
    const result = await apiClient.put<FrameRo>(
      `${endpoint}/${payload.id}`,
      backendPayload,
    );
    return {
      id: result.id,
      name: result.name,
      type: "frame",
      layerCount: result.layer_count,
      createdAt: now,
      updatedAt: now,
    };
  } else if (payload.type === "sandblast") {
    const result = await apiClient.put<SandblastRo>(
      `${endpoint}/${payload.id}`,
      backendPayload,
    );
    return {
      id: result.id,
      name: result.name,
      code: result.code,
      type: "sandblast",
      createdAt: now,
      updatedAt: now,
    };
  } else {
    const result = await apiClient.put<SimpleRo>(
      `${endpoint}/${payload.id}`,
      backendPayload,
    );
    return {
      id: result.id,
      name: result.name,
      type: payload.type,
      createdAt: now,
      updatedAt: now,
    };
  }
}

export async function deleteFeatureModule(
  id: string,
  type: FeatureModuleType,
): Promise<void> {
  const endpoint = getEndpointForType(type);
  await apiClient.delete<void>(`${endpoint}/${id}`);
}

