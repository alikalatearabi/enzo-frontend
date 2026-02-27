"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PageTitle } from "../ui/typography";
import { WizardStepper } from "./WizardStepper";
import { useToast } from "../ui/feedback/ToastProvider";
import { useOrderWizard, OrderWizardData, OrderWizardStepId } from "../../hooks/orders/useOrderWizard";
import { useMirrors } from "../../hooks/api/useMirrors";
import { useFeatureModules } from "../../hooks/api/useFeatureModules";
import { useCreateOrder, useUpdateOrder, useAssignOrderToInvoice } from "../../hooks/api/useOrders";
import { MirrorStep, FrameStep, SandblastStep, MirrorComponentsStep, ScheduleStep, ReviewStep, InvoiceStep } from "./OrderWizardSteps";
import { validateStep } from "./OrderWizardSteps/utils";
import { useInvoicesData } from "@/hooks/invoice/useInvoicesData";
import { toEnglishDigits } from "@/lib/utils/numbers";

type OrderWizardProps = {
  initialData?: Partial<OrderWizardData>;
  orderId?: string | null;
  /** When set, we're adding an order to this invoice (no invoice step, assign after create) */
  invoiceId?: string | null;
};

export function OrderWizard({ initialData, orderId, invoiceId }: OrderWizardProps = {}) {

  const router = useRouter();
  const { createInvoice } = useInvoicesData();
  const withInvoiceStep = !invoiceId && !orderId;

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, dispatch, steps, isLastStep, currentStepId } = useOrderWizard(initialData, withInvoiceStep);
  const { data: mirrorsRaw = [] } = useMirrors();
  const { data: featureModules = [] } = useFeatureModules();
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const assignOrderToInvoice = useAssignOrderToInvoice();
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
    console.log("setField", field, value);
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
  const moduleOptions: typeof featureModules = useMemo(() => [], [featureModules]);

  const mirrors = useMemo(
    () =>
      mirrorsRaw.map((mirror) => ({
        id: mirror.id,
        name: mirror.name,
        shapeName: mirror.shape.name,
        price: mirror.price,
        picture: mirror.picture ? { url: mirror.picture } : undefined,
      })),
    [mirrorsRaw],
  );

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
    clearError("mirror");
  };

  const handleToggleModule = (moduleId: string) => {
    dispatch({ type: "TOGGLE_MODULE", payload: moduleId });
  };

  const validateCurrentStep = () => {
    const validation = validateStep(currentStepId, state.data);
    const fields = Object.keys(validation.errors);
    setStepErrors(fields, validation.errors);
    return validation.isValid;
  };

  const buildCreatePayload = (data: OrderWizardData) => {
    if (
      !data.mirror ||
      !data.count ||
      data.count <= 0 ||
      !data.height ||
      !data.width ||
      !data.thickness ||
      !data.sandblast ||
      !data.startDate ||
      !data.endDate ||
      !data.logo?.trim()
    ) {
      throw new Error("برخی فیلدهای الزامی در ویزارد خالی هستند.");
    }

    const timestamp = Date.now();
    const workOrder = `WO-${timestamp}`;

    return {
      workOrder,
      description: data.description ?? "",
      count: data.count,
      mirror: data.mirror,
      lol: data.mirror, // TODO: map to real LOL once available in UI
      height: data.height,
      width: data.width,
      thickness: data.thickness,
      mirrorModule: data.mirrorModule ?? [],
      sandblast: data.sandblast,
      frame: data.frame,
      backLight: data.backLight,
      lightThread: data.lightThread,
      zoom: data.zoom,
      cornerBend: data.cornerBend,
      startDate: toEnglishDigits(data.startDate) || data.startDate,
      endDate: toEnglishDigits(data.endDate) || data.endDate,
      status: data.status,
      logo: data.logo.trim(),
    };
  };

  const buildUpdatePayload = (data: OrderWizardData) => {
    const base = buildCreatePayload(data);
    return {
      ...base,
      code: data.code ?? "",
      price: typeof data.price === "number" ? data.price : 0,
    };
  };

  const onNext = async () => {
    if (!validateCurrentStep()) {
      addToast({
        title: "اعتبارسنجی مورد نیاز",
        description: "لطفاً فیلدهای مشخص شده را قبل از ادامه برطرف کنید.",
        variant: "error",
      });
      return;
    }

    if (!isLastStep) {
      dispatch({ type: "NEXT_STEP" });
      return;
    }

    try {
      setSubmitted(true);

      if (orderId) {
        const payload = buildUpdatePayload(state.data);
        await updateOrder.mutateAsync({ id: orderId, payload });
        addToast({
          title: "سفارش ثبت شد",
          description: "سفارش با موفقیت در سیستم ذخیره شد.",
          variant: "success",
        });
        router.push(invoiceId ? `/invoices/${invoiceId}` : "/invoices");
        return;
      }

      const orderPayload = buildCreatePayload(state.data);

      if (invoiceId) {
        const created = await createOrder.mutateAsync(orderPayload);
        await assignOrderToInvoice.mutateAsync({
          orderId: created.id,
          invoiceId,
        });
        addToast({
          title: "سفارش ثبت شد",
          description: "سفارش به صورت‌حساب اضافه شد.",
          variant: "success",
        });
        router.push(`/invoices/${invoiceId}`);
        return;
      }

      if (state.data.invoiceChoice === "existing" && state.data.selectedExistingInvoiceId) {
        const created = await createOrder.mutateAsync(orderPayload);
        await assignOrderToInvoice.mutateAsync({
          orderId: created.id,
          invoiceId: state.data.selectedExistingInvoiceId,
        });
        addToast({
          title: "سفارش ثبت شد",
          description: "سفارش به صورت‌حساب اضافه شد.",
          variant: "success",
        });
        router.push(`/invoices/${state.data.selectedExistingInvoiceId}`);
        return;
      }

      const invoicePayload = {
        invoiceNumber: String(state.data.invoiceNumber ?? ""),
        customer: state.data.customer?._id ?? "",
        cutter: state.data.cutter?._id ?? "",
      };
      const createdInvoice = await createInvoice(invoicePayload);
      const created = await createOrder.mutateAsync(orderPayload);
      await assignOrderToInvoice.mutateAsync({
        orderId: created.id,
        invoiceId: createdInvoice.id,
      });
      addToast({
        title: "سفارش ثبت شد",
        description: "صورت‌حساب و سفارش با موفقیت ایجاد شد.",
        variant: "success",
      });
      router.push(`/invoices/${createdInvoice.id}`);
    } catch (error) {
      addToast({
        title: "خطا در ثبت سفارش",
        description:
          error instanceof Error
            ? error.message
            : "مشکلی در ثبت سفارش رخ داد.",
        variant: "error",
      });
    }
  };

  const onBack = () => {
    if (state.currentStep === 0) {
      router.push(invoiceId ? `/invoices/${invoiceId}` : "/invoices");
    } else {
      dispatch({ type: "PREV_STEP" });
    }
  };

  const renderStep = () => {
    const stepProps = {
      data: state.data,
      errors,
      setField,
      clearError,
    };

    switch (currentStepId) {
      case "invoice":
        return <InvoiceStep {...stepProps} />;
      case "mirror":
        return (
          <MirrorStep
            {...stepProps}
            mirrors={mirrors}
            onMirrorSelect={handleMirrorSelection}
          />
        );
      case "frame":
        return (
          <FrameStep
            {...stepProps}
            frameOptions={frameOptions}
          />
        );
      case "sandblast":
        return (
          <SandblastStep
            {...stepProps}
            sandblastOptions={sandblastOptions}
          />
        );
      case "mirrorComponents":
        return (
          <MirrorComponentsStep
            {...stepProps}
            lightThreadOptions={lightThreadOptions}
            backLightOptions={backLightOptions}
            zoomOptions={zoomOptions}
            thicknessOptions={thicknessOptions}
            moduleOptions={moduleOptions}
            onToggleModule={handleToggleModule}
          />
        );
      case "schedule":
        return <ScheduleStep {...stepProps} />;
      case "review": {
        const selectedMirror = mirrors.find((mirror) => mirror.id === state.data.mirror);
        const selectedFrame = frameOptions.find((frame) => frame.id === state.data.frame);
        const selectedLightThread = lightThreadOptions.find((item) => item.id === state.data.lightThread);
        const selectedBackLight = backLightOptions.find((item) => item.id === state.data.backLight);
        const selectedZoom = zoomOptions.find((item) => item.id === state.data.zoom);
        const selectedSandblast = sandblastOptions.find((item) => item.id === state.data.sandblast);
        const selectedThickness = thicknessOptions.find((item) => item.id === state.data.thickness);

        return (
          <ReviewStep
            {...stepProps}
            selectedMirror={selectedMirror}
            selectedCustomer={state.data.customer}
            selectedCutter={state.data.cutter}
            selectedFrame={selectedFrame}
            selectedLightThread={selectedLightThread}
            selectedBackLight={selectedBackLight}
            selectedZoom={selectedZoom}
            selectedSandblast={selectedSandblast}
            selectedThickness={selectedThickness}
            invoiceContextLabel={invoiceId ? "این سفارش به صورت‌حساب انتخاب‌شده اضافه می‌شود." : undefined}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <section className="flex flex-1 flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-2">
        <PageTitle>ایجاد سفارش آینه</PageTitle>
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

          <div className="flex items-center justify-between border-t border-border pt-6 mt-6">
            <Button
              variant="ghost"
              type="button"
              onClick={onBack}
              className="h-11 px-6 text-sm font-medium transition-all hover:bg-layer-hover"
            >
              <ChevronRight className="ml-2 h-4 w-4" style={{ transform: 'translateY(2px)' }} />
              {state.currentStep === 0 ? "بازگشت به صورت‌حساب‌ها" : "قبلی"}
            </Button>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant={isLastStep ? "primary" : "secondary"}
                onClick={onNext}
                className={`h-11 px-6 text-sm font-semibold transition-all shadow-sm ${isLastStep
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
                    : "hover:shadow-md"
                  }`}
              >
                {isLastStep ? "ارسال سفارش" : "ادامه"}
                {!isLastStep && <ChevronLeft className="mr-2 h-4 w-4" style={{ transform: 'translateY(2px)' }} />}
                {isLastStep && <Check className="mr-2 h-4 w-4" style={{ transform: 'translateY(2px)' }} />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
