"use client";

import { useMemo, useReducer } from "react";
import { User } from "@/lib/api/users";

export type OrderWizardStepId =
  | "invoice"
  | "mirror"
  | "frame"
  | "sandblast"
  | "mirrorComponents"
  | "schedule"
  | "review";

export type OrderStatusOption =
  | "PROFORMA_INVOICE"
  | "ASSEMBLY"
  | "CUTTING"
  | "LEAVING_WAREHOUSE";

export type OrderWizardData = {
  mirror?: string;
  frame?: string;
  lightThread?: string;
  backLight?: string;
  mirrorModule: string[];
  zoom?: string;
  sandblast?: string;
  thickness?: string;
  count?: number;
  height?: number;
  width?: number;
  cornerBend?: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: OrderStatusOption;
  /** Logo ID (required by backend) */
  logo?: string;
  /** Order code (required by backend on update) */
  code?: string;
  /** Order price (required by backend on update) */
  price?: number;
  customer?: User;
  cutter?: User;
  invoiceNumber?: number;
  /** When adding order from invoice list: "new" = create invoice, "existing" = pick from list */
  invoiceChoice?: "new" | "existing";
  /** When invoiceChoice === "existing", the selected invoice id */
  selectedExistingInvoiceId?: string;
};

export type OrderWizardState = {
  currentStep: number;
  data: OrderWizardData;
  stepsLength: number;
};

type OrderWizardAction =
  | { type: "SET_FIELD"; payload: { field: keyof OrderWizardData; value: unknown } }
  | { type: "TOGGLE_MODULE"; payload: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; payload: number }
  | { type: "RESET" };

const ORDER_STEPS: Array<{
  id: OrderWizardStepId;
  title: string;
  description: string;
}> = [
  {
    id: "mirror",
    title: "قالب آینه",
    description: "انتخاب قالب آینه.",
  },
  {
    id: "frame",
    title: "قاب",
    description: "انتخاب قاب آینه.",
  },
  {
    id: "sandblast",
    title: "سندبلاست",
    description: "انتخاب سندبلاست آینه.",
  },
  {
    id: "mirrorComponents",
    title: "پیکربندی آینه",
    description: "انتخاب نخ نوری، ضخامت و ماژول‌های آینه.",
  },
  {
    id: "schedule",
    title: "زمان‌بندی و یادداشت‌ها",
    description: "تعریف بازه تولید و یادداشت‌های اختیاری.",
  },
  {
    id: "review",
    title: "بررسی و ارسال",
    description: "بررسی مجدد جزئیات قبل از ارسال سفارش.",
  },
];

const INVOICE_STEP = {
  id: "invoice" as const,
  title: "صورت‌حساب",
  description: "انتخاب یا ایجاد صورت‌حساب.",
};

const INITIAL_STATE: OrderWizardState = {
  currentStep: 0,
  data: {
    mirrorModule: [],
    status: "PROFORMA_INVOICE",
  },
  stepsLength: ORDER_STEPS.length,
};

function reducer(state: OrderWizardState, action: OrderWizardAction): OrderWizardState {
  switch (action.type) {
    case "SET_FIELD": {
      const { field, value } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          [field]: value,
        },
      };
    }
    case "TOGGLE_MODULE": {
      const moduleId = action.payload;
      const exists = state.data.mirrorModule.includes(moduleId);
      return {
        ...state,
        data: {
          ...state.data,
          mirrorModule: exists
            ? state.data.mirrorModule.filter((id) => id !== moduleId)
            : [...state.data.mirrorModule, moduleId],
        },
      };
    }
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.stepsLength - 1),
      };
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };
    case "GO_TO_STEP":
      return {
        ...state,
        currentStep: Math.min(Math.max(action.payload, 0), state.stepsLength - 1),
      };
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
}

function validateStep(
  stepId: OrderWizardStepId,
  data: OrderWizardData,
): boolean {
  switch (stepId) {
    case "invoice":
      if (data.invoiceChoice === "existing") {
        return Boolean(data.selectedExistingInvoiceId);
      }
      if (data.invoiceChoice === "new") {
        return Boolean(
          data.invoiceNumber != null &&
            String(data.invoiceNumber).trim() !== "" &&
            data.customer?._id &&
            data.cutter?._id,
        );
      }
      return false;
    case "mirror":
      return Boolean(data.mirror && data.count && data.count > 0 && data.height && data.width);
    case "frame":
      return true;
    case "sandblast":
      return Boolean(data.sandblast);
    case "mirrorComponents":
      return Boolean(data.thickness && data.logo);
    case "schedule":
      return Boolean(data.startDate && data.endDate);
    case "review":
      return true;
    default:
      return false;
  }
}

export function useOrderWizard(
  initialState?: Partial<OrderWizardData>,
  withInvoiceStep?: boolean,
) {
  const stepsLength = withInvoiceStep
    ? 1 + ORDER_STEPS.length
    : ORDER_STEPS.length;

  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    stepsLength,
    data: {
      ...INITIAL_STATE.data,
      ...(withInvoiceStep ? { invoiceChoice: "new" as const } : {}),
      ...initialState,
    },
  });

  const steps = useMemo(() => {
    const orderSteps = ORDER_STEPS.map((step, i) => {
      const stepIndex = withInvoiceStep ? i + 1 : i;
      return {
        ...step,
        index: stepIndex,
        status:
          state.currentStep > stepIndex
            ? ("complete" as const)
            : state.currentStep === stepIndex
              ? ("current" as const)
              : ("upcoming" as const),
      };
    });
    if (withInvoiceStep) {
      return [
        {
          ...INVOICE_STEP,
          index: 0,
          status:
            state.currentStep > 0
              ? ("complete" as const)
              : state.currentStep === 0
                ? ("current" as const)
                : ("upcoming" as const),
        },
        ...orderSteps,
      ];
    }
    return orderSteps;
  }, [state.currentStep, withInvoiceStep]);

  const currentStepId = steps[state.currentStep]?.id ?? "mirror";

  const canProceed = useMemo(
    () => validateStep(currentStepId, state.data),
    [currentStepId, state.data],
  );

  return {
    state,
    dispatch,
    steps,
    stepsLength,
    canProceed,
    isLastStep: state.currentStep === stepsLength - 1,
    currentStepId,
    withInvoiceStep: Boolean(withInvoiceStep),
  };
}

