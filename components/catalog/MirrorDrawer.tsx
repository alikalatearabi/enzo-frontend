"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MirrorTemplate } from "../../lib/mocks/mirrors";
import { Shape, useMockShapes } from "../../lib/mocks/shapes";
import { useMockFeatureModules } from "../../lib/mocks/features";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CustomSelect } from "../ui/custom-select";
import { Textarea } from "../ui/textarea";
import { BodyText, SectionTitle } from "../ui/typography";
import { useToast } from "../ui/feedback/ToastProvider";
import { toPersianNumber } from "../../lib/utils/numbers";

type MirrorDrawerProps = {
  mode: "create" | "edit";
  mirror?: MirrorTemplate;
  onClose: () => void;
};

export function MirrorDrawer({ mode, mirror, onClose }: MirrorDrawerProps) {
  const { data: shapes } = useMockShapes();
  const { data: features } = useMockFeatureModules();
  const { addToast } = useToast();
  const [name, setName] = useState(mirror?.name ?? "");
  const [shapeId, setShapeId] = useState(mirror?.shape ?? shapes[0]?.id ?? "");
  const [description, setDescription] = useState(mirror?.features ? "Prefilled features on load" : "");
  const [frame, setFrame] = useState(mirror?.features.frame ?? "");
  const [lightThread, setLightThread] = useState(mirror?.features.lightThread ?? "");
  const [backLight, setBackLight] = useState(mirror?.features.backLight ?? "");
  const [price, setPrice] = useState<number>(mirror?.price ?? 0);
  const [defaultHeight, setDefaultHeight] = useState<number>(mirror?.defaultHeight ?? 120);
  const [defaultWidth, setDefaultWidth] = useState<number>(mirror?.defaultWidth ?? 80);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mirror) {
      setName(mirror.name);
      setShapeId(mirror.shape);
      setFrame(mirror.features.frame ?? "");
      setLightThread(mirror.features.lightThread ?? "");
      setBackLight(mirror.features.backLight ?? "");
      setDefaultHeight(mirror.defaultHeight);
      setDefaultWidth(mirror.defaultWidth);
      setPrice(mirror.price ?? 0);
      setErrors({});
    }
  }, [mirror]);

  const frameOptions = features.filter((feature) => feature.type === "frame");
  const lightThreadOptions = features.filter((feature) => feature.type === "lightThread");
  const backLightOptions = features.filter((feature) => feature.type === "backLight");

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const isDirty = useMemo(() => {
    if (!mirror) return true;
    return (
      mirror.name !== name ||
      mirror.shape !== shapeId ||
      (mirror.features.frame ?? "") !== frame ||
      (mirror.features.lightThread ?? "") !== lightThread ||
      (mirror.features.backLight ?? "") !== backLight ||
      (mirror.price ?? 0) !== price ||
      mirror.defaultHeight !== defaultHeight ||
      mirror.defaultWidth !== defaultWidth ||
      description.trim().length > 0
    );
  }, [
    mirror,
    name,
    shapeId,
    frame,
    lightThread,
    backLight,
    price,
    defaultHeight,
    defaultWidth,
    description,
  ]);

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) {
      nextErrors.name = "نام آینه الزامی است.";
    }
    if (!shapeId) {
      nextErrors.shape = "انتخاب شکل الزامی است.";
    }
    if (!frame) {
      nextErrors.frame = "انتخاب قاب الزامی است.";
    }
    if (!lightThread) {
      nextErrors.lightThread = "انتخاب نخ نوری الزامی است.";
    }
    if (defaultHeight <= 0) {
      nextErrors.height = "ارتفاع باید بیشتر از صفر باشد.";
    }
    if (defaultWidth <= 0) {
      nextErrors.width = "عرض باید بیشتر از صفر باشد.";
    }
    if (price < 0) {
      nextErrors.price = "قیمت نمی‌تواند منفی باشد.";
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
      title: mode === "create" ? "آینه ایجاد شد" : "آینه به‌روزرسانی شد",
      description: "پس از آماده شدن بک‌اند، با POST/PUT /mirrors ادغام کنید.",
      variant: "success",
    });
    onClose();
  };

  const getShapeName = (shapeId: string) =>
    shapes.find((shape) => shape.id === shapeId)?.name ?? "نامشخص";

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
              {mode === "create" ? "ایجاد قالب آینه" : "ویرایش قالب آینه"}
            </SectionTitle>
            <BodyText>
              فیلدها مطابق DTO فرم داده چند بخشی هستند. آپلود رسانه بعداً اضافه خواهد شد.
            </BodyText>
          </div>
          <Button variant="ghost" onClick={onClose}>
            بستن
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="mirror-name" requiredMarker>
              نام
            </Label>
            <Input
              id="mirror-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearFieldError("name");
              }}
              placeholder="آینه بیضی لوکس"
            />
            {errors.name && (
              <BodyText className="text-xs text-red-500">{errors.name}</BodyText>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="mirror-shape" requiredMarker>
              شکل
            </Label>
            <CustomSelect
              value={shapeId}
              onChange={(value) => {
                setShapeId(value);
                clearFieldError("shape");
              }}
              options={shapes.map((shape: Shape) => ({
                value: shape.id,
                label: `${shape.name}${shape.deformed ? " (بدشکل)" : ""}`,
              }))}
              placeholder="انتخاب شکل"
            />
            <BodyText className="text-xs">
              انتخاب شده: {getShapeName(shapeId)}
            </BodyText>
            {errors.shape && (
              <BodyText className="text-xs text-red-500">
                {errors.shape}
              </BodyText>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="mirror-height" requiredMarker>
                ارتفاع پیش‌فرض (سانتی‌متر)
              </Label>
              <Input
                id="mirror-height"
                type="number"
                value={defaultHeight}
              onChange={(event) => {
                setDefaultHeight(Number(event.target.value));
                clearFieldError("height");
              }}
              />
              {errors.height && (
                <BodyText className="text-xs text-red-500">
                  {errors.height}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mirror-width" requiredMarker>
                عرض پیش‌فرض (سانتی‌متر)
              </Label>
              <Input
                id="mirror-width"
                type="number"
                value={defaultWidth}
              onChange={(event) => {
                setDefaultWidth(Number(event.target.value));
                clearFieldError("width");
              }}
              />
              {errors.width && (
                <BodyText className="text-xs text-red-500">
                  {errors.width}
                </BodyText>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="mirror-price">قیمت مرجع ($)</Label>
            <Input
              id="mirror-price"
              type="number"
              value={price}
              onChange={(event) => {
                setPrice(Number(event.target.value));
                clearFieldError("price");
              }}
            />
            {errors.price && (
              <BodyText className="text-xs text-red-500">{errors.price}</BodyText>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="mirror-frame" requiredMarker>
                قاب پیش‌فرض
              </Label>
              <CustomSelect
                value={frame}
                onChange={(value) => {
                  setFrame(value);
                clearFieldError("frame");
              }}
                options={[
                  { value: "", label: "انتخاب قاب" },
                  ...frameOptions.map((option) => ({
                    value: option.id,
                    label: option.name,
                  })),
                ]}
                placeholder="انتخاب قاب"
              />
              {errors.frame && (
                <BodyText className="text-xs text-red-500">
                  {errors.frame}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mirror-lightThread" requiredMarker>
                نخ نوری پیش‌فرض
              </Label>
              <CustomSelect
                value={lightThread}
                onChange={(value) => {
                  setLightThread(value);
                clearFieldError("lightThread");
              }}
                options={[
                  { value: "", label: "انتخاب نخ نوری" },
                  ...lightThreadOptions.map((option) => ({
                    value: option.id,
                    label: option.name,
                  })),
                ]}
                placeholder="انتخاب نخ نوری"
              />
              {errors.lightThread && (
                <BodyText className="text-xs text-red-500">
                  {errors.lightThread}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mirror-backLight">نور پس‌زمینه پیش‌فرض</Label>
              <CustomSelect
                value={backLight}
                onChange={(value) => setBackLight(value)}
                options={[
                  { value: "", label: "هیچکدام" },
                  ...backLightOptions.map((option) => ({
                    value: option.id,
                    label: option.name,
                  })),
                ]}
                placeholder="هیچکدام"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="mirror-description">یادداشت‌های داخلی</Label>
            <Textarea
              id="mirror-description"
              placeholder="توضیحات اختیاری برای اپراتورها."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
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
            disabled={!isDirty}
          >
            {mode === "create" ? "ایجاد آینه" : "ذخیره تغییرات"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

