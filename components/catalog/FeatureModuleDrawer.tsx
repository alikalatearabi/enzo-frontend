"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { FeatureModule } from "../../lib/api/features";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CustomSelect } from "../ui/custom-select";
import { Textarea } from "../ui/textarea";
import { BodyText, SectionTitle } from "../ui/typography";
import { useToast } from "../ui/feedback/ToastProvider";

type FeatureModuleDrawerProps = {
  mode: "create" | "edit";
  feature?: FeatureModule;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    type: FeatureModule["type"];
    code?: string;
    layerCount?: number;
    notes?: string;
  }) => Promise<void>;
  existingModules: FeatureModule[];
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
];

export function FeatureModuleDrawer({
  mode,
  feature,
  onClose,
  onSubmit,
  existingModules,
  isLoading = false,
}: FeatureModuleDrawerProps) {
  const { addToast } = useToast();
  const [name, setName] = useState(feature?.name ?? "");
  const [type, setType] = useState(feature?.type ?? "frame");
  const [code, setCode] = useState(feature?.code ?? "");
  const [layerCount, setLayerCount] = useState(feature?.layerCount ?? 1);
  const [notes, setNotes] = useState(feature?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const isDirty = useMemo(() => {
    if (!feature) return true;
    return (
      feature.name !== name ||
      feature.type !== type ||
      (feature.code ?? "") !== code ||
      (feature.layerCount ?? 1) !== layerCount ||
      (feature.notes ?? "") !== notes
    );
  }, [feature, name, type, code, layerCount, notes]);

  const handleSubmit = async () => {
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
      name,
      type: type as FeatureModule["type"],
      code,
      layerCount,
      notes,
    });
  };

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
            <SectionTitle as="h3">
              {mode === "create" ? "افزودن ماژول ویژگی" : "ویرایش ماژول ویژگی"}
            </SectionTitle>
          </div>
          <Button variant="ghost" onClick={onClose}>
            بستن
          </Button>
        </div>

        <div className="grid gap-4">
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
            />
            {errors.name && (
              <BodyText className="text-xs text-red-500">
                {errors.name}
              </BodyText>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="feature-type" requiredMarker>
              نوع
            </Label>
            <CustomSelect
              value={type}
              onChange={(value) => {
                setType(value as FeatureModule["type"]);
                clearFieldError("type");
              }}
              options={typeOptions}
            />
            <BodyText className="text-xs">
              هر نوع به منبع REST خودش نگاشت می‌شود (frames، lightThreads و غیره).
            </BodyText>
            {errors.type && (
              <BodyText className="text-xs text-red-500">
                {errors.type}
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
            {mode === "create" ? "ایجاد ماژول ویژگی" : "ذخیره تغییرات"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}



