export type FeatureModule = {
  id: string;
  name: string;
  code?: string;
  layerCount?: number;
  type:
    | "frame"
    | "lightThread"
    | "backLight"
    | "zoom"
    | "thickness"
    | "sandblast"
    | "lol"
    | "mirrorModule";
  createdAt: string;
  updatedAt: string;
};

export const FEATURE_MODULES: FeatureModule[] = [
  {
    id: "65a9f000000000000000001",
    name: "Carbon Edge Frame",
    layerCount: 3,
    type: "frame",
    createdAt: "2025-02-10T12:30:00Z",
    updatedAt: "2025-02-10T12:30:00Z",
  },
  {
    id: "65a9f000000000000000002",
    name: "Aurora Warm Thread",
    type: "lightThread",
    createdAt: "2025-02-11T09:45:00Z",
    updatedAt: "2025-02-11T09:45:00Z",
  },
  {
    id: "65a9f000000000000000003",
    name: "Nimbus Back Light",
    type: "backLight",
    createdAt: "2025-02-11T10:00:00Z",
    updatedAt: "2025-02-11T10:00:00Z",
  },
  {
    id: "65a9f000000000000000004",
    name: "Studio Zoom 3x",
    type: "zoom",
    createdAt: "2025-02-12T08:00:00Z",
    updatedAt: "2025-02-12T08:00:00Z",
  },
  {
    id: "65a9f000000000000000005",
    name: "Quartz Thickness 8mm",
    type: "thickness",
    createdAt: "2025-02-12T08:05:00Z",
    updatedAt: "2025-02-12T08:05:00Z",
  },
  {
    id: "65a9f000000000000000006",
    name: "Frost Trace",
    code: "SB-FT-001",
    type: "sandblast",
    createdAt: "2025-02-12T08:10:00Z",
    updatedAt: "2025-02-12T08:10:00Z",
  },
  {
    id: "65a9f000000000000000007",
    name: "LOL Surprise",
    type: "lol",
    createdAt: "2025-02-13T07:00:00Z",
    updatedAt: "2025-02-13T07:00:00Z",
  },
  {
    id: "65a9f000000000000000008",
    name: "Defog Sense Module",
    type: "mirrorModule",
    createdAt: "2025-02-13T07:15:00Z",
    updatedAt: "2025-02-13T07:15:00Z",
  },
];

export function useMockFeatureModules() {
  return {
    data: FEATURE_MODULES,
    isLoading: false,
  };
}

