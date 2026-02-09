"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { BodyText, SectionTitle } from "../ui/typography";
import { useToast } from "../ui/feedback/ToastProvider";
import { MediaAsset } from "../../lib/mocks/media";

type MediaUploadModalProps = {
  onClose: () => void;
  onUpload: (asset: MediaAsset) => void;
};

export function MediaUploadModal({ onClose, onUpload }: MediaUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [bucket] = useState("mirrors");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      addToast({
        title: "نوع فایل نامعتبر",
        description: "لطفاً یک فایل تصویری انتخاب کنید.",
        variant: "error",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      addToast({
        title: "حجم فایل زیاد است",
        description: "حداکثر حجم فایل 10 مگابایت است.",
        variant: "error",
      });
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setName(selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));
  };

  const handleUpload = async () => {
    if (!file) {
      addToast({
        title: "لطفاً فایلی انتخاب کنید",
        description: "قبل از ادامه، یک تصویر انتخاب کنید.",
        variant: "error",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a mock URL (in real implementation, this would come from backend)
      const fileExt = file.name.split(".").pop();
      const mockFileName = `${crypto.randomUUID()}.${fileExt}`;
      const mockUrl = `http://localhost:9000/${bucket}/${mockFileName}`;

      const asset: MediaAsset = {
        id: crypto.randomUUID(),
        name: name || file.name,
        filename: file.name,
        bucket,
        url: mockUrl,
        sizeKb: Math.round(file.size / 1024),
        uploadedBy: "کاربر فعلی",
        uploadedAt: new Date().toISOString(),
      };

      onUpload(asset);
      addToast({
        title: "آپلود موفق",
        description: "رسانه با موفقیت آپلود شد.",
        variant: "success",
      });
      onClose();
    } catch (error) {
      addToast({
        title: "خطا در آپلود",
        description: "آپلود فایل با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
        variant: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setName("");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUploading) {
          handleClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-lg rounded-lg border border-border bg-layer p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <SectionTitle as="h3">آپلود رسانه</SectionTitle>
            <BodyText className="max-w-md text-sm">
              فایل تصویری خود را انتخاب کنید تا به MinIO آپلود شود.
            </BodyText>
          </div>
          <Button variant="ghost" onClick={handleClose} disabled={isUploading}>
            بستن
          </Button>
        </div>

        <div className="mt-4 grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="media-file" requiredMarker>
              فایل
            </Label>
            <input
              ref={fileInputRef}
              id="media-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <BodyText className="text-xs">
              سطل انتخاب شده: {bucket}. حداکثر حجم: 10 مگابایت
            </BodyText>
          </div>

          {previewUrl && (
            <div className="flex flex-col gap-2">
              <Label>پیش‌نمایش</Label>
              <div className="flex h-48 items-center justify-center rounded-md border border-border bg-layer-hover overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="پیش‌نمایش"
                  width={180}
                  height={180}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="media-name">نام نمایشی</Label>
            <Input
              id="media-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="نام رسانه"
              disabled={isUploading}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-start gap-3 border-t border-border pt-4">
          <Button variant="ghost" onClick={handleClose} disabled={isUploading}>
            لغو
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? "در حال آپلود..." : "آپلود"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

