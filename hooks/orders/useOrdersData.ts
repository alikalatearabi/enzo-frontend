"use client";

import { useMemo, useState } from "react";
import { ORDERS, Order, OrderStatus } from "../../lib/mocks/orders";

type UpdateStatusPayload = {
  orderId: string;
  status: OrderStatus;
};

export function useOrdersData() {
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  const updateOrderStatus = ({ orderId, status }: UpdateStatusPayload) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              updatedAt: new Date().toISOString(),
            }
          : order,
      ),
    );
  };

  const statusCounts = useMemo(() => {
    return orders.reduce<Record<OrderStatus, number>>(
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
    );
  }, [orders]);

  return {
    orders,
    updateOrderStatus,
    statusCounts,
  };
}

