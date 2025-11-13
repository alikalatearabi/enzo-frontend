type MirrorMedia = {
  id: string;
  url: string;
  bucket: string;
  uploadedAt: string;
};

export type MirrorTemplate = {
  id: string;
  name: string;
  shape: string;
  shapeName: string;
  defaultHeight: number;
  defaultWidth: number;
  price?: number;
  picture?: MirrorMedia;
  features: {
    frame?: string;
    lightThread?: string;
    backLight?: string;
    mirrorModules?: string[];
  };
  createdAt: string;
  updatedAt: string;
};

export const MIRRORS: MirrorTemplate[] = [
  {
    id: "65a200000000000000000001",
    name: "Luxe Arch Halo",
    shape: "65a100000000000000000002",
    shapeName: "Luxe Arch",
    defaultHeight: 120,
    defaultWidth: 80,
    price: 1680,
    picture: {
      id: "media-arch-halo",
      url: "http://localhost:9000/mirrors/luxe-arch-halo.png",
      bucket: "mirrors",
      uploadedAt: "2025-02-10T11:20:00Z",
    },
    features: {
      frame: "65a9f000000000000000001",
      lightThread: "65a9f000000000000000002",
      backLight: "65a9f000000000000000003",
      mirrorModules: ["65a9f000000000000000008"],
    },
    createdAt: "2025-02-10T11:15:00Z",
    updatedAt: "2025-02-12T09:05:00Z",
  },
  {
    id: "65a200000000000000000002",
    name: "Studio Rectangle Pro",
    shape: "65a100000000000000000001",
    shapeName: "Classic Rectangle",
    defaultHeight: 140,
    defaultWidth: 90,
    price: 1495,
    picture: {
      id: "media-rect-pro",
      url: "http://localhost:9000/mirrors/studio-rectangle-pro.png",
      bucket: "mirrors",
      uploadedAt: "2025-02-05T09:10:00Z",
    },
    features: {
      frame: "65a9f000000000000000001",
      lightThread: "65a9f000000000000000002",
      backLight: "65a9f000000000000000003",
      mirrorModules: ["65a9f000000000000000008"],
    },
    createdAt: "2025-02-05T09:00:00Z",
    updatedAt: "2025-02-11T15:45:00Z",
  },
  {
    id: "65a200000000000000000003",
    name: "Infinity Circle Ambient",
    shape: "65a100000000000000000003",
    shapeName: "Infinity Circle",
    defaultHeight: 100,
    defaultWidth: 100,
    price: 1320,
    picture: {
      id: "media-circle-ambient",
      url: "http://localhost:9000/mirrors/infinity-circle-ambient.png",
      bucket: "mirrors",
      uploadedAt: "2025-02-09T13:00:00Z",
    },
    features: {
      frame: "65a9f000000000000000001",
      lightThread: "65a9f000000000000000002",
      backLight: "65a9f000000000000000003",
      mirrorModules: ["65a9f000000000000000008"],
    },
    createdAt: "2025-02-09T12:55:00Z",
    updatedAt: "2025-02-12T10:10:00Z",
  },
];

export function useMockMirrors() {
  return {
    data: MIRRORS,
    isLoading: false,
  };
}

