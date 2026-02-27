"use client";

import { useEffect } from "react";
import { Button } from "./button";
import { BodyText } from "./typography";
import { cn } from "../../lib/utils/cn";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  contentClassName?: string;
  children?: React.ReactNode;
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  contentClassName,
  children,
}: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full rounded-lg border border-border bg-layer p-6 shadow-xl",
          contentClassName ?? "max-w-md",
        )}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {description && (
              <BodyText className="text-sm text-muted-foreground">
                {description}
              </BodyText>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "تأیید",
  cancelLabel = "لغو",
  variant = "default",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title={title} description={description}>
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onClose} className="h-10 px-4">
          {cancelLabel}
        </Button>
        <Button
          onClick={handleConfirm}
          className={`h-10 px-4 ${
            variant === "destructive"
              ? "bg-red-500 text-white hover:bg-red-600"
              : ""
          }`}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}

