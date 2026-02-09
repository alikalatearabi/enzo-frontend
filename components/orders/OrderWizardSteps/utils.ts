import { OrderWizardData, OrderWizardStepId } from "../../../hooks/orders/useOrderWizard";

export function validateStep(
  stepId: OrderWizardStepId,
  data: OrderWizardData,
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  switch (stepId) {
    case "participants": {
      if (!data.customer) errors.customer = "مشتری الزامی است.";
      if (!data.cutter) errors.cutter = "برشکار الزامی است.";
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
      if (!data.frame) errors.frame = "قاب الزامی است.";
      break;
    }
    case "sandblast": {
      // Optional step - no validation needed
      break;
    }
    case "mirrorComponents": {
      if (!data.lightThread) errors.lightThread = "نخ نوری الزامی است.";
      if (!data.thickness) errors.thickness = "ضخامت الزامی است.";
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

