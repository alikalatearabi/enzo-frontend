import { toPersianNumber } from "@/lib/utils/numbers";
import { OrderWizardData, OrderWizardStepId } from "../../../hooks/orders/useOrderWizard";

export function validateStep(
  stepId: OrderWizardStepId,
  data: OrderWizardData,
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  switch (stepId) {
    case "invoice": {
      if (data.invoiceChoice === "existing") {
        if (!data.selectedExistingInvoiceId)
          errors.selectedExistingInvoiceId = "یک صورت‌حساب انتخاب کنید.";
      } else if (data.invoiceChoice === "new") {
        if (!data.invoiceNumber && data.invoiceNumber !== 0)
          errors.invoiceNumber = "شماره صورت‌حساب الزامی است.";
        if (!data.customer?._id) errors.customer = "مشتری الزامی است.";
        if (!data.cutter?._id) errors.cutter = "برشکار الزامی است.";
      } else {
        errors.invoiceChoice = "صورت‌حساب جدید یا موجود را انتخاب کنید.";
      }
      break;
    }
    case "mirror": {
      if (!data.mirror) errors.mirror = "یک قالب آینه انتخاب کنید.";
      if (!data.count || data.count <= 0) errors.count = "تعداد باید بیشتر از صفر باشد.";
      if (!data.height || data.height <= 0) errors.height = "ارتفاع باید بیشتر از صفر باشد.";
      if (!data.width || data.width <= 0) errors.width = "عرض باید بیشتر از صفر باشد.";
      break;
    }
    case "frame": {
      break;
    }
    case "sandblast": {
      if (!data.sandblast) errors.sandblast = "سندبلاست الزامی است.";
      break;
    }
    case "mirrorComponents": {
      if (!data.thickness) errors.thickness = "ضخامت الزامی است.";
      if (!data.logo || !data.logo.trim()) errors.logo = "لوگو الزامی است.";
      break;
    }
    case "schedule": {
      if (!data.startDate) errors.startDate = "تاریخ شروع الزامی است.";
      if (!data.endDate) errors.endDate = "تاریخ پایان الزامی است.";
      if (data.startDate && data.endDate && data.startDate > data.endDate) {
        errors.endDate = "تاریخ پایان باید بعد از تاریخ شروع باشد.";
      }
      break;
    }
    default:
      break;
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function SummaryRow({ label, value }: { label: string; value?: string | number | null }) {
  const displayValue = typeof value === "number" ? toPersianNumber(value) : value;
  return (
    <div className="flex justify-between text-sm" dir="rtl">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">
        {displayValue ?? "—"}
      </span>
    </div>
  )
}

