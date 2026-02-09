import { OrderWizardData } from "../../../hooks/orders/useOrderWizard";

export type StepProps = {
  data: OrderWizardData;
  errors: Record<string, string>;
  setField: (field: keyof OrderWizardData, value: unknown) => void;
  clearError: (field: keyof OrderWizardData | string) => void;
};

