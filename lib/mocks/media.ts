export type MediaAsset = {
  id: string;
  name: string;
  filename: string;
  bucket: string;
  url: string;
  sizeKb: number;
  uploadedBy: string;
  uploadedAt: string;
};

export const MEDIA_ASSETS: MediaAsset[] = [
  {
    id: "media-arch-halo",
    name: "Luxe Arch Hero",
    filename: "luxe-arch-hero.png",
    bucket: "mirrors",
    url: "http://localhost:9000/mirrors/luxe-arch-hero.png",
    sizeKb: 842,
    uploadedBy: "Priya Khanna",
    uploadedAt: "2025-02-10T11:20:00Z",
  },
  {
    id: "media-rect-pro",
    name: "Studio Rectangle",
    filename: "studio-rectangle.png",
    bucket: "mirrors",
    url: "http://localhost:9000/mirrors/studio-rectangle.png",
    sizeKb: 735,
    uploadedBy: "Alex Romero",
    uploadedAt: "2025-02-08T09:45:00Z",
  },
  {
    id: "media-circle-ambient",
    name: "Infinity Circle Ambient",
    filename: "infinity-circle-ambient.png",
    bucket: "mirrors",
    url: "http://localhost:9000/mirrors/infinity-circle-ambient.png",
    sizeKb: 902,
    uploadedBy: "Priya Khanna",
    uploadedAt: "2025-02-09T13:00:00Z",
  },
];

export function useMockMedia() {
  return {
    data: MEDIA_ASSETS,
    isLoading: false,
  };
}

