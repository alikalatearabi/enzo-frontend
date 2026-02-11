 "use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { formatPersianCurrency, toPersianNumber } from "../../lib/utils/numbers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  PolishedTable,
  PolishedTableBody,
  PolishedTableCell,
  PolishedTableHead,
  PolishedTableHeader,
  PolishedTableRow,
} from "../../components/ui/polished-table";
import {
  BodyText,
  MutedText,
  PageTitle,
  SectionSubtitle,
  SectionTitle,
} from "../../components/ui/typography";
import { useOrdersData } from "../../hooks/orders/useOrdersData";
import { Select } from "../../components/ui/select";
import { useToast } from "../../components/ui/feedback/ToastProvider";
import { Input } from "../../components/ui/input";
import { EmptyState } from "../../components/ui/empty-state";
import { ConfirmDialog } from "../../components/ui/dialog";
import { CustomSelect } from "../../components/ui/custom-select";
import { OrderStatus } from "../../lib/api/orders";

const statusOptions = [
  { value: "PROFORMA_INVOICE", label: "پیش‌فاکتور" },
  { value: "ASSEMBLY", label: "مونتاژ" },
  { value: "CUTTING", label: "برش" },
  { value: "LEAVING_WAREHOUSE", label: "خروج از انبار" },
];

export default function OrdersPage() {
  const router = useRouter();
  const { orders, updateOrderStatus, deleteOrder, statusCounts, isLoading, isError } =
    useOrdersData();
  const statusLabel = statusOptions.reduce<Record<string, string>>(
    (acc, option) => {
      acc[option.value] = option.label;
      return acc;
    },
    {},
  );
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<{ id: string; workOrder: string } | null>(null);
  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesSearch =
          !searchTerm ||
          order.workOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      }),
    [orders, searchTerm, statusFilter],
  );
  const { addToast } = useToast();

  return (
    <section className="flex flex-1 flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-2">
        <PageTitle>سفارش‌ها</PageTitle>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="flex flex-col gap-2 py-4">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {statusLabel[status]}
              </span>
              <span className="text-2xl font-semibold text-foreground">
                {isLoading ? "…" : toPersianNumber(count)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">سفارش‌های اخیر</SectionTitle>
          <CardDescription>
            جدول نگهدارنده برای طراحی در حالی که مدل داده را نهایی می‌کنیم.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="جستجوی سفارش کار یا مشتری"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="max-w-xs"
            />
            <CustomSelect
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as typeof statusFilter)}
              options={[
                { value: "all", label: "همه وضعیت‌ها" },
                ...statusOptions,
              ]}
              className="w-48"
            />
            <BodyText className="text-xs">
              نمایش {toPersianNumber(filteredOrders.length)} از {toPersianNumber(orders.length)} سفارش
            </BodyText>
          </div>

          {isError ? (
            <EmptyState
              title="خطا در بارگذاری سفارش‌ها"
              description="در بارگذاری سفارش‌ها مشکلی پیش آمد. لطفاً بعداً دوباره تلاش کنید."
            />
          ) : filteredOrders.length === 0 && !isLoading ? (
            <EmptyState
              title="هیچ سفارشی با فیلترهای شما مطابقت ندارد"
              description="فیلتر وضعیت را تنظیم کنید یا عبارت جستجو را پاک کنید تا سفارش‌های بیشتری را مشاهده کنید."
              actionLabel="پاک کردن فیلترها"
              onAction={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            />
          ) : (
          <PolishedTable>
            <PolishedTableHeader>
              <PolishedTableHead>شناسه</PolishedTableHead>
              <PolishedTableHead>مشتری</PolishedTableHead>
              <PolishedTableHead>اختصاص داده شده</PolishedTableHead>
              <PolishedTableHead>وضعیت</PolishedTableHead>
              <PolishedTableHead>مجموع</PolishedTableHead>
              <PolishedTableHead align="center">عملیات</PolishedTableHead>
            </PolishedTableHeader>
            <PolishedTableBody>
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <PolishedTableRow key={index}>
                      <PolishedTableCell>
                        <div className="flex flex-col gap-1">
                          <span className="h-4 w-20 animate-pulse rounded bg-muted" />
                          <span className="h-3 w-24 animate-pulse rounded bg-muted" />
                        </div>
                      </PolishedTableCell>
                      <PolishedTableCell>
                        <span className="h-4 w-24 animate-pulse rounded bg-muted" />
                      </PolishedTableCell>
                      <PolishedTableCell>
                        <span className="h-4 w-24 animate-pulse rounded bg-muted" />
                      </PolishedTableCell>
                      <PolishedTableCell>
                        <span className="h-4 w-24 animate-pulse rounded bg-muted" />
                      </PolishedTableCell>
                      <PolishedTableCell>
                        <span className="h-4 w-16 animate-pulse rounded bg-muted" />
                      </PolishedTableCell>
                      <PolishedTableCell align="center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="h-8 w-8 animate-pulse rounded-md bg-muted" />
                          <span className="h-8 w-8 animate-pulse rounded-md bg-muted" />
                        </div>
                      </PolishedTableCell>
                    </PolishedTableRow>
                  ))
                : filteredOrders.map((order, index) => (
                <PolishedTableRow key={order.id}>
                  <PolishedTableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-foreground">
                        {order.workOrder}
                      </span>
                      <MutedText className="text-xs">{order.mirrorName}</MutedText>
                    </div>
                  </PolishedTableCell>
                  <PolishedTableCell>
                    <span className="font-medium text-foreground">
                      {order.customerName}
                    </span>
                  </PolishedTableCell>
                  <PolishedTableCell>
                    <span className="text-muted-foreground">
                      {order.cutterName}
                    </span>
                  </PolishedTableCell>
                  <PolishedTableCell>
                    <CustomSelect
                      value={order.status}
                      onChange={(newStatus) => {
                        updateOrderStatus({
                          orderId: order.id,
                          status: newStatus as OrderStatus,
                        });
                        addToast({
                          title: "وضعیت به‌روزرسانی شد",
                          description: `سفارش ${order.workOrder} به ${statusLabel[newStatus]}`,
                          variant: "success",
                        });
                      }}
                      options={statusOptions}
                      className="w-40"
                    />
                  </PolishedTableCell>
                  <PolishedTableCell>
                    <span className="font-semibold text-foreground">
                      {formatPersianCurrency(order.price)}
                    </span>
                  </PolishedTableCell>
                  <PolishedTableCell align="center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          router.push(`/orders/wizard?id=${order.id}`);
                        }}
                        className="h-9 w-9 p-0 rounded-md hover:bg-primary/10 transition-colors"
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
                        className="h-9 w-9 p-0 rounded-md hover:bg-red-500/10 transition-colors"
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
        <Link
          href="/orders/wizard"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium shadow-sm transition-colors hover:bg-primary/90"
          style={{ color: 'var(--primary-foreground)' }}
        >
          ثبت سفارش جدید
        </Link>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={() => {
          if (orderToDelete) {
            deleteOrder(orderToDelete.id);
            addToast({
              title: "سفارش حذف شد",
              description: `سفارش ${orderToDelete.workOrder} با موفقیت حذف شد.`,
              variant: "success",
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
    </section>
  );
}

