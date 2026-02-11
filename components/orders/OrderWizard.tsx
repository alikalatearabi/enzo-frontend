"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  PageTitle,
} from "../ui/typography";
import { WizardStepper } from "./WizardStepper";
import { useToast } from "../ui/feedback/ToastProvider";
import {
  useOrderWizard,
  OrderWizardData,
  OrderWizardStepId,
} from "../../hooks/orders/useOrderWizard";
import { useUsers } from "../../hooks/api/useUsers";
import { useMirrors } from "../../hooks/api/useMirrors";
import { useFeatureModules } from "../../hooks/api/useFeatureModules";
import { useCreateOrder, useUpdateOrder } from "../../hooks/api/useOrders";
import {
  ParticipantsStep,
  MirrorStep,
  FrameStep,
  SandblastStep,
  MirrorComponentsStep,
  ScheduleStep,
  ReviewStep,
} from "./OrderWizardSteps";
import { validateStep } from "./OrderWizardSteps/utils";

type OrderWizardProps = {
  initialData?: Partial<OrderWizardData>;
  orderId?: string | null;
};

export function OrderWizard({ initialData, orderId }: OrderWizardProps = {}) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, dispatch, steps, isLastStep } = useOrderWizard(initialData);
  const { data: customers = [] } = useUsers("CUSTOMER");
  const { data: cutters = [] } = useUsers("CUTTER");
  const { data: mirrorsRaw = [] } = useMirrors();
  const { data: featureModules = [] } = useFeatureModules();
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
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
  // Mirror modules are not yet available on the backend,
  // so keep this list empty for now.
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
      !data.customer ||
      !data.cutter ||
      !data.mirror ||
      !data.frame ||
      !data.lightThread ||
      !data.backLight ||
      !data.zoom ||
      !data.sandblast ||
      !data.thickness ||
      !data.count ||
      !data.height ||
      !data.width ||
      !data.startDate ||
      !data.endDate
    ) {
      throw new Error("برخی فیلدهای الزامی در ویزارد خالی هستند.");
    }

    const timestamp = Date.now();
    const workOrder = `WO-${timestamp}`;
    const invoiceID = `INV-${timestamp}`;

    return {
      workOrder,
      description: data.description ?? "",
      count: data.count,
      mirror: data.mirror,
      backLight: data.backLight,
      lol: data.mirror, // TODO: map to real LOL once available in UI
      height: data.height,
      width: data.width,
      thickness: data.thickness,
      mirrorModule: data.mirrorModule,
      zoom: data.zoom,
      sandblast: data.sandblast,
      frame: data.frame,
      lightThread: data.lightThread,
      cornerBend: data.cornerBend,
      customer: data.customer,
      cutter: data.cutter,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      invoiceID,
    };
  };

  const buildUpdatePayload = (data: OrderWizardData) => {
    // For now, send full payload for simplicity; backend will treat missing fields as unchanged
    const base = buildCreatePayload(data);
    return base;
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
      } else {
        const payload = buildCreatePayload(state.data);
        await createOrder.mutateAsync(payload);
      }

      addToast({
        title: "سفارش ثبت شد",
        description: "سفارش با موفقیت در سیستم ذخیره شد.",
        variant: "success",
      });
      router.push("/orders");
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
      router.push("/orders");
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
      case "participants":
        return (
          <ParticipantsStep
            {...stepProps}
            customers={customers}
            cutters={cutters}
          />
        );
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
        const selectedCustomer = customers.find((customer) => customer._id === state.data.customer);
        const selectedCutter = cutters.find((cutter) => cutter._id === state.data.cutter);
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
            selectedCustomer={selectedCustomer}
            selectedCutter={selectedCutter}
            selectedFrame={selectedFrame}
            selectedLightThread={selectedLightThread}
            selectedBackLight={selectedBackLight}
            selectedZoom={selectedZoom}
            selectedSandblast={selectedSandblast}
            selectedThickness={selectedThickness}
            submitted={submitted}
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
              <ChevronRight className="ml-2 h-4 w-4"  style={{ transform: 'translateY(2px)'}} />
              {state.currentStep === 0 ? "بازگشت به سفارش‌ها" : "قبلی"}
            </Button>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant={isLastStep ? "primary" : "secondary"}
                onClick={onNext}
                className={`h-11 px-6 text-sm font-semibold transition-all shadow-sm ${
                  isLastStep
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
                    : "hover:shadow-md"
                }`}
              >
                {isLastStep ? "ارسال سفارش" : "ادامه"}
                {!isLastStep && <ChevronLeft className="mr-2 h-4 w-4" style={{ transform: 'translateY(2px)'}} />}
                {isLastStep && <Check className="mr-2 h-4 w-4"  style={{ transform: 'translateY(2px)'}}/>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
