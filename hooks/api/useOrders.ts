"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Order,
  OrderStatus,
  OrderRoFull,
  CreateOrderPayload,
  UpdateOrderPayload,
  deleteOrder as deleteOrderApi,
  getOrders,
  getOrderById,
  getOrdersByInvoiceId,
  createOrder as createOrderApi,
  updateOrder as updateOrderApi,
  updateOrderStatus as updateOrderStatusApi,
  assignOrderToInvoice as assignOrderToInvoiceApi,
} from "@/lib/api/orders";

export function useOrders() {
  const query = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  const statusCounts = useMemo(() => {
    const baseCounts: Record<OrderStatus, number> = {
      PROFORMA_INVOICE: 0,
      ASSEMBLY: 0,
      CUTTING: 0,
      LEAVING_WAREHOUSE: 0,
    };

    if (!query.data) {
      return baseCounts;
    }

    return query.data.reduce<Record<OrderStatus, number>>((acc, order) => {
      acc[order.status] += 1;
      return acc;
    }, baseCounts);
  }, [query.data]);

  return {
    ...query,
    statusCounts,
  };
}

export function useOrder(id: string | null) {
  return useQuery<OrderRoFull>({
    queryKey: ["orders", id],
    queryFn: () => getOrderById(id as string),
    enabled: !!id,
  });
}

export function useOrdersByInvoiceId(invoiceId: string | null) {
  return useQuery<OrderRoFull[]>({
    queryKey: ["orders", "by-invoice", invoiceId],
    queryFn: () => getOrdersByInvoiceId(invoiceId as string),
    enabled: !!invoiceId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrderApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useAssignOrderToInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      invoiceId,
    }: {
      orderId: string;
      invoiceId: string;
    }) => assignOrderToInvoiceApi(orderId, invoiceId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({
        queryKey: ["orders", "by-invoice", variables.invoiceId],
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; payload: UpdateOrderPayload }) =>
      updateOrderApi(params.id, params.payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: OrderStatus }) =>
      updateOrderStatusApi(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrderApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

