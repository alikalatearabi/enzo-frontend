"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "../../../lib/utils/cn";
import { Button } from "../button";

type ToastVariant = "default" | "success" | "error";

type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
};

type ToastContextValue = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (toastId: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, ...toast }]);

      if (!toast.onAction) {
        // Auto-dismiss after 4 seconds for passive toasts.
        setTimeout(() => {
          removeToast(id);
        }, 4000);
      }
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
    }),
    [toasts, addToast, removeToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "rounded-md border border-border bg-layer px-4 py-3 shadow-lg",
              toast.variant === "success" && "border-emerald-400/60 bg-emerald-100/10 text-emerald-600",
              toast.variant === "error" && "border-red-400/60 bg-red-100/10 text-red-600",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">
                  {toast.title}
                </span>
                {toast.description && (
                  <span className="text-xs text-muted-foreground">
                    {toast.description}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeToast(toast.id)}
                className="h-6 px-2 text-xs"
              >
                Close
              </Button>
            </div>
            {toast.actionLabel && (
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => {
                  toast.onAction?.();
                  removeToast(toast.id);
                }}
              >
                {toast.actionLabel}
              </Button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

