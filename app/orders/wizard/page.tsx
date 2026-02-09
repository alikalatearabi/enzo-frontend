"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { OrderWizard } from "../../../components/orders/OrderWizard";
import { ORDERS } from "../../../lib/mocks/orders";
import { OrderWizardData } from "../../../hooks/orders/useOrderWizard";

function convertOrderToWizardData(order: typeof ORDERS[0]): Partial<OrderWizardData> {
  return {
    customer: order.customer,
    cutter: order.cutter,
    mirror: order.mirror,
    frame: order.frame,
    lightThread: order.lightThread,
    backLight: order.backLight,
    mirrorModule: order.mirrorModule,
    zoom: order.zoom,
    sandblast: order.sandblast,
    thickness: order.thickness,
    count: order.count,
    height: order.height,
    width: order.width,
    cornerBend: order.cornerBend,
    description: order.description,
    startDate: order.startDate,
    endDate: order.endDate,
    status: order.status,
  };
}

export default function OrderWizardPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const initialData = useMemo(() => {
    if (!orderId) return undefined;
    const order = ORDERS.find((o) => o.id === orderId);
    if (!order) return undefined;
    return convertOrderToWizardData(order);
  }, [orderId]);

  return <OrderWizard initialData={initialData} />;
}

