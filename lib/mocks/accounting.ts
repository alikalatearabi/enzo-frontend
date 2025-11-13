export type AccountingItem = {
  featureName: string;
  code?: string;
  price: number;
};

export type AccountingSheet = {
  id: string;
  name: string;
  items: Record<string, AccountingItem>;
  effectiveDate: string;
  status: "current" | "superseded";
  createdAt: string;
  updatedAt: string;
};

export const ACCOUNTING_SHEETS: AccountingSheet[] = [
  {
    id: "65d100000000000000000001",
    name: "mirror-base",
    items: {
      "Mirror Module": {
        featureName: "Mirror Module",
        price: 1100,
      },
      Frame: {
        featureName: "Frame",
        price: 220,
      },
    },
    effectiveDate: "2025-02-01",
    status: "current",
    createdAt: "2025-02-01T09:00:00Z",
    updatedAt: "2025-02-10T12:00:00Z",
  },
  {
    id: "65d100000000000000000002",
    name: "lighting-addons",
    items: {
      "Back Light": {
        featureName: "Back Light",
        price: 320,
      },
      "Light Thread": {
        featureName: "Light Thread",
        price: 110,
      },
    },
    effectiveDate: "2025-01-15",
    status: "superseded",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-02-05T14:25:00Z",
  },
];

export function useMockAccounting() {
  return {
    data: ACCOUNTING_SHEETS,
    isLoading: false,
  };
}

