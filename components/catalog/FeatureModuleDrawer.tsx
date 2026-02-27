"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { FeatureModule } from "../../lib/api/features";
import type { Logo, LogoPositionValue } from "../../lib/api/logo";
import { LogoPosition } from "../../lib/api/logo";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CustomSelect } from "../ui/custom-select";
import { Textarea } from "../ui/textarea";
import { BodyText, SectionTitle } from "../ui/typography";
import { useToast } from "../ui/feedback/ToastProvider";

export type FeatureModuleSubmitPayload = {
  kind: "feature";
  name: string;
  type: FeatureModule["type"];
  code?: string;
  layerCount?: number;
  notes?: string;
};

export type LogoSubmitPayload = {
  kind: "logo";
  logoType: string;
  active: boolean;
  position: LogoPositionValue;
};

export type CatalogItemSubmitPayload = FeatureModuleSubmitPayload | LogoSubmitPayload;

type FeatureModuleDrawerProps = {
  mode: "create" | "edit";
  feature?: FeatureModule;
  logo?: Logo;
  onClose: () => void;
  onSubmit: (payload: CatalogItemSubmitPayload) => Promise<void>;
  existingModules: FeatureModule[];
  existingLogos?: Logo[];
  isLoading?: boolean;
};

const typeOptions = [
  { value: "frame", label: "قاب" },
  { value: "lightThread", label: "نخ نوری" },
  { value: "backLight", label: "نور پس‌زمینه" },
  { value: "zoom", label: "زوم" },
  { value: "thickness", label: "ضخامت" },
  { value: "sandblast", label: "سندبلاست" },
  { value: "lol", label: "LOL" },
  { value: "logo", label: "لوگو" },
];

const positionOptions: { value: LogoPositionValue; label: string }[] = [
  { value: LogoPosition.TOP_LEFT, label: "بالا چپ" },
  { value: LogoPosition.TOP_CENTER, label: "بالا وسط" },
  { value: LogoPosition.TOP_RIGHT, label: "بالا راست" },
  { value: LogoPosition.CENTER_LEFT, label: "وسط چپ" },
  { value: LogoPosition.CENTER, label: "وسط" },
  { value: LogoPosition.CENTER_RIGHT, label: "وسط راست" },
  { value: LogoPosition.BOTTOM_LEFT, label: "پایین چپ" },
  { value: LogoPosition.BOTTOM_CENTER, label: "پایین وسط" },
  { value: LogoPosition.BOTTOM_RIGHT, label: "پایین راست" },
];

export function FeatureModuleDrawer({
  mode,
  feature,
  logo,
  onClose,
  onSubmit,
  existingModules,
  existingLogos = [],
  isLoading = false,
}: FeatureModuleDrawerProps) {
  const { addToast } = useToast();
  const [name, setName] = useState(feature?.name ?? "");
  const [type, setType] = useState<string>(feature?.type ?? logo ? "logo" : "frame");
  const [code, setCode] = useState(feature?.code ?? "");
  const [layerCount, setLayerCount] = useState(feature?.layerCount ?? 1);
  const [notes, setNotes] = useState(feature?.notes ?? "");
  const [logoType, setLogoType] = useState(logo?.logoType ?? "ENZO");
  const [active, setActive] = useState(logo?.active ?? false);
  const [position, setPosition] = useState<LogoPositionValue>(
    logo?.position ?? LogoPosition.CENTER,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLogo = type === "logo";

  useEffect(() => {
    if (feature) {
      setName(feature.name);
      setType(feature.type);
      setCode(feature.code ?? "");
      setLayerCount(feature.layerCount ?? 1);
      setNotes(feature.notes ?? "");
      setErrors({});
    }
  }, [feature]);

  useEffect(() => {
    if (logo) {
      setType("logo");
      setLogoType(logo.logoType);
      setActive(logo.active);
      setPosition(logo.position);
      setErrors({});
    }
  }, [logo]);

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const isDirty = useMemo(() => {
    if (logo) {
      return (
        logo.logoType !== logoType ||
        logo.active !== active ||
        logo.position !== position
      );
    }
    if (!feature) return true;
    return (
      feature.name !== name ||
      feature.type !== type ||
      (feature.code ?? "") !== code ||
      (feature.layerCount ?? 1) !== layerCount ||
      (feature.notes ?? "") !== notes
    );
  }, [feature, logo, name, type, code, layerCount, notes, logoType, active, position]);

  const handleSubmit = async () => {
    if (isLogo) {
      const nextErrors: Record<string, string> = {};
      if (!logoType.trim()) {
        nextErrors.logoType = "نوع لوگو الزامی است.";
      }
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        addToast({
          title: "اعتبارسنجی ناموفق",
          description: "لطفاً فیلدهای برجسته شده را پر کنید.",
          variant: "error",
        });
        return;
      }
      setErrors({});
      await onSubmit({
        kind: "logo",
        logoType: logoType.trim() || "ENZO",
        active,
        position,
      });
      return;
    }

    const nextErrors: Record<string, string> = {};
    if (!name.trim()) {
      nextErrors.name = "نام ویژگی الزامی است.";
    }
    if (!type) {
      nextErrors.type = "نوع الزامی است.";
    }
    if (layerCount <= 0) {
      nextErrors.layerCount = "تعداد لایه باید بیشتر از صفر باشد.";
    }
    const duplicate = existingModules.some(
      (module) =>
        module.name.toLowerCase() === name.toLowerCase() &&
        module.id !== feature?.id,
    );
    if (duplicate) {
      addToast({
        title: "نام تکراری",
        description: "ماژول ویژگی دیگری با این نام وجود دارد.",
        variant: "error",
      });
      return;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      addToast({
        title: "اعتبارسنجی ناموفق",
        description: "لطفاً مشکلات برجسته شده را قبل از ارسال برطرف کنید.",
        variant: "error",
      });
      return;
    }
    setErrors({});
    await onSubmit({
      kind: "feature",
      name,
      type: type as FeatureModule["type"],
      code,
      layerCount,
      notes,
    });
  };

  const title =
    mode === "create"
      ? isLogo
        ? "افزودن لوگو"
        : "افزودن ماژول ویژگی"
      : isLogo
        ? "ویرایش لوگو"
        : "ویرایش ماژول ویژگی";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 flex items-stretch justify-start bg-black/40"
      dir="rtl"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex h-full w-full max-w-xl flex-col gap-6 overflow-y-auto bg-layer p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <SectionTitle as="h3">{title}</SectionTitle>
          </div>
          <Button variant="ghost" onClick={onClose}>
            بستن
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="catalog-type" requiredMarker>
              نوع
            </Label>
            <CustomSelect
              value={type}
              onChange={(value) => {
                setType(value);
                clearFieldError("type");
              }}
              options={typeOptions}
              disabled={mode === "edit"}
            />
            {mode === "edit" && (feature || logo) && (
              <BodyText className="text-xs text-muted-foreground">
                در حالت ویرایش نوع قابل تغییر نیست.
              </BodyText>
            )}
            {errors.type && (
              <BodyText className="text-xs text-red-500">{errors.type}</BodyText>
            )}
          </div>

          {isLogo ? (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="logo-type" requiredMarker>
                  نوع لوگو
                </Label>
                <Input
                  id="logo-type"
                  value={logoType}
                  onChange={(e) => {
                    setLogoType(e.target.value);
                    clearFieldError("logoType");
                  }}
                  placeholder="مثال: ENZO"
                />
                {errors.logoType && (
                  <BodyText className="text-xs text-red-500">
                    {errors.logoType}
                  </BodyText>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="logo-active">فعال</Label>
                <CustomSelect
                  value={active ? "true" : "false"}
                  onChange={(value) => setActive(value === "true")}
                  options={[
                    { value: "true", label: "بله" },
                    { value: "false", label: "خیر" },
                  ]}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="logo-position">موقعیت</Label>
                <CustomSelect
                  value={position}
                  onChange={(value) =>
                    setPosition(value as LogoPositionValue)
                  }
                  options={positionOptions}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="feature-name" requiredMarker>
                  نام
                </Label>
                <Input
                  id="feature-name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    clearFieldError("name");
                  }}
                  placeholder="قاب لبه کربن"
                  disabled={mode === "edit" && !!logo}
                />
                {errors.name && (
                  <BodyText className="text-xs text-red-500">
                    {errors.name}
                  </BodyText>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="feature-code">کد (اختیاری)</Label>
                  <Input
                    id="feature-code"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="SB-FT-001"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="feature-layerCount">تعداد لایه</Label>
                  <Input
                    id="feature-layerCount"
                    type="number"
                    min={1}
                    value={layerCount}
                    onChange={(event) => {
                      setLayerCount(Number(event.target.value));
                      clearFieldError("layerCount");
                    }}
                  />
                  {errors.layerCount && (
                    <BodyText className="text-xs text-red-500">
                      {errors.layerCount}
                    </BodyText>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="feature-notes">یادداشت‌ها</Label>
                <Textarea
                  id="feature-notes"
                  placeholder="یادداشت‌های داخلی و وابستگی‌ها."
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-start gap-3 border-t border-border pt-4">
          <Button variant="ghost" onClick={onClose}>
            لغو
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isDirty || isLoading}
            isLoading={isLoading}
          >
            {mode === "create"
              ? isLogo
                ? "ایجاد لوگو"
                : "ایجاد ماژول ویژگی"
              : "ذخیره تغییرات"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
