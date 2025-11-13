export type Shape = {
  id: string;
  name: string;
  deformed: boolean;
  aspectRatio: string;
  recommendedThickness: string;
  createdAt: string;
  updatedAt: string;
};

export const SHAPES: Shape[] = [
  {
    id: "65a100000000000000000001",
    name: "Classic Rectangle",
    deformed: false,
    aspectRatio: "4:3",
    recommendedThickness: "65a9f000000000000000005",
    createdAt: "2025-02-01T08:30:00Z",
    updatedAt: "2025-02-01T08:30:00Z",
  },
  {
    id: "65a100000000000000000002",
    name: "Luxe Arch",
    deformed: true,
    aspectRatio: "custom",
    recommendedThickness: "65a9f000000000000000005",
    createdAt: "2025-02-03T10:20:00Z",
    updatedAt: "2025-02-10T14:45:00Z",
  },
  {
    id: "65a100000000000000000003",
    name: "Infinity Circle",
    deformed: false,
    aspectRatio: "1:1",
    recommendedThickness: "65a9f000000000000000005",
    createdAt: "2025-02-05T12:00:00Z",
    updatedAt: "2025-02-05T12:00:00Z",
  },
];

export function useMockShapes() {
  return {
    data: SHAPES,
    isLoading: false,
  };
}

