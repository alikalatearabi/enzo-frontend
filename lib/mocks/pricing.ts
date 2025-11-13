export type PricingRunStatus = "pending" | "complete" | "failed";

export type PricingBreakdownItem = {
  component: string;
  sheet: string;
  amount: number;
};

export type PricingRun = {
  id: string;
  orderId: string;
  accountingSheetId: string;
  accountingSheetName: string;
  operator: string;
  startedAt: string;
  finishedAt?: string;
  status: PricingRunStatus;
  breakdown: PricingBreakdownItem[];
  total: number;
};

export const PRICING_RUNS: PricingRun[] = [
  {
    id: "pricing-run-001",
    orderId: "65c200000000000000000001",
    accountingSheetId: "65d100000000000000000001",
    accountingSheetName: "mirror-base",
    operator: "alex.romeo",
    startedAt: "2025-02-16T12:00:00Z",
    finishedAt: "2025-02-16T12:01:45Z",
    status: "complete",
    breakdown: [
      { component: "Base Mirror", sheet: "mirror-base", amount: 1100 },
      { component: "Frame", sheet: "mirror-base", amount: 220 },
      { component: "Back Light", sheet: "lighting-addons", amount: 320 },
    ],
    total: 1640,
  },
  {
    id: "pricing-run-002",
    orderId: "65c200000000000000000002",
    accountingSheetId: "65d100000000000000000001",
    accountingSheetName: "mirror-base",
    operator: "priya.khanna",
    startedAt: "2025-02-15T18:30:00Z",
    finishedAt: "2025-02-15T18:31:30Z",
    status: "complete",
    breakdown: [
      { component: "Base Mirror", sheet: "mirror-base", amount: 1100 },
      { component: "Frame", sheet: "mirror-base", amount: 220 },
      { component: "Light Thread", sheet: "lighting-addons", amount: 110 },
    ],
    total: 1430,
  },
  {
    id: "pricing-run-003",
    orderId: "65c200000000000000000003",
    accountingSheetId: "65d100000000000000000002",
    accountingSheetName: "lighting-addons",
    operator: "system",
    startedAt: "2025-02-13T09:10:00Z",
    status: "pending",
    breakdown: [],
    total: 0,
  },
];

export function useMockPricingRuns() {
  return {
    data: PRICING_RUNS,
    isLoading: false,
  };
}

