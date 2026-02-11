"use client";

import {
  useDeleteOrder,
  useOrders,
  useUpdateOrderStatus,
} from "@/hooks/api/useOrders";
import { OrderStatus } from "@/lib/api/orders";

type UpdateStatusPayload = {
  orderId: string;
  status: OrderStatus;
};

export function useOrdersData() {
  const { data, statusCounts, isLoading, isError } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

  const orders = data ?? [];

  const updateOrderStatus = ({ orderId, status }: UpdateStatusPayload) => {
    updateStatusMutation.mutate({ id: orderId, status });
  };

  const deleteOrder = (orderId: string) => {
    deleteOrderMutation.mutate(orderId);
  };

  return {
    orders,
    updateOrderStatus,
    deleteOrder,
    statusCounts,
    isLoading,
    isError,
  };
}

