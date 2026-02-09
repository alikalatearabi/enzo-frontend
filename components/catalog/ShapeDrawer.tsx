"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Shape } from "../../lib/mocks/shapes";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { BodyText, SectionTitle } from "../ui/typography";
import { useToast } from "../ui/feedback/ToastProvider";

type ShapeDrawerProps = {
  mode: "create" | "edit";
  shape?: Shape;
  onClose: () => void;
};

export function ShapeDrawer({ mode, shape, onClose }: ShapeDrawerProps) {
  const { addToast } = useToast();
  const [name, setName] = useState(shape?.name ?? "");
  const [deformed, setDeformed] = useState(shape?.deformed ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (shape) {
      setName(shape.name);
      setDeformed(shape.deformed);
      setErrors({});
    }
  }, [shape]);

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const isDirty = useMemo(() => {
    if (!shape) return true;
    return shape.name !== name || shape.deformed !== deformed;
  }, [shape, name, deformed]);

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) {
      nextErrors.name = "نام شکل الزامی است.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      addToast({
        title: "اعتبارسنجی ناموفق",
        description: "لطفاً فیلدهای مشخص شده را قبل از ذخیره بررسی کنید.",
        variant: "error",
      });
      return;
    }
    setErrors({});
    addToast({
      title: mode === "create" ? "شکل ایجاد شد" : "شکل به‌روزرسانی شد",
      description: mode === "create"
        ? "شکل جدید با موفقیت ایجاد شد."
        : "تغییرات با موفقیت ذخیره شد.",
      variant: "success",
    });
    onClose();
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
              {mode === "create" ? "ایجاد شکل" : "ویرایش شکل"}
            </SectionTitle>
            <BodyText>
              فیلدها مطابق DTO بک‌اند هستند. نام و وضعیت بدشکل الزامی هستند.
            </BodyText>
          </div>
          <Button variant="ghost" onClick={onClose}>
            بستن
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="shape-name" requiredMarker>
              نام
            </Label>
            <Input
              id="shape-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearFieldError("name");
              }}
              placeholder="مستطیل کلاسیک"
            />
            {errors.name && (
              <BodyText className="text-xs text-red-500">{errors.name}</BodyText>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <input
                id="shape-deformed"
                type="checkbox"
                checked={deformed}
                onChange={(event) => setDeformed(event.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
              />
              <Label htmlFor="shape-deformed" className="cursor-pointer">
                بدشکل
              </Label>
            </div>
            <BodyText className="text-xs text-muted-foreground">
              اگر این شکل دارای انحراف یا تغییر شکل است، این گزینه را فعال کنید.
            </BodyText>
          </div>
        </div>

        <div className="flex justify-start gap-3 border-t border-border pt-4">
          <Button variant="ghost" onClick={onClose}>
            لغو
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isDirty}
          >
            {mode === "create" ? "ایجاد شکل" : "ذخیره تغییرات"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}



