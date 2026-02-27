"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  PolishedTable,
  PolishedTableBody,
  PolishedTableCell,
  PolishedTableHead,
  PolishedTableHeader,
  PolishedTableRow,
} from "../../components/ui/polished-table";
import { BodyText, MutedText, PageTitle } from "../../components/ui/typography";
import { useInvoices, useDeleteInvoice } from "../../hooks/api/useInvoince";
import { toPersianNumber } from "../../lib/utils/numbers";
import { formatPersianCurrency } from "../../lib/utils/numbers";
import { EmptyState } from "../../components/ui/empty-state";
import { ConfirmDialog } from "../../components/ui/dialog";
import { useToast } from "../../components/ui/feedback/ToastProvider";
import { Invoice } from "../../lib/api/invoice";

const invoiceStatusLabels: Record<string, string> = {
  DRAFT: "پیش‌نویس",
  ISSUED: "صادر شده",
  PAID: "پرداخت شده",
  CANCELLED: "لغو شده",
};

function getCustomerName(inv: Invoice): string {
  if (typeof inv.customer === "object" && inv.customer?.name) {
    return inv.customer.name;
  }
  return "—";
}

function getCutterName(inv: Invoice): string {
  if (typeof inv.cutter === "object" && inv.cutter?.name) {
    return inv.cutter.name;
  }
  return "—";
}

export default function InvoicesPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { data: invoices = [], isLoading, isError } = useInvoices();
  const deleteInvoiceMutation = useDeleteInvoice();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<{
    id: string;
    invoiceNumber: string;
  } | null>(null);

  return (
    <section className="flex flex-1 flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-2">
        <PageTitle>صورت‌حساب‌ها</PageTitle>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          {isError ? (
            <EmptyState
              title="خطا در بارگذاری صورت‌حساب‌ها"
              description="لطفاً بعداً دوباره تلاش کنید."
            />
          ) : invoices.length === 0 && !isLoading ? (
            <EmptyState
              title="هنوز صورت‌حسابی ثبت نشده"
              description="برای شروع، یک صورت‌حساب جدید ایجاد کنید و سفارش اضافه کنید."
              actionLabel="افزودن سفارش (ایجاد صورت‌حساب و سفارش)"
              onAction={() => router.push("/orders/wizard")}
            />
          ) : (
            <PolishedTable>
              <PolishedTableHeader>
                <PolishedTableHead>شماره صورت‌حساب</PolishedTableHead>
                <PolishedTableHead>مشتری</PolishedTableHead>
                <PolishedTableHead>برشکار</PolishedTableHead>
                <PolishedTableHead>مجموع</PolishedTableHead>
                <PolishedTableHead>وضعیت</PolishedTableHead>
                <PolishedTableHead align="center">عملیات</PolishedTableHead>
              </PolishedTableHeader>
              <PolishedTableBody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <PolishedTableRow key={index}>
                        <PolishedTableCell>
                          <span className="h-4 w-24 animate-pulse rounded bg-muted" />
                        </PolishedTableCell>
                        <PolishedTableCell>
                          <span className="h-4 w-20 animate-pulse rounded bg-muted" />
                        </PolishedTableCell>
                        <PolishedTableCell>
                          <span className="h-4 w-20 animate-pulse rounded bg-muted" />
                        </PolishedTableCell>
                        <PolishedTableCell>
                          <span className="h-4 w-24 animate-pulse rounded bg-muted" />
                        </PolishedTableCell>
                        <PolishedTableCell>
                          <span className="h-4 w-20 animate-pulse rounded bg-muted" />
                        </PolishedTableCell>
                        <PolishedTableCell>
                          <span className="h-4 w-16 animate-pulse rounded bg-muted" />
                        </PolishedTableCell>
                      </PolishedTableRow>
                    ))
                  : invoices.map((inv) => (
                      <PolishedTableRow
                        key={inv.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/invoices/${inv.id}`)}
                      >
                        <PolishedTableCell>
                          <span className="font-semibold text-foreground">
                            {toPersianNumber(inv.invoiceNumber)}
                          </span>
                        </PolishedTableCell>
                        <PolishedTableCell>
                          <BodyText>{getCustomerName(inv)}</BodyText>
                        </PolishedTableCell>
                        <PolishedTableCell>
                          <BodyText>{getCutterName(inv)}</BodyText>
                        </PolishedTableCell>
                        <PolishedTableCell>
                          <span className="font-semibold text-foreground">
                            {formatPersianCurrency(inv.totalPrice ?? 0)}
                          </span>
                        </PolishedTableCell>
                        <PolishedTableCell>
                          <MutedText className="text-xs">
                            {invoiceStatusLabels[inv.status] ?? inv.status}
                          </MutedText>
                        </PolishedTableCell>
                        <PolishedTableCell
                          align="center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setInvoiceToDelete({
                                id: inv.id,
                                invoiceNumber: String(inv.invoiceNumber),
                              });
                              setDeleteDialogOpen(true);
                            }}
                            className="h-9 w-9 p-0 rounded-md hover:bg-red-500/10"
                            title="حذف صورت‌حساب"
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
                        </PolishedTableCell>
                      </PolishedTableRow>
                    ))}
              </PolishedTableBody>
            </PolishedTable>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={() => router.push("/orders/wizard")}
        >
          افزودن سفارش (انتخاب یا ایجاد صورت‌حساب)
        </Button>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setInvoiceToDelete(null);
        }}
        onConfirm={async () => {
          if (!invoiceToDelete) return;
          try {
            await deleteInvoiceMutation.mutateAsync(invoiceToDelete.id);
            addToast({
              title: "صورت‌حساب حذف شد",
              description: `صورت‌حساب ${toPersianNumber(invoiceToDelete.invoiceNumber)} با موفقیت حذف شد.`,
              variant: "success",
            });
            setDeleteDialogOpen(false);
            setInvoiceToDelete(null);
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
          invoiceToDelete
            ? `آیا از حذف صورت‌حساب ${toPersianNumber(invoiceToDelete.invoiceNumber)} اطمینان دارید؟ این عمل قابل بازگشت نیست.`
            : ""
        }
        confirmLabel="حذف"
        cancelLabel="لغو"
        variant="destructive"
      />
    </section>
  );
}
