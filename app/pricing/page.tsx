 "use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { CustomSelect } from "../../components/ui/custom-select";
import {
  PolishedTable,
  PolishedTableBody,
  PolishedTableCell,
  PolishedTableHead,
  PolishedTableHeader,
  PolishedTableRow,
} from "../../components/ui/polished-table";
import { BodyText, MutedText, PageTitle, SectionSubtitle, SectionTitle } from "../../components/ui/typography";
import { useMockAccounting } from "../../lib/mocks/accounting";
import { useMockOrders } from "../../lib/mocks/orders";
import { useMockPricingRuns } from "../../lib/mocks/pricing";
import { useToast } from "../../components/ui/feedback/ToastProvider";
import { formatPersianCurrency, toPersianNumber } from "../../lib/utils/numbers";

export default function PricingPage() {
  const { addToast } = useToast();
  const { data: sheets } = useMockAccounting();
  const { data: orders } = useMockOrders();
  const { data: pricingRuns } = useMockPricingRuns();

  const latestOrder = orders[0];
  const activeSheet = sheets.find((sheet) => sheet.status === "current");
  const [selectedOrderId, setSelectedOrderId] = useState(latestOrder?.id ?? "");
  const [selectedSheetId, setSelectedSheetId] = useState(activeSheet?.id ?? "");
  const [operator, setOperator] = useState("alex.romeo");
  const [isRunning, setIsRunning] = useState(false);
  const [runs, setRuns] = useState(pricingRuns);
  const [selectedRun, setSelectedRun] = useState(pricingRuns[0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRunPricing = () => {
    setIsRunning(true);
    setErrorMessage(null);
    const mockRun = runs.find(
      (run) => run.orderId === selectedOrderId && run.accountingSheetId === selectedSheetId,
    );
    setTimeout(() => {
      setIsRunning(false);
      if (!mockRun) {
        setErrorMessage("نمی‌توان اجرای قیمت‌گذاری را برای سفارش و ورقه حسابداری انتخاب شده پیدا کرد.");
        addToast({
          title: "قیمت‌گذاری در صف",
          description: "جزئیات شبیه‌سازی شده یافت نشد، در انتظار پاسخ بک‌اند.",
          variant: "error",
        });
        return;
      }

      if (mockRun.status === "pending" || operator.toLowerCase().includes("fail")) {
        const failedRun = {
          ...mockRun,
          status: "failed" as const,
          finishedAt: new Date().toISOString(),
        };
        setRuns((prev) =>
          prev.map((run) => (run.id === mockRun.id ? failedRun : run)),
        );
        setSelectedRun(failedRun);
        setErrorMessage("موتور قیمت‌گذاری خطا برگرداند. لطفاً ورودی‌های حسابداری را بررسی کنید یا بعداً دوباره تلاش کنید.");
        addToast({
          title: "قیمت‌گذاری ناموفق",
          description: "شکست شبیه‌سازی شده برای تست مدیریت خطا.",
          variant: "error",
        });
        return;
      }

      const completedRun = {
        ...mockRun,
        status: "complete" as const,
        finishedAt: new Date().toISOString(),
      };
      setRuns((prev) =>
        prev.map((run) => (run.id === mockRun.id ? completedRun : run)),
      );
      setSelectedRun(completedRun);
      setErrorMessage(null);
      addToast({
        title: "قیمت‌گذاری تکمیل شد",
        description: `سفارش ${mockRun.orderId} با مجموع ${formatPersianCurrency(mockRun.total)} به‌روزرسانی شد.`,
        variant: "success",
      });
    }, 1200);
  };

  return (
    <section className="flex flex-1 flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-2">
        <PageTitle>کنسول قیمت‌گذاری</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">اجرای قیمت‌گذاری</SectionTitle>
          <CardDescription>
            کنترل‌های شبیه‌سازی شده که پس از آماده شدن به نقاط پایانی قیمت‌گذاری متصل می‌شوند.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pricing-order" requiredMarker>
                شناسه سفارش
              </Label>
              <CustomSelect
                value={selectedOrderId}
                onChange={(value) => setSelectedOrderId(value)}
                options={[
                  { value: "", label: "انتخاب سفارش" },
                  ...orders.map((order) => ({
                    value: order.id,
                    label: `${order.workOrder} – ${order.customerName}`,
                  })),
                ]}
                placeholder="انتخاب سفارش"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pricing-sheet">ورقه حسابداری</Label>
              <CustomSelect
                value={selectedSheetId}
                onChange={(value) => setSelectedSheetId(value)}
                options={sheets.map((sheet) => ({
                  value: sheet.id,
                  label: sheet.name,
                }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pricing-operator">اپراتور</Label>
              <Input
                id="pricing-operator"
                placeholder="alex.romeo"
                value={operator}
                onChange={(event) => setOperator(event.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={handleRunPricing}
              isLoading={isRunning}
            >
              اجرای قیمت‌گذاری
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                addToast({
                  title: "درخواست پیش‌نمایش",
                  description: "پس از آماده شدن، نقطه پایانی پیش‌نمایش بک‌اند فراخوانی می‌شود.",
                })
              }
            >
              پیش‌نمایش جزئیات
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedOrderId(latestOrder?.id ?? "");
                setSelectedSheetId(activeSheet?.id ?? "");
                setOperator("alex.romeo");
                setRuns(pricingRuns);
                setSelectedRun(pricingRuns[0]);
                setErrorMessage(null);
              }}
            >
              بازنشانی
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>پیش‌نمایش جزئیات</CardTitle>
          <CardDescription>
            نمایش نحوه مشارکت قیمت پایه و ماژول‌های ویژگی در مجموع نهایی.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {runs.map((run) => (
              <Button
                key={run.id}
                variant={selectedRun?.id === run.id ? "primary" : "subtle"}
                size="sm"
                onClick={() => setSelectedRun(run)}
              >
                {new Date(run.startedAt).toLocaleDateString("fa-IR")} · {run.accountingSheetName}
                {run.status !== "complete" && (
                  <span className="ml-2 text-xs uppercase">
                    {run.status === "pending" ? "در انتظار" : "ناموفق"}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {errorMessage && (
            <div className="rounded-md border border-red-400/60 bg-red-100/10 px-4 py-2 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <PolishedTable>
            <PolishedTableHeader>
              <PolishedTableHead>مؤلفه</PolishedTableHead>
              <PolishedTableHead>مرجع</PolishedTableHead>
              <PolishedTableHead>مبلغ</PolishedTableHead>
            </PolishedTableHeader>
            <PolishedTableBody>
              {selectedRun?.breakdown.map((item) => (
                <PolishedTableRow key={`${selectedRun.id}-${item.component}`}>
                  <PolishedTableCell>{item.component}</PolishedTableCell>
                  <PolishedTableCell>{item.sheet}</PolishedTableCell>
                  <PolishedTableCell>
                    {formatPersianCurrency(item.amount)}
                  </PolishedTableCell>
                </PolishedTableRow>
              ))}
            </PolishedTableBody>
          </PolishedTable>
          {selectedRun?.breakdown.length === 0 && (
            <BodyText className="text-xs text-muted-foreground">
              هیچ مؤلفه قیمت‌گذاری برای این اجرا ثبت نشده است. داده‌های حسابداری را بررسی کنید یا محاسبه را دوباره امتحان کنید.
            </BodyText>
          )}
          <div className="flex items-center justify-between rounded-md border border-border bg-layer px-4 py-3 text-sm text-foreground">
            <span className="font-medium">مجموع پیشنهادی</span>
            <span className="text-lg font-semibold">
              {selectedRun
                ? formatPersianCurrency(selectedRun.total)
                : formatPersianCurrency(0)}
            </span>
          </div>
          {selectedRun && (
            <MutedText className="text-xs">
              وضعیت: {selectedRun.status === "complete" ? "تکمیل شده" : selectedRun.status === "pending" ? "در انتظار" : "ناموفق"}{" "}
              {selectedRun.finishedAt
                ? ` · پایان یافته در ${new Date(selectedRun.finishedAt).toLocaleTimeString("fa-IR")}`
                : ""}
            </MutedText>
          )}
          <MutedText className="text-xs">
            با `PATCH /orders/:workOrderId/compute-price-codding/:accountingId` ادغام کنید و پس از آماده شدن سیم‌کشی بک‌اند از مجموع‌های پاسخ استفاده کنید.
          </MutedText>
        </CardContent>
      </Card>
    </section>
  );
}

