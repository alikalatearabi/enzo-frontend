import apiClient from "./client";

export type OrderStatus =
  | "PROFORMA_INVOICE"
  | "ASSEMBLY"
  | "CUTTING"
  | "LEAVING_WAREHOUSE";

// Raw shape coming from the backend (OrderRo) – minimal view for list/table
type OrderRoList = {
  id: string;
  workOrder: string;
  description?: string;
  mirror: {
    id: string;
    name?: string;
  };
  customer: {
    id: string;
    name?: string;
  };
  cutter: {
    id: string;
    name?: string;
  };
  status: OrderStatus;
  price: number;
  startDate: string;
  endDate: string;
  updatedAt: string | Date;
};

// Full OrderRo shape (for wizard / details)
export type OrderRoFull = {
  id: string;
  workOrder: string;
  description?: string;
  code: string;
  count: number;
  mirror: { id: string; name?: string; shape?: { id: string; name: string; deformed?: number } };
  backLight: { id: string; name?: string };
  lol: { id: string; name?: string };
  thickness: { id: string; name?: string };
  mirrorModule: Array<{ id: string; name?: string }>;
  zoom: { id: string; name?: string };
  sandblast: { id: string; name?: string };
  frame: { id: string; name?: string; layer_count?: number };
  lightThread: { id: string; name?: string };
  cornerBend?: number;
  customer: { id: string; name?: string };
  cutter: { id: string; name?: string };
  height: number;
  width: number;
  startDate: string;
  endDate: string;
  status: OrderStatus;
  price: number;
  invoiceID: string;
  /** Populated invoice when returned by getOrderById */
  invoice?: {
    id: string;
    invoiceNumber?: string;
    totalPrice?: number;
    status?: string;
    customer?: string;
    cutter?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  logo?: { id: string } | string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

// Flattened shape used by the frontend orders table
export type Order = {
  id: string;
  workOrder: string;
  description?: string;
  mirrorId: string;
  mirrorName: string;
  customerId: string;
  customerName: string;
  cutterId: string;
  cutterName: string;
  status: OrderStatus;
  price: number;
  startDate: string;
  endDate: string;
  updatedAt: string;
};

function mapOrder(ro: OrderRoList): Order {
  return {
    id: ro.id,
    workOrder: ro.workOrder,
    description: ro.description,
    mirrorId: ro.mirror?.id,
    mirrorName: ro.mirror?.name ?? "بدون نام",
    customerId: ro.customer?.id,
    customerName: ro.customer?.name ?? "نامشخص",
    cutterId: ro.cutter?.id,
    cutterName: ro.cutter?.name ?? "نامشخص",
    status: ro.status,
    price: ro.price,
    startDate: ro.startDate,
    endDate: ro.endDate,
    updatedAt:
      typeof ro.updatedAt === "string"
        ? ro.updatedAt
        : ro.updatedAt.toISOString(),
  };
}

export async function getOrders(): Promise<Order[]> {
  const data = await apiClient.get<OrderRoList[]>("/orders");
  return data.map(mapOrder);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  const updated = await apiClient.patch<OrderRoList>(`/orders/${id}/status`, {
    status,
  });
  return mapOrder(updated);
}

export async function deleteOrder(id: string): Promise<void> {
  await apiClient.delete<void>(`/orders/${id}`);
}

// Payload used for creating an order from the wizard
export type CreateOrderPayload = {
  workOrder: string;
  description?: string;
  count: number;
  mirror: string;
  backLight?: string;
  lol: string;
  height: number;
  width: number;
  thickness: string;
  mirrorModule: string[];
  zoom?: string;
  sandblast: string;
  frame?: string;
  lightThread?: string;
  cornerBend?: number;
  startDate: string;
  endDate: string;
  status?: OrderStatus;
  invoice?: string;
  logo: string;
};

// Payload used for updating an order from the wizard
export type UpdateOrderPayload = Partial<CreateOrderPayload> & {
  code?: string;
  price?: number;
};

export async function getOrderById(id: string): Promise<OrderRoFull> {
  return apiClient.get<OrderRoFull>(`/orders/${id}`);
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<OrderRoFull> {
  return apiClient.post<OrderRoFull>("/orders", payload);
}

export async function updateOrder(
  id: string,
  payload: UpdateOrderPayload,
): Promise<OrderRoFull> {
  return apiClient.patch<OrderRoFull>(`/orders/${id}`, payload);
}

export async function getOrdersByInvoiceId(
  invoiceId: string,
): Promise<OrderRoFull[]> {
  return apiClient.get<OrderRoFull[]>(`/orders/invoice/${invoiceId}`);
}

export async function assignOrderToInvoice(
  orderId: string,
  invoiceId: string,
): Promise<OrderRoFull> {
  return apiClient.patch<OrderRoFull>(`/orders/${orderId}/assign-invoice`, {
    invoiceId,
  });
}

