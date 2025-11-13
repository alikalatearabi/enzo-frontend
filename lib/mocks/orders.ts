import { FEATURE_MODULES } from "./features";
import { MIRRORS } from "./mirrors";
import { USERS } from "./users";

export type OrderStatus =
  | "PROFORMA_INVOICE"
  | "ASSEMBLY"
  | "CUTTING"
  | "LEAVING_WAREHOUSE";

export type Order = {
  id: string;
  workOrder: string;
  description?: string;
  count: number;
  mirror: string;
  mirrorName: string;
  customer: string;
  customerName: string;
  cutter: string;
  cutterName: string;
  frame: string;
  lightThread: string;
  backLight?: string;
  mirrorModule: string[];
  zoom?: string;
  sandblast?: string;
  thickness: string;
  height: number;
  width: number;
  cornerBend?: number;
  status: OrderStatus;
  invoiceId?: string;
  startDate: string;
  endDate: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};

const findFeatureName = (id: string | undefined) =>
  FEATURE_MODULES.find((feature) => feature.id === id)?.name ?? "—";

const getMirrorById = (id: string) =>
  MIRRORS.find((mirror) => mirror.id === id) ?? MIRRORS[0];

const getUserById = (id: string) =>
  USERS.find((user) => user.id === id) ?? USERS[0];

export const ORDERS: Order[] = [
  {
    id: "65c200000000000000000001",
    workOrder: "WO-2025-014",
    description: "Luxury arch with halo lighting",
    count: 4,
    mirror: MIRRORS[0].id,
    mirrorName: MIRRORS[0].name,
    customer: USERS[0].id,
    customerName: USERS[0].name,
    cutter: USERS[2].id,
    cutterName: USERS[2].name,
    frame: FEATURE_MODULES[0].id,
    lightThread: FEATURE_MODULES[1].id,
    backLight: FEATURE_MODULES[2].id,
    mirrorModule: [FEATURE_MODULES[7].id],
    zoom: FEATURE_MODULES[3].id,
    sandblast: FEATURE_MODULES[5].id,
    thickness: FEATURE_MODULES[4].id,
    height: 125,
    width: 85,
    cornerBend: 4,
    status: "PROFORMA_INVOICE",
    invoiceId: "INV-2025-221",
    startDate: "2025-02-18",
    endDate: "2025-03-02",
    price: 0,
    createdAt: "2025-02-16T08:30:00Z",
    updatedAt: "2025-02-16T08:30:00Z",
  },
  {
    id: "65c200000000000000000002",
    workOrder: "WO-2025-013",
    description: "Rectangle mirrors with defog module",
    count: 10,
    mirror: MIRRORS[1].id,
    mirrorName: MIRRORS[1].name,
    customer: USERS[1].id,
    customerName: USERS[1].name,
    cutter: USERS[3].id,
    cutterName: USERS[3].name,
    frame: FEATURE_MODULES[0].id,
    lightThread: FEATURE_MODULES[1].id,
    backLight: FEATURE_MODULES[2].id,
    mirrorModule: [FEATURE_MODULES[7].id],
    zoom: FEATURE_MODULES[3].id,
    thickness: FEATURE_MODULES[4].id,
    height: 140,
    width: 90,
    status: "ASSEMBLY",
    invoiceId: "INV-2025-220",
    startDate: "2025-02-12",
    endDate: "2025-02-28",
    price: 21450,
    createdAt: "2025-02-10T10:00:00Z",
    updatedAt: "2025-02-15T16:10:00Z",
  },
  {
    id: "65c200000000000000000003",
    workOrder: "WO-2025-012",
    description: "Round mirrors with ambient light",
    count: 6,
    mirror: MIRRORS[2].id,
    mirrorName: MIRRORS[2].name,
    customer: USERS[0].id,
    customerName: USERS[0].name,
    cutter: USERS[2].id,
    cutterName: USERS[2].name,
    frame: FEATURE_MODULES[0].id,
    lightThread: FEATURE_MODULES[1].id,
    backLight: FEATURE_MODULES[2].id,
    mirrorModule: [FEATURE_MODULES[7].id],
    zoom: FEATURE_MODULES[3].id,
    thickness: FEATURE_MODULES[4].id,
    height: 100,
    width: 100,
    status: "CUTTING",
    startDate: "2025-02-08",
    endDate: "2025-02-20",
    price: 7920,
    createdAt: "2025-02-07T12:45:00Z",
    updatedAt: "2025-02-14T09:20:00Z",
  },
];

export function useMockOrders() {
  return {
    data: ORDERS,
    isLoading: false,
    meta: {
      statusCounts: ORDERS.reduce<Record<OrderStatus, number>>(
        (acc, order) => {
          acc[order.status] += 1;
          return acc;
        },
        {
          PROFORMA_INVOICE: 0,
          ASSEMBLY: 0,
          CUTTING: 0,
          LEAVING_WAREHOUSE: 0,
        },
      ),
    },
  };
}

