"use client";

import { useMemo } from "react";

import { useUsers } from "@/hooks/api/useUsers";
import { toPersianNumber } from "../../../lib/utils/numbers";
import { SectionTitle } from "../../ui/typography";
import { statusOptions } from "./constants";
import { ReviewStepProps } from "./types";

import { User } from "@/lib/api/users";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/ui/custom-select";
import { SummaryRow } from "./utils";
import { Input } from "@/components/ui/input";

export function ReviewStep({
  data,
  setField,
  selectedMirror,
  selectedCustomer,
  selectedCutter,
  selectedFrame,
  selectedLightThread,
  selectedBackLight,
  selectedZoom,
  selectedSandblast,
  selectedThickness,
  invoiceContextLabel,
}: ReviewStepProps) {

  const { data: users, isLoading, error } = useUsers();

  const customers = useMemo(() => users.filter((user: User) => user.role === "CUSTOMER"), [users])
  const cutters = useMemo(() => users.filter((user: User) => user.role === "CUTTER"), [users])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading users</div>

  const dimentionValue = `${data.height ? toPersianNumber(data.height) : "-"} x ${data.width ? toPersianNumber(data.width) : "-"} سانتی‌متر`
  const stateValue = statusOptions.find((option) => option.value === data.status)?.label

  return (
    <div className="grid gap-4">
      {invoiceContextLabel ? (
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          {invoiceContextLabel}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="invoiceNumber" requiredMarker>
              شماره صورت حساب
            </Label>
            <Input
              id="invoiceNumber"
              type="number"
              value={data.invoiceNumber ?? ""}
              onChange={(event) => setField("invoiceNumber", Number(event.target.value))}
              placeholder="شماره صورت حساب را وارد کنید"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="customer" requiredMarker>
              مشتری
            </Label>
            <CustomSelect
              value={data.customer?._id ?? ""}
              onChange={(value) => setField("customer", users.find((u: User) => u._id === value))}
              options={[
                { value: "", label: "انتخاب مشتری" },
                ...customers.map((customer: User) => ({
                  value: customer._id,
                  label: customer.name,
                })),
              ]}
              placeholder="انتخاب مشتری"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cutter" requiredMarker>
              برشکار
            </Label>
            <CustomSelect
              value={data.cutter?._id ?? ""}
              onChange={(value) => setField("cutter", users.find((u: User) => u._id === value))}
              options={[
                { value: "", label: "انتخاب برشکار" },
                ...cutters.map((cutter: User) => ({
                  value: cutter._id,
                  label: cutter.name,
                })),
              ]}
              placeholder="انتخاب برشکار"
            />
          </div>
        </div>
      )}
      <div className="rounded-lg border border-border bg-layer p-4">
        <SectionTitle as="h3">خلاصه</SectionTitle>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <SummaryRow label="مشتری" value={selectedCustomer?.name} />
          <SummaryRow label="برشکار" value={selectedCutter?.name} />
          <SummaryRow label="آینه" value={selectedMirror?.name} />
          <SummaryRow label="قاب" value={selectedFrame?.name} />
          <SummaryRow label="نخ نوری" value={selectedLightThread?.name} />
          <SummaryRow label="نور پس‌زمینه" value={selectedBackLight?.name ?? "هیچکدام"} />
          <SummaryRow label="زوم" value={selectedZoom?.name ?? "هیچکدام"} />
          <SummaryRow label="سندبلاست" value={selectedSandblast?.name ?? "هیچکدام"} />
          <SummaryRow label="ضخامت" value={selectedThickness?.name} />
          <SummaryRow label="ماژول‌ها" value={data.mirrorModule.length} />
          <SummaryRow label="تعداد" value={data.count} />
          <SummaryRow label="ابعاد" value={dimentionValue} />
          <SummaryRow label="تاریخ شروع" value={data.startDate} />
          <SummaryRow label="تاریخ پایان" value={data.endDate} />
          <SummaryRow label="وضعیت" value={stateValue} />
        </div>
      </div>
    </div>
  );
}

