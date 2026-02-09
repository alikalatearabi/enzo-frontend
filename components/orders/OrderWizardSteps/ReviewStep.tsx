"use client";

import { toPersianNumber } from "../../../lib/utils/numbers";
import { SectionTitle } from "../../ui/typography";
import { statusOptions } from "./constants";
import { StepProps } from "./types";

type FeatureOption = {
  id: string;
  name: string;
};

type ReviewStepProps = StepProps & {
  selectedMirror?: { name: string };
  selectedCustomer?: { name: string };
  selectedCutter?: { name: string };
  selectedFrame?: FeatureOption;
  selectedLightThread?: FeatureOption;
  selectedBackLight?: FeatureOption;
  selectedZoom?: FeatureOption;
  selectedSandblast?: FeatureOption;
  selectedThickness?: FeatureOption;
  submitted: boolean;
};

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  const displayValue = typeof value === "number" ? toPersianNumber(value) : value;
  return (
    <div className="flex justify-between text-sm" dir="rtl">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">
        {displayValue ?? "—"}
      </span>
    </div>
  );
}

export function ReviewStep({
  data,
  selectedMirror,
  selectedCustomer,
  selectedCutter,
  selectedFrame,
  selectedLightThread,
  selectedBackLight,
  selectedZoom,
  selectedSandblast,
  selectedThickness,
  submitted,
}: ReviewStepProps) {
  return (
    <div className="grid gap-4">
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
          <SummaryRow
            label="ابعاد"
            value={`${data.height ? toPersianNumber(data.height) : "-"} x ${data.width ? toPersianNumber(data.width) : "-"} سانتی‌متر`}
          />
          <SummaryRow label="تاریخ شروع" value={data.startDate} />
          <SummaryRow label="تاریخ پایان" value={data.endDate} />
          <SummaryRow
            label="وضعیت"
            value={statusOptions.find((option) => option.value === data.status)?.label}
          />
        </div>
      </div>
      {submitted && (
        <div className="rounded-md border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
          پیش‌نویس سفارش آماده شد. ارسال شبیه‌سازی شده را با فراخوانی API واقعی جایگزین کنید.
        </div>
      )}
    </div>
  );
}

