"use client";

import { useMemo, useReducer } from "react";

export type OrderWizardStepId =
  | "participants"
  | "mirror"
  | "dimensions"
  | "schedule"
  | "review";

export type OrderStatusOption =
  | "PROFORMA_INVOICE"
  | "ASSEMBLY"
  | "CUTTING"
  | "LEAVING_WAREHOUSE";

export type OrderWizardData = {
  customer?: string;
  cutter?: string;
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
};

export type OrderWizardState = {
  currentStep: number;
  data: OrderWizardData;
};

type OrderWizardAction =
  | { type: "SET_FIELD"; payload: { field: keyof OrderWizardData; value: unknown } }
  | { type: "TOGGLE_MODULE"; payload: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; payload: number }
  | { type: "RESET" };

const INITIAL_STATE: OrderWizardState = {
  currentStep: 0,
  data: {
    mirrorModule: [],
    status: "PROFORMA_INVOICE",
  },
};

const STEPS: Array<{
  id: OrderWizardStepId;
  title: string;
  description: string;
}> = [
  {
    id: "participants",
    title: "Customer & Cutter",
    description: "Assign stakeholders responsible for this work order.",
  },
  {
    id: "mirror",
    title: "Mirror Configuration",
    description: "Select mirror template and feature modules.",
  },
  {
    id: "dimensions",
    title: "Dimensions & Quantity",
    description: "Capture measurements, quantities, and extra options.",
  },
  {
    id: "schedule",
    title: "Schedule & Notes",
    description: "Define production window and optional notes.",
  },
  {
    id: "review",
    title: "Review & Submit",
    description: "Double-check details before submitting the order.",
  },
];

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
        currentStep: Math.min(state.currentStep + 1, STEPS.length - 1),
      };
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };
    case "GO_TO_STEP":
      return {
        ...state,
        currentStep: Math.min(Math.max(action.payload, 0), STEPS.length - 1),
      };
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
}

function validateStep(stepIndex: number, data: OrderWizardData) {
  switch (STEPS[stepIndex]?.id) {
    case "participants":
      return Boolean(data.customer && data.cutter);
    case "mirror":
      return Boolean(data.mirror && data.frame && data.lightThread && data.thickness);
    case "dimensions":
      return Boolean(
        data.count && data.count > 0 && data.height && data.height > 0 && data.width && data.width > 0,
      );
    case "schedule":
      return Boolean(data.startDate && data.endDate);
    case "review":
      return true;
    default:
      return false;
  }
}

export function useOrderWizard(initialState?: Partial<OrderWizardData>) {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    data: {
      ...INITIAL_STATE.data,
      ...initialState,
    },
  });

  const canProceed = useMemo(
    () => validateStep(state.currentStep, state.data),
    [state.currentStep, state.data],
  );

  const steps = useMemo(
    () =>
      STEPS.map((step, index) => ({
        ...step,
        index,
        status:
          index < state.currentStep
            ? ("complete" as const)
            : index === state.currentStep
              ? ("current" as const)
              : ("upcoming" as const),
      })),
    [state.currentStep],
  );

  return {
    state,
    dispatch,
    steps,
    canProceed,
    isLastStep: state.currentStep === STEPS.length - 1,
  };
}

