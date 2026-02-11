"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { OrderWizard } from "../../../components/orders/OrderWizard";
import { useOrder } from "../../../hooks/api/useOrders";
import { OrderWizardData } from "../../../hooks/orders/useOrderWizard";

function convertOrderToWizardData(order: {
  customer: { id: string };
  cutter: { id: string };
  mirror: { id: string };
  frame: { id: string };
  lightThread: { id: string };
  backLight: { id: string };
  mirrorModule: Array<{ id: string }>;
  zoom: { id: string };
  sandblast: { id: string };
  thickness: { id: string };
  count: number;
  height: number;
  width: number;
  cornerBend?: number;
  description?: string;
  startDate: string;
  endDate: string;
  status: string;
}): Partial<OrderWizardData> {
  return {
    customer: order.customer.id,
    cutter: order.cutter.id,
    mirror: order.mirror.id,
    frame: order.frame.id,
    lightThread: order.lightThread.id,
    backLight: order.backLight.id,
    mirrorModule: order.mirrorModule.map((m) => m.id),
    zoom: order.zoom.id,
    sandblast: order.sandblast.id,
    thickness: order.thickness.id,
    count: order.count,
    height: order.height,
    width: order.width,
    cornerBend: order.cornerBend,
    description: order.description,
    startDate: order.startDate,
    endDate: order.endDate,
    status: order.status as OrderWizardData["status"],
  };
}

export default function OrderWizardPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const { data: order } = useOrder(orderId);

  const initialData = useMemo(() => {
    if (!orderId || !order) return undefined;
    return convertOrderToWizardData(order);
  }, [orderId, order]);

  return <OrderWizard initialData={initialData} orderId={orderId} />;
}

