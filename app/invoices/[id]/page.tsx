"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import {
  PolishedTable,
  PolishedTableBody,
  PolishedTableCell,
  PolishedTableHead,
  PolishedTableHeader,
  PolishedTableRow,
} from "../../../components/ui/polished-table";
import { BodyText, MutedText, PageTitle, SectionTitle } from "../../../components/ui/typography";
import { useInvoice, useDeleteInvoice } from "../../../hooks/api/useInvoince";
import { useOrdersByInvoiceId, useUpdateOrderStatus, useDeleteOrder } from "../../../hooks/api/useOrders";
import { formatPersianCurrency, toPersianNumber } from "../../../lib/utils/numbers";
import { EmptyState } from "../../../components/ui/empty-state";
import { ConfirmDialog, Dialog } from "../../../components/ui/dialog";
import { CustomSelect } from "../../../components/ui/custom-select";
import { useToast } from "../../../components/ui/feedback/ToastProvider";
import { OrderStatus, OrderRoFull } from "../../../lib/api/orders";
import { statusOptions } from "../../orders/constants";
import { useState } from "react";
import { MirrorOrderForm, MirrorOrderFormInitialValues } from "../../../components/MirrorOrderForm";
import { exportFormToPdf } from "../../../lib/utils/exportFormToPdf";

const invoiceStatusLabels: Record<string, string> = {
  DRAFT: "پیش‌نویس",
  ISSUED: "صادر شده",
  PAID: "پرداخت شده",
  CANCELLED: "لغو شده",
};

function getCustomerName(inv: { customer?: { name?: string } | unknown }): string {
  if (inv.customer && typeof inv.customer === "object" && "name" in inv.customer) {
    return (inv.customer as { name?: string }).name ?? "—";
  }
  return "—";
}

function getCutterName(inv: { cutter?: { name?: string } | unknown }): string {
  if (inv.cutter && typeof inv.cutter === "object" && "name" in inv.cutter) {
    return (inv.cutter as { name?: string }).name ?? "—";
  }
  return "—";
}

/** Map OrderRoFull + optional customer name to MirrorOrderForm initial values */
function orderToFormValues(
  order: OrderRoFull,
  customerName?: string,
): MirrorOrderFormInitialValues {
  const thicknessName = order.thickness?.name ?? "";
  const thickness: "6" | "4" =
    thicknessName.includes("4") || thicknessName === "4" ? "4" : "6";

  const lolName = (order.lol?.name ?? "").toLowerCase();
  const toolType: "cut" | "bevel" | "matte" | "polished" =
    lolName.includes("براق") || lolName.includes("polished")
      ? "polished"
      : lolName.includes("مات") || lolName.includes("matte")
        ? "matte"
        : lolName.includes("تراش") || lolName.includes("bevel")
          ? "bevel"
          : "cut";

  return {
    customerName: customerName ?? order.customer?.name ?? "",
    workOrder: order.workOrder ?? "",
    date: order.startDate ?? "",
    startDate: order.startDate ?? "",
    endDate: order.endDate ?? "",
    thickness,
    height: order.height ?? "",
    width: order.width ?? "",
    shape: order.mirror?.shape?.name ?? "",
    mirrorColor: "",
    count: order.count ?? "",
    toolType,
    other: "",
    cornerHas: typeof order.cornerBend === "number" && order.cornerBend > 0,
    cornerR:
      typeof order.cornerBend === "number" && order.cornerBend > 0
        ? order.cornerBend
        : "",
    sandblastHas: !!order.sandblast,
    designCode: order.code ?? "",
    description: order.description ?? "",
    touchHas: !!order.lightThread,
    logoHas: !!order.logo,
    attachmentHas: false,
    backLightCode: order.backLight?.name ?? order.backLight?.id ?? "",
    lightColor: "",
    antifogHas: false,
    backLightDescription: "",
  };
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = typeof params.id === "string" ? params.id : null;
  const { addToast } = useToast();

  const { data: invoice, isLoading: invoiceLoading, isError: invoiceError } = useInvoice(invoiceId);
  const { data: orders = [], isLoading: ordersLoading } = useOrdersByInvoiceId(invoiceId);
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();
  const deleteInvoiceMutation = useDeleteInvoice();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<{ id: string; workOrder: string } | null>(null);
  const [deleteInvoiceDialogOpen, setDeleteInvoiceDialogOpen] = useState(false);
  const [formModalOrder, setFormModalOrder] = useState<OrderRoFull | null>(null);

  const statusLabel = statusOptions.reduce<Record<string, string>>(
    (acc, option) => {
      acc[option.value] = option.label;
      return acc;
    },
    {},
  );

  if (!invoiceId) {
    return (
      <section className="flex flex-1 flex-col gap-6" dir="rtl">
        <EmptyState title="شناسه صورت‌حساب نامعتبر" description="" />
      </section>
    );
  }

  if (invoiceError || (invoice === undefined && !invoiceLoading)) {
    return (
      <section className="flex flex-1 flex-col gap-6" dir="rtl">
        <EmptyState
          title="صورت‌حساب یافت نشد"
          description="ممکن است حذف شده یا آدرس اشتباه باشد."
          actionLabel="بازگشت به لیست"
          onAction={() => router.push("/invoices")}
        />
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-2">
        <PageTitle>صورت‌حساب {invoice ? toPersianNumber(invoice.invoiceNumber) : "…"}</PageTitle>
      </div>

      {invoice && (
        <Card>
          <CardHeader>
            <SectionTitle as="h3">اطلاعات صورت‌حساب</SectionTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <MutedText className="text-xs">مشتری</MutedText>
              <BodyText>{getCustomerName(invoice)}</BodyText>
            </div>
            <div>
              <MutedText className="text-xs">برشکار</MutedText>
              <BodyText>{getCutterName(invoice)}</BodyText>
            </div>
            <div>
              <MutedText className="text-xs">مجموع</MutedText>
              <BodyText className="font-semibold">
                {formatPersianCurrency(invoice.totalPrice ?? 0)}
              </BodyText>
            </div>
            <div>
              <MutedText className="text-xs">وضعیت</MutedText>
              <BodyText>{invoiceStatusLabels[invoice.status] ?? invoice.status}</BodyText>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <SectionTitle as="h3">سفارش‌های این صورت‌حساب</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <span className="h-6 w-32 animate-pulse rounded bg-muted" />
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              title="هنوز سفارشی در این صورت‌حساب نیست"
              description="با دکمه زیر یک سفارش به این صورت‌حساب اضافه کنید."
              actionLabel="افزودن سفارش"
              onAction={() => router.push(`/orders/wizard?invoiceId=${invoiceId}`)}
            />
          ) : (
            <PolishedTable>
              <PolishedTableHeader>
                <PolishedTableHead>شناسه</PolishedTableHead>
                <PolishedTableHead>وضعیت</PolishedTableHead>
                <PolishedTableHead>مجموع</PolishedTableHead>
                <PolishedTableHead align="center">عملیات</PolishedTableHead>
              </PolishedTableHeader>
              <PolishedTableBody>
                {orders.map((order) => (
                  <PolishedTableRow key={order.id}>
                    <PolishedTableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-foreground">
                          {order.workOrder}
                        </span>
                        <MutedText className="text-xs">
                          {order.mirror?.name ?? "—"}
                        </MutedText>
                      </div>
                    </PolishedTableCell>
                    <PolishedTableCell>
                      <CustomSelect
                        value={order.status}
                        onChange={async (newStatus) => {
                          try {
                            await updateOrderStatus.mutateAsync({
                              id: order.id,
                              status: newStatus as OrderStatus,
                            });
                            addToast({
                              title: "وضعیت به‌روزرسانی شد",
                              description: `سفارش ${order.workOrder}`,
                              variant: "success",
                            });
                          } catch {
                            addToast({
                              title: "خطا",
                              description: "به‌روزرسانی وضعیت انجام نشد.",
                              variant: "error",
                            });
                          }
                        }}
                        options={statusOptions}
                        className="w-40"
                      />
                    </PolishedTableCell>
                    <PolishedTableCell>
                      <span className="font-semibold text-foreground">
                        {formatPersianCurrency(order.price ?? 0)}
                      </span>
                    </PolishedTableCell>
                    <PolishedTableCell align="center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormModalOrder(order)}
                          className="h-9 w-9 p-0 rounded-md hover:bg-layer"
                          title="فرم سفارش آینه"
                        >
                          <svg
                            className="h-4 w-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/orders/wizard?id=${order.id}`)}
                          className="h-9 w-9 p-0 rounded-md hover:bg-primary/10"
                          title="ویرایش سفارش"
                        >
                          <svg
                            className="h-4 w-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setOrderToDelete({ id: order.id, workOrder: order.workOrder });
                            setDeleteDialogOpen(true);
                          }}
                          className="h-9 w-9 p-0 rounded-md hover:bg-red-500/10"
                          title="حذف سفارش"
                        >
                          <svg
                            className="h-4 w-4 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                    </PolishedTableCell>
                  </PolishedTableRow>
                ))}
              </PolishedTableBody>
            </PolishedTable>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="subtle" onClick={() => router.push("/invoices")}>
          بازگشت به لیست صورت‌حساب‌ها
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            router.push(`/orders/wizard?invoiceId=${invoiceId}`)
          }
        >
          افزودن سفارش به این صورت‌حساب
        </Button>
        {invoice && (
          <Button
            variant="destructive"
            onClick={() => setDeleteInvoiceDialogOpen(true)}
          >
            حذف صورت‌حساب
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={async () => {
          if (!orderToDelete) return;
          try {
            deleteOrderMutation.mutate(orderToDelete.id);
            addToast({
              title: "سفارش حذف شد",
              description: `سفارش ${orderToDelete.workOrder} با موفقیت حذف شد.`,
              variant: "success",
            });
            setDeleteDialogOpen(false);
            setOrderToDelete(null);
          } catch {
            addToast({
              title: "خطا",
              description: "حذف سفارش انجام نشد.",
              variant: "error",
            });
          }
        }}
        title="حذف سفارش"
        description={
          orderToDelete
            ? `آیا از حذف سفارش ${orderToDelete.workOrder} اطمینان دارید؟ این عمل قابل بازگشت نیست.`
            : ""
        }
        confirmLabel="حذف"
        cancelLabel="لغو"
        variant="destructive"
      />

      <ConfirmDialog
        open={deleteInvoiceDialogOpen}
        onClose={() => setDeleteInvoiceDialogOpen(false)}
        onConfirm={async () => {
          if (!invoiceId || !invoice) return;
          try {
            await deleteInvoiceMutation.mutateAsync(invoiceId);
            addToast({
              title: "صورت‌حساب حذف شد",
              description: `صورت‌حساب ${toPersianNumber(invoice.invoiceNumber)} با موفقیت حذف شد.`,
              variant: "success",
            });
            router.push("/invoices");
          } catch {
            addToast({
              title: "خطا",
              description: "حذف صورت‌حساب انجام نشد.",
              variant: "error",
            });
          }
        }}
        title="حذف صورت‌حساب"
        description={
          invoice
            ? `آیا از حذف صورت‌حساب ${toPersianNumber(invoice.invoiceNumber)} اطمینان دارید؟ این عمل قابل بازگشت نیست.`
            : ""
        }
        confirmLabel="حذف"
        cancelLabel="لغو"
        variant="destructive"
      />

      <Dialog
        open={!!formModalOrder}
        onClose={() => setFormModalOrder(null)}
        title="فرم سفارش آینه"
        description={formModalOrder ? `سفارش ${formModalOrder.workOrder}` : undefined}
        contentClassName="max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        {formModalOrder && (
          <div className="flex flex-col items-center gap-4">
            <MirrorOrderForm
              key={formModalOrder.id}
              initialValues={orderToFormValues(
                formModalOrder,
                invoice ? getCustomerName(invoice) : undefined,
              )}
              onExportPdf={async (element) => {
                try {
                  const filename = `فرم-سفارش-${formModalOrder.workOrder}.pdf`;
                  await exportFormToPdf(element, filename);
                  addToast({
                    title: "خروجی PDF",
                    description: "فایل با موفقیت ذخیره شد.",
                    variant: "success",
                  });
                } catch (err) {
                  addToast({
                    title: "خطا در خروجی PDF",
                    description: "امکان ذخیره فایل وجود نداشت. دوباره تلاش کنید.",
                    variant: "error",
                  });
                }
              }}
            />
            <div className="flex w-full max-w-[900px] justify-end pt-2">
              <Button variant="subtle" onClick={() => setFormModalOrder(null)}>
                بستن
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </section>
  );
}
