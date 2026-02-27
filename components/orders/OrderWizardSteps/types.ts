import { OrderWizardData } from "../../../hooks/orders/useOrderWizard";

export type StepProps = {
  data: OrderWizardData;
  errors: Record<string, string>;
  setField: (field: keyof OrderWizardData, value: unknown) => void;
  clearError: (field: keyof OrderWizardData | string) => void;
};

export type FeatureOption = {
  id: string;
  name: string;
};

export type ReviewStepProps = StepProps & {
  selectedMirror?: { name: string };
  selectedCustomer?: { name: string };
  selectedCutter?: { name: string };
  selectedFrame?: FeatureOption;
  selectedLightThread?: FeatureOption;
  selectedBackLight?: FeatureOption;
  selectedZoom?: FeatureOption;
  selectedSandblast?: FeatureOption;
  selectedThickness?: FeatureOption;
  /** When adding order to an existing invoice, show this instead of invoice fields */
  invoiceContextLabel?: string;
};
