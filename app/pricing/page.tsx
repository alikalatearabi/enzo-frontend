 "use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { BodyText, MutedText, PageTitle, SectionSubtitle, SectionTitle } from "../../components/ui/typography";
import { useMockAccounting } from "../../lib/mocks/accounting";
import { useMockOrders } from "../../lib/mocks/orders";
import { useMockPricingRuns } from "../../lib/mocks/pricing";
import { useToast } from "../../components/ui/feedback/ToastProvider";

export default function PricingPage() {
  const { addToast } = useToast();
  const { data: sheets } = useMockAccounting();
  const { data: orders } = useMockOrders();
  const { data: pricingRuns } = useMockPricingRuns();

  const latestOrder = orders[0];
  const activeSheet = sheets.find((sheet) => sheet.status === "current");
  const [selectedOrderId, setSelectedOrderId] = useState(latestOrder?.id ?? "");
  const [selectedSheetId, setSelectedSheetId] = useState(activeSheet?.id ?? "");
  const [operator, setOperator] = useState("alex.romeo");
  const [isRunning, setIsRunning] = useState(false);
  const [runs, setRuns] = useState(pricingRuns);
  const [selectedRun, setSelectedRun] = useState(pricingRuns[0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRunPricing = () => {
    setIsRunning(true);
    setErrorMessage(null);
    const mockRun = runs.find(
      (run) => run.orderId === selectedOrderId && run.accountingSheetId === selectedSheetId,
    );
    setTimeout(() => {
      setIsRunning(false);
      if (!mockRun) {
        setErrorMessage("Unable to locate pricing run for the selected order and accounting sheet.");
        addToast({
          title: "Pricing queued",
          description: "No mock breakdown found, waiting for backend response.",
          variant: "error",
        });
        return;
      }

      if (mockRun.status === "pending" || operator.toLowerCase().includes("fail")) {
        const failedRun = {
          ...mockRun,
          status: "failed" as const,
          finishedAt: new Date().toISOString(),
        };
        setRuns((prev) =>
          prev.map((run) => (run.id === mockRun.id ? failedRun : run)),
        );
        setSelectedRun(failedRun);
        setErrorMessage("Pricing engine returned an error. Please review accounting inputs or retry later.");
        addToast({
          title: "Pricing failed",
          description: "Simulated failure to test error handling.",
          variant: "error",
        });
        return;
      }

      const completedRun = {
        ...mockRun,
        status: "complete" as const,
        finishedAt: new Date().toISOString(),
      };
      setRuns((prev) =>
        prev.map((run) => (run.id === mockRun.id ? completedRun : run)),
      );
      setSelectedRun(completedRun);
      setErrorMessage(null);
      addToast({
        title: "Pricing complete",
        description: `Order ${mockRun.orderId} updated with total $${mockRun.total.toLocaleString()}`,
        variant: "success",
      });
    }, 1200);
  };

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SectionSubtitle>Operations</SectionSubtitle>
        <PageTitle>Pricing Console</PageTitle>
        <BodyText className="max-w-2xl">
          Trigger pricing runs, inspect accounting breakdowns, and adjust order statuses.
          This view will pull from accounting tables and order metadata.
        </BodyText>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">Pricing Run</SectionTitle>
          <CardDescription>
            Mocked controls that will connect to pricing endpoints once available.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pricing-order" requiredMarker>
                Order ID
              </Label>
              <Select
                id="pricing-order"
                value={selectedOrderId}
                onChange={(event) => setSelectedOrderId(event.target.value)}
              >
                <option value="" disabled>
                  Select order
                </option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.workOrder} – {order.customerName}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pricing-sheet">Accounting Sheet</Label>
              <Select
                id="pricing-sheet"
                value={selectedSheetId}
                onChange={(event) => setSelectedSheetId(event.target.value)}
              >
                {sheets.map((sheet) => (
                  <option key={sheet.id} value={sheet.id}>
                    {sheet.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pricing-operator">Operator</Label>
              <Input
                id="pricing-operator"
                placeholder="alex.romeo"
                value={operator}
                onChange={(event) => setOperator(event.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={handleRunPricing}
              isLoading={isRunning}
            >
              Run Pricing
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                addToast({
                  title: "Preview requested",
                  description: "Would invoke backend preview endpoint when available.",
                })
              }
            >
              Preview Breakdown
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedOrderId(latestOrder?.id ?? "");
                setSelectedSheetId(activeSheet?.id ?? "");
                setOperator("alex.romeo");
                setRuns(pricingRuns);
                setSelectedRun(pricingRuns[0]);
                setErrorMessage(null);
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breakdown Preview</CardTitle>
          <CardDescription>
            Displays how base price and feature modules contribute to the final total.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {runs.map((run) => (
              <Button
                key={run.id}
                variant={selectedRun?.id === run.id ? "primary" : "subtle"}
                size="sm"
                onClick={() => setSelectedRun(run)}
              >
                {new Date(run.startedAt).toLocaleDateString()} · {run.accountingSheetName}
                {run.status !== "complete" && (
                  <span className="ml-2 text-xs uppercase">
                    {run.status === "pending" ? "Pending" : "Failed"}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {errorMessage && (
            <div className="rounded-md border border-red-400/60 bg-red-100/10 px-4 py-2 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedRun?.breakdown.map((item) => (
                <TableRow key={`${selectedRun.id}-${item.component}`}>
                  <TableCell>{item.component}</TableCell>
                  <TableCell>{item.sheet}</TableCell>
                  <TableCell className="text-right">
                    ${item.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {selectedRun?.breakdown.length === 0 && (
            <BodyText className="text-xs text-muted-foreground">
              No pricing components recorded for this run. Review accounting data or retry the calculation.
            </BodyText>
          )}
          <div className="flex items-center justify-between rounded-md border border-border bg-layer px-4 py-3 text-sm text-foreground">
            <span className="font-medium">Proposed total</span>
            <span className="text-lg font-semibold">
              {selectedRun
                ? `$${selectedRun.total.toLocaleString()}`
                : "$0.00"}
            </span>
          </div>
          {selectedRun && (
            <MutedText className="text-xs">
              Status: {selectedRun.status === "complete" ? "Complete" : selectedRun.status === "pending" ? "Pending" : "Failed"}{" "}
              {selectedRun.finishedAt
                ? ` · Finished at ${new Date(selectedRun.finishedAt).toLocaleTimeString()}`
                : ""}
            </MutedText>
          )}
          <MutedText className="text-xs">
            Integrate with `PATCH /orders/:workOrderId/compute-price-codding/:accountingId` and use the response totals once backend wiring is ready.
          </MutedText>
        </CardContent>
      </Card>
    </section>
  );
}

