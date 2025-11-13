"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  BodyText,
  MutedText,
  PageTitle,
  SectionSubtitle,
  SectionTitle,
} from "../ui/typography";
import { WizardStepper } from "./WizardStepper";
import { useToast } from "../ui/feedback/ToastProvider";
import {
  useOrderWizard,
  OrderWizardData,
  OrderWizardStepId,
} from "../../hooks/orders/useOrderWizard";
import { useMockUsers } from "../../lib/mocks/users";
import { useMockMirrors } from "../../lib/mocks/mirrors";
import { useMockFeatureModules } from "../../lib/mocks/features";

const statusOptions = [
  { value: "PROFORMA_INVOICE", label: "Proforma Invoice" },
  { value: "ASSEMBLY", label: "Assembly" },
  { value: "CUTTING", label: "Cutting" },
  { value: "LEAVING_WAREHOUSE", label: "Leaving Warehouse" },
];

function ExtractedReview({ data }: { data: OrderWizardData }) {
  const payload = {
    workOrder: "WO-2025-XXX",
    description: data.description ?? "",
    count: data.count ?? 1,
    mirror: data.mirror,
    frame: data.frame,
    lightThread: data.lightThread,
    backLight: data.backLight,
    mirrorModule: data.mirrorModule,
    zoom: data.zoom,
    sandblast: data.sandblast,
    thickness: data.thickness,
    height: data.height,
    width: data.width,
    cornerBend: data.cornerBend,
    customer: data.customer,
    cutter: data.cutter,
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status,
    price: 0,
  };

  return (
    <div className="rounded-md border border-border bg-layer px-4 py-3 text-xs text-muted-foreground">
      <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}

export function OrderWizard() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, dispatch, steps, isLastStep } = useOrderWizard();
  const { data: customers } = useMockUsers("CUSTOMER");
  const { data: cutters } = useMockUsers("CUTTER");
  const { data: mirrors } = useMockMirrors();
  const { data: featureModules } = useMockFeatureModules();
  const { addToast } = useToast();

  const clearError = (field: keyof OrderWizardData | string) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const setField = (field: keyof OrderWizardData, value: unknown) => {
    dispatch({ type: "SET_FIELD", payload: { field, value } });
    clearError(field);
  };

  const frameOptions = useMemo(
    () =>
      featureModules.filter((feature) => feature.type === "frame"),
    [featureModules],
  );
  const lightThreadOptions = useMemo(
    () =>
      featureModules.filter((feature) => feature.type === "lightThread"),
    [featureModules],
  );
  const backLightOptions = useMemo(
    () =>
      featureModules.filter((feature) => feature.type === "backLight"),
    [featureModules],
  );
  const zoomOptions = useMemo(
    () => featureModules.filter((feature) => feature.type === "zoom"),
    [featureModules],
  );
  const sandblastOptions = useMemo(
    () =>
      featureModules.filter((feature) => feature.type === "sandblast"),
    [featureModules],
  );
  const thicknessOptions = useMemo(
    () =>
      featureModules.filter((feature) => feature.type === "thickness"),
    [featureModules],
  );
  const moduleOptions = useMemo(
    () =>
      featureModules.filter((feature) => feature.type === "mirrorModule"),
    [featureModules],
  );

  const currentStepId: OrderWizardStepId = steps[state.currentStep].id;

const setStepErrors = (fields: string[], stepErrors: Record<string, string>) => {
  setErrors((prev) => {
    const next = { ...prev };
    fields.forEach((field) => {
      delete next[field];
    });
    return { ...next, ...stepErrors };
  });
};

  const handleMirrorSelection = (mirrorId: string) => {
    setField("mirror", mirrorId);
    const selected = mirrors.find((mirror) => mirror.id === mirrorId);
    if (selected) {
      if (selected.features.frame) {
        setField("frame", selected.features.frame);
      }
      if (selected.features.lightThread) {
        setField("lightThread", selected.features.lightThread);
      }
      if (selected.features.backLight) {
        setField("backLight", selected.features.backLight);
      }
      if (selected.features.mirrorModules) {
        setField("mirrorModule", selected.features.mirrorModules);
      }
    }
  clearError("mirror");
};

const validateCurrentStep = () => {
  const data = state.data;
  switch (currentStepId) {
    case "participants": {
      const fields = ["customer", "cutter"];
      const stepErrors: Record<string, string> = {};
      if (!data.customer) stepErrors.customer = "Customer is required.";
      if (!data.cutter) stepErrors.cutter = "Cutter is required.";
      setStepErrors(fields, stepErrors);
      return Object.keys(stepErrors).length === 0;
    }
    case "mirror": {
      const fields = ["mirror", "frame", "lightThread", "thickness"];
      const stepErrors: Record<string, string> = {};
      if (!data.mirror) stepErrors.mirror = "Select a mirror template.";
      if (!data.frame) stepErrors.frame = "Frame is required.";
      if (!data.lightThread) stepErrors.lightThread = "Light thread is required.";
      if (!data.thickness) stepErrors.thickness = "Thickness is required.";
      setStepErrors(fields, stepErrors);
      return Object.keys(stepErrors).length === 0;
    }
    case "dimensions": {
      const fields = ["count", "height", "width"];
      const stepErrors: Record<string, string> = {};
      if (!data.count || data.count <= 0) stepErrors.count = "Quantity must be greater than zero.";
      if (!data.height || data.height <= 0) stepErrors.height = "Height must be greater than zero.";
      if (!data.width || data.width <= 0) stepErrors.width = "Width must be greater than zero.";
      setStepErrors(fields, stepErrors);
      return Object.keys(stepErrors).length === 0;
    }
    case "schedule": {
      const fields = ["startDate", "endDate"];
      const stepErrors: Record<string, string> = {};
      if (!data.startDate) stepErrors.startDate = "Start date is required.";
      if (!data.endDate) stepErrors.endDate = "End date is required.";
      if (data.startDate && data.endDate && data.startDate > data.endDate) {
        stepErrors.endDate = "End date must be after start date.";
      }
      setStepErrors(fields, stepErrors);
      return Object.keys(stepErrors).length === 0;
    }
    default:
      return true;
  }
};

  const onNext = () => {
  if (!validateCurrentStep()) {
    addToast({
      title: "Validation required",
      description: "Resolve highlighted fields before continuing.",
      variant: "error",
    });
    return;
  }
  if (isLastStep) {
    setSubmitted(true);
    console.info("Prepared order DTO", state.data);
    addToast({
      title: "Order prepared",
      description: "Replace mocked submission with POST /orders when ready.",
      variant: "success",
    });
  } else {
    dispatch({ type: "NEXT_STEP" });
  }
  };

  const onBack = () => {
    if (state.currentStep === 0) {
      router.push("/orders");
    } else {
      dispatch({ type: "PREV_STEP" });
    }
  };

  const SummaryRow = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number | null;
  }) => (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">
        {value ?? "—"}
      </span>
    </div>
  );

  const renderStep = () => {
    switch (currentStepId) {
      case "participants":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="customer" requiredMarker>
                Customer
              </Label>
              <Select
                id="customer"
                value={state.data.customer ?? ""}
                onChange={(event) => setField("customer", event.target.value)}
              >
                <option value="" disabled>
                  Select customer
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Select>
              <MutedText>
                Customers pulled from `GET /users?role=CUSTOMER`.
              </MutedText>
              {errors.customer && (
                <BodyText className="text-xs text-red-500">
                  {errors.customer}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cutter" requiredMarker>
                Cutter
              </Label>
              <Select
                id="cutter"
                value={state.data.cutter ?? ""}
                onChange={(event) => setField("cutter", event.target.value)}
              >
                <option value="" disabled>
                  Select cutter
                </option>
                {cutters.map((cutter) => (
                  <option key={cutter.id} value={cutter.id}>
                    {cutter.name}
                  </option>
                ))}
              </Select>
              <MutedText>
                Staff data comes from the same endpoint with `role=CUTTER`.
              </MutedText>
              {errors.cutter && (
                <BodyText className="text-xs text-red-500">
                  {errors.cutter}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional notes about the order requirements"
                value={state.data.description ?? ""}
                onChange={(event) => setField("description", event.target.value)}
              />
            </div>
          </div>
        );
      case "mirror":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="mirror" requiredMarker>
                Mirror Template
              </Label>
              <Select
                id="mirror"
                value={state.data.mirror ?? ""}
                onChange={(event) => handleMirrorSelection(event.target.value)}
              >
                <option value="" disabled>
                  Select mirror
                </option>
                {mirrors.map((mirror) => (
                  <option key={mirror.id} value={mirror.id}>
                    {mirror.name}
                  </option>
                ))}
              </Select>
              <MutedText>
                Mirrors fetched via `GET /mirrors`. Selecting one pre-fills default features.
              </MutedText>
              {errors.mirror && (
                <BodyText className="text-xs text-red-500">
                  {errors.mirror}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="frame" requiredMarker>
                Frame
              </Label>
              <Select
                id="frame"
                value={state.data.frame ?? ""}
                onChange={(event) => setField("frame", event.target.value)}
              >
                <option value="" disabled>
                  Select frame
                </option>
                {frameOptions.map((frame) => (
                  <option key={frame.id} value={frame.id}>
                    {frame.name}
                  </option>
                ))}
              </Select>
              {errors.frame && (
                <BodyText className="text-xs text-red-500">
                  {errors.frame}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lightThread" requiredMarker>
                Light Thread
              </Label>
              <Select
                id="lightThread"
                value={state.data.lightThread ?? ""}
                onChange={(event) => setField("lightThread", event.target.value)}
              >
                <option value="" disabled>
                  Select light thread
                </option>
                {lightThreadOptions.map((thread) => (
                  <option key={thread.id} value={thread.id}>
                    {thread.name}
                  </option>
                ))}
              </Select>
              {errors.lightThread && (
                <BodyText className="text-xs text-red-500">
                  {errors.lightThread}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="backLight">Back Light</Label>
              <Select
                id="backLight"
                value={state.data.backLight ?? ""}
                onChange={(event) => setField("backLight", event.target.value)}
              >
                <option value="">None</option>
                {backLightOptions.map((backLight) => (
                  <option key={backLight.id} value={backLight.id}>
                    {backLight.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="zoom">Zoom</Label>
              <Select
                id="zoom"
                value={state.data.zoom ?? ""}
                onChange={(event) => setField("zoom", event.target.value)}
              >
                <option value="">None</option>
                {zoomOptions.map((zoom) => (
                  <option key={zoom.id} value={zoom.id}>
                    {zoom.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sandblast">Sandblast</Label>
              <Select
                id="sandblast"
                value={state.data.sandblast ?? ""}
                onChange={(event) => setField("sandblast", event.target.value)}
              >
                <option value="">None</option>
                {sandblastOptions.map((sandblast) => (
                  <option key={sandblast.id} value={sandblast.id}>
                    {sandblast.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="thickness" requiredMarker>
                Thickness
              </Label>
              <Select
                id="thickness"
                value={state.data.thickness ?? ""}
                onChange={(event) => setField("thickness", event.target.value)}
              >
                <option value="" disabled>
                  Select thickness
                </option>
                {thicknessOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </Select>
              {errors.thickness && (
                <BodyText className="text-xs text-red-500">
                  {errors.thickness}
                </BodyText>
              )}
            </div>
            <div className="md:col-span-2">
              <Label>Mirror Modules</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {moduleOptions.map((module) => {
                  const isActive = state.data.mirrorModule.includes(module.id);
                  return (
                    <Button
                      key={module.id}
                      variant={isActive ? "primary" : "subtle"}
                      size="sm"
                      type="button"
                      onClick={() =>
                        dispatch({ type: "TOGGLE_MODULE", payload: module.id })
                      }
                    >
                      {module.name}
                    </Button>
                  );
                })}
              </div>
              <MutedText className="mt-2">
                Toggle modules to add or remove values passed in `mirrorModule[]`.
              </MutedText>
            </div>
          </div>
        );
      case "dimensions":
        return (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="count" requiredMarker>
                Quantity
              </Label>
              <Input
                id="count"
                type="number"
                min={1}
                value={state.data.count ?? ""}
                onChange={(event) => setField("count", Number(event.target.value))}
                placeholder="2"
              />
              {errors.count && (
                <BodyText className="text-xs text-red-500">
                  {errors.count}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="height" requiredMarker>
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                min={1}
                value={state.data.height ?? ""}
                onChange={(event) => setField("height", Number(event.target.value))}
                placeholder="120"
              />
              {errors.height && (
                <BodyText className="text-xs text-red-500">
                  {errors.height}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="width" requiredMarker>
                Width (cm)
              </Label>
              <Input
                id="width"
                type="number"
                min={1}
                value={state.data.width ?? ""}
                onChange={(event) => setField("width", Number(event.target.value))}
                placeholder="80"
              />
              {errors.width && (
                <BodyText className="text-xs text-red-500">
                  {errors.width}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cornerBend">Corner Bend (mm)</Label>
              <Input
                id="cornerBend"
                type="number"
                min={0}
                value={state.data.cornerBend ?? ""}
                onChange={(event) =>
                  setField("cornerBend", Number(event.target.value))
                }
                placeholder="4"
              />
            </div>
          </div>
        );
      case "schedule":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="startDate" requiredMarker>
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={state.data.startDate ?? ""}
                onChange={(event) => setField("startDate", event.target.value)}
              />
              {errors.startDate && (
                <BodyText className="text-xs text-red-500">
                  {errors.startDate}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="endDate" requiredMarker>
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={state.data.endDate ?? ""}
                onChange={(event) => setField("endDate", event.target.value)}
              />
              {errors.endDate && (
                <BodyText className="text-xs text-red-500">
                  {errors.endDate}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="status" requiredMarker>
                Initial Status
              </Label>
              <Select
                id="status"
                value={state.data.status}
                onChange={(event) => setField("status", event.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        );
      case "review":
        const selectedMirror = mirrors.find((mirror) => mirror.id === state.data.mirror);
        const selectedCustomer = customers.find((customer) => customer.id === state.data.customer);
        const selectedCutter = cutters.find((cutter) => cutter.id === state.data.cutter);
        const selectedFrame = frameOptions.find((frame) => frame.id === state.data.frame);
        const selectedLightThread = lightThreadOptions.find((item) => item.id === state.data.lightThread);
        const selectedBackLight = backLightOptions.find((item) => item.id === state.data.backLight);
        const selectedZoom = zoomOptions.find((item) => item.id === state.data.zoom);
        const selectedSandblast = sandblastOptions.find((item) => item.id === state.data.sandblast);
        const selectedThickness = thicknessOptions.find((item) => item.id === state.data.thickness);

        return (
          <div className="grid gap-4">
            <div className="rounded-lg border border-border bg-layer p-4">
              <SectionTitle as="h3">Summary</SectionTitle>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <SummaryRow label="Customer" value={selectedCustomer?.name} />
                <SummaryRow label="Cutter" value={selectedCutter?.name} />
                <SummaryRow label="Mirror" value={selectedMirror?.name} />
                <SummaryRow label="Frame" value={selectedFrame?.name} />
                <SummaryRow label="Light Thread" value={selectedLightThread?.name} />
                <SummaryRow label="Back Light" value={selectedBackLight?.name ?? "None"} />
                <SummaryRow label="Zoom" value={selectedZoom?.name ?? "None"} />
                <SummaryRow label="Sandblast" value={selectedSandblast?.name ?? "None"} />
                <SummaryRow label="Thickness" value={selectedThickness?.name} />
                <SummaryRow label="Modules" value={state.data.mirrorModule.length} />
                <SummaryRow label="Quantity" value={state.data.count} />
                <SummaryRow label="Dimensions" value={`${state.data.height ?? "-"} x ${state.data.width ?? "-"} cm`} />
                <SummaryRow label="Start date" value={state.data.startDate} />
                <SummaryRow label="End date" value={state.data.endDate} />
                <SummaryRow label="Status" value={statusOptions.find((option) => option.value === state.data.status)?.label} />
              </div>
            </div>
            <div>
              <SectionTitle as="h3">Prepared Order DTO</SectionTitle>
              <MutedText>
                Payload will be sent to `POST /orders` via multipart or JSON after wiring mutation logic.
              </MutedText>
              <ExtractedReview data={state.data} />
            </div>
            {submitted && (
              <div className="rounded-md border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
                Draft order prepared. Replace mock submission with actual API call when ready.
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SectionSubtitle>Order Wizard</SectionSubtitle>
        <PageTitle>Create Mirror Order</PageTitle>
        <BodyText className="max-w-2xl">
          Configure customers, mirror templates, features, and schedules before submitting the work order.
          All data is mocked until API integration is added.
        </BodyText>
      </div>

      <WizardStepper
        steps={steps}
        onStepClick={(index) => dispatch({ type: "GO_TO_STEP", payload: index })}
      />

      <Card>
        <CardHeader>
          <CardTitle>{steps[state.currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}

          <div className="flex items-center justify-between border-t border-border pt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={onBack}
            >
              {state.currentStep === 0 ? "Back to Orders" : "Back"}
            </Button>
            <div className="flex items-center gap-3">
              {!isLastStep && (
                <Button
                  type="button"
                  variant="subtle"
                  onClick={() => {
                    dispatch({ type: "RESET" });
                    setErrors({});
                  }}
                >
                  Reset
                </Button>
              )}
              <Button
                type="button"
                variant={isLastStep ? "primary" : "secondary"}
                onClick={onNext}
              >
                {isLastStep ? "Submit Order" : "Continue"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

