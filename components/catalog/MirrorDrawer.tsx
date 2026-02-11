"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Mirror } from "../../lib/api/mirrors";
import { useShapes } from "../../hooks/api/useShapes";
import { useCreateMirror, useUpdateMirror } from "../../hooks/api/useMirrors";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CustomSelect } from "../ui/custom-select";
import { BodyText, SectionTitle } from "../ui/typography";
import { useToast } from "../ui/feedback/ToastProvider";

type MirrorDrawerProps = {
  mode: "create" | "edit";
  mirror?: Mirror;
  onClose: () => void;
};

export function MirrorDrawer({ mode, mirror, onClose }: MirrorDrawerProps) {
  const { data: shapes = [], isLoading: shapesLoading } = useShapes();
  const { addToast } = useToast();
  const createMirror = useCreateMirror();
  const updateMirror = useUpdateMirror();
  const [name, setName] = useState(mirror?.name ?? "");
  const [shapeId, setShapeId] = useState(mirror?.shape.id ?? shapes[0]?.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(
    mirror?.picture ?? null,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mirror) {
      setName(mirror.name);
      setShapeId(mirror.shape.id);
      setFilePreview(mirror.picture || null);
      setFile(null);
      setErrors({});
    } else {
      setName("");
      setShapeId(shapes[0]?.id ?? "");
      setFile(null);
      setFilePreview(null);
      setErrors({});
    }
  }, [mirror, shapes]);

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      clearFieldError("file");
    }
  };

  const isDirty = useMemo(() => {
    if (!mirror) return true;
    return (
      mirror.name !== name ||
      mirror.shape.id !== shapeId ||
      file !== null
    );
  }, [mirror, name, shapeId, file]);

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) {
      nextErrors.name = "نام آینه الزامی است.";
    }
    if (!shapeId) {
      nextErrors.shape = "انتخاب شکل الزامی است.";
    }
    if (mode === "create" && !file) {
      nextErrors.file = "آپلود تصویر الزامی است.";
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

    try {
      if (mode === "create") {
        if (!file) {
          addToast({
            title: "خطا",
            description: "آپلود تصویر الزامی است.",
            variant: "error",
          });
          return;
        }
        await createMirror.mutateAsync({
          name: name.trim(),
          shape: shapeId,
          file,
        });
        addToast({
          title: "آینه ایجاد شد",
          description: "آینه جدید با موفقیت ایجاد شد.",
          variant: "success",
        });
      } else {
        // Update mode
        const updatePayload: {
          name?: string;
          shape?: string;
          file?: File;
        } = {};
        if (mirror?.name !== name.trim()) {
          updatePayload.name = name.trim();
        }
        if (mirror?.shape.id !== shapeId) {
          updatePayload.shape = shapeId;
        }
        if (file) {
          updatePayload.file = file;
        }
        await updateMirror.mutateAsync({
          id: mirror!.id,
          payload: updatePayload,
        });
        addToast({
          title: "آینه به‌روزرسانی شد",
          description: "تغییرات با موفقیت ذخیره شد.",
          variant: "success",
        });
      }
      onClose();
    } catch (error) {
      addToast({
        title: "خطا",
        description:
          error instanceof Error
            ? error.message
            : "خطایی در ذخیره‌سازی رخ داد.",
        variant: "error",
      });
    }
  };

  const getShapeName = (shapeId: string) =>
    shapes.find((shape) => shape.id === shapeId)?.name ?? "نامشخص";

  const isLoading = createMirror.isPending || updateMirror.isPending;

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
              options={shapes.map((shape) => ({
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="mirror-file" requiredMarker={mode === "create"}>
              تصویر آینه
            </Label>
            <div className="flex flex-col gap-3">
              {filePreview && (
                <div className="relative h-40 w-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-layer-hover to-layer shadow-sm">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-xs text-white">
                    <span className="font-medium">
                      {mode === "create" ? "پیش‌نمایش تصویر جدید" : "تصویر فعلی آینه"}
                    </span>
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px]">
                      برای تغییر، تصویر جدید انتخاب کنید
                    </span>
                  </div>
                </div>
              )}

              <div className="relative flex items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-layer/40 px-3 py-3 hover:border-primary/60 hover:bg-layer-hover/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-layer-hover/80 text-muted-foreground">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.7}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <BodyText className="text-sm font-medium">
                      {file ? "تصویر انتخاب شده" : "انتخاب یا کشیدن تصویر آینه"}
                    </BodyText>
                    <BodyText className="text-[11px] text-muted-foreground">
                      {file
                        ? file.name
                        : "فرمت‌های مجاز: JPG, PNG • حداکثر حجم پیشنهادی: ۵ مگابایت"}
                    </BodyText>
                  </div>
                </div>
                <div className="pointer-events-none rounded-md border border-border bg-layer px-3 py-1.5 text-[11px] font-medium text-foreground">
                  مرور فایل‌ها
                </div>
                <Input
                  id="mirror-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>

              <BodyText className="text-[11px] text-muted-foreground">
                {mode === "create"
                  ? "برای ایجاد آینه جدید، تصویر محصول را بارگذاری کنید."
                  : "در صورت عدم انتخاب تصویر جدید، تصویر فعلی حفظ می‌شود."}
              </BodyText>
            </div>

            {errors.file && (
              <BodyText className="text-xs text-red-500">{errors.file}</BodyText>
            )}
          </div>
        </div>

        <div className="flex justify-start gap-3 border-t border-border pt-4">
          <Button variant="ghost" onClick={onClose}>
            لغو
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isDirty || isLoading || shapesLoading}
          >
            {isLoading
              ? "در حال ذخیره..."
              : mode === "create"
                ? "ایجاد آینه"
                : "ذخیره تغییرات"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

