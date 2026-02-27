"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { OrderWizard } from "../../../components/orders/OrderWizard";
import { useOrder } from "../../../hooks/api/useOrders";
import { useUsers } from "../../../hooks/api/useUsers";
import { OrderWizardData } from "../../../hooks/orders/useOrderWizard";
import type { OrderRoFull } from "@/lib/api/orders";
import type { User } from "@/lib/api/users";

function convertOrderToWizardData(
  order: OrderRoFull,
  users: User[] = []
): Partial<OrderWizardData> {
  const logoId =
    typeof order.logo === "string"
      ? order.logo
      : order.logo?.id;
  const base: Partial<OrderWizardData> = {
    mirror: order.mirror?.id,
    frame: order.frame?.id,
    lightThread: order.lightThread?.id,
    backLight: order.backLight?.id,
    mirrorModule: order.mirrorModule?.map((m) => m.id) ?? [],
    zoom: order.zoom?.id,
    sandblast: order.sandblast?.id,
    thickness: order.thickness?.id,
    logo: logoId,
    code: order.code,
    price: order.price,
    count: order.count,
    height: order.height,
    width: order.width,
    cornerBend: order.cornerBend,
    description: order.description,
    startDate: order.startDate,
    endDate: order.endDate,
    status: order.status as OrderWizardData["status"],
  };
  if (order.invoice) {
    base.invoiceChoice = "existing";
    base.invoiceNumber = order.invoice.invoiceNumber
      ? Number(order.invoice.invoiceNumber)
      : undefined;
    if (order.invoice.customer) {
      base.customer = users.find((u) => u._id === order.invoice!.customer) ?? undefined;
    }
    if (order.invoice.cutter) {
      base.cutter = users.find((u) => u._id === order.invoice!.cutter) ?? undefined;
    }
    base.selectedExistingInvoiceId = order.invoice.id;
  }
  return base;
}

export default function OrderWizardPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const invoiceId = searchParams.get("invoiceId");

  const { data: order, isLoading: orderLoading } = useOrder(orderId);
  const { data: users = [], isLoading: usersLoading } = useUsers();

  const initialData = useMemo(() => {
    if (!orderId || !order) return undefined;
    return convertOrderToWizardData(order, users);
  }, [orderId, order, users]);

  const hasInvoiceData = Boolean(order?.invoice);
  const waitForUsers = hasInvoiceData && usersLoading;

  if (orderId && (orderLoading || waitForUsers)) {
    return (
      <section className="flex flex-1 flex-col gap-6" dir="rtl">
        <div className="flex justify-center py-12">
          <span className="h-8 w-32 animate-pulse rounded bg-muted" />
        </div>
      </section>
    );
  }

  return (
    <OrderWizard
      initialData={initialData}
      orderId={orderId}
      invoiceId={invoiceId}
    />
  );
}

