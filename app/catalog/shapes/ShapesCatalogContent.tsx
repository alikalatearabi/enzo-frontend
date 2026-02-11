"use client";

import { Pencil, Trash2, Shapes } from "lucide-react";
import { BodyText, MutedText } from "../../../components/ui/typography";
import { EmptyState } from "../../../components/ui/empty-state";
import { Button } from "../../../components/ui/button";
import type { Shape } from "../../../lib/api/shapes";

type ShapesCatalogContentProps = {
  shapes: Shape[];
  isLoading: boolean;
  isError: boolean;
  onCreateShape: () => void;
  onEditShape: (shape: Shape) => void;
  onDeleteShape: (shape: Shape) => void;
};

export function ShapesCatalogContent({
  shapes,
  isLoading,
  isError,
  onCreateShape,
  onEditShape,
  onDeleteShape,
}: ShapesCatalogContentProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <BodyText className="text-sm text-muted-foreground">
          در حال بارگذاری اشکال...
        </BodyText>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={Shapes}
        title="خطا در دریافت اشکال"
        description="متأسفانه امکان بارگذاری فهرست اشکال وجود ندارد. لطفاً اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید."
        actionLabel="تلاش مجدد"
        onAction={() => window.location.reload()}
        className="border-red-500/20 bg-red-500/5"
      />
    );
  }

  if (shapes.length === 0) {
    return (
      <EmptyState
        icon={Shapes}
        title="هیچ شکلی ثبت نشده است"
        description="برای شروع، اولین شکل آینه را ایجاد کنید تا بتوانید در کاتالوگ آینه‌ها و سفارش‌ها از آن استفاده کنید."
        actionLabel="افزودن شکل جدید"
        onAction={onCreateShape}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="group relative flex flex-col gap-3 rounded-lg border border-border bg-layer p-4 transition-all hover:border-primary/20 hover:shadow-lg"
        >
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border bg-surface transition-colors group-hover:border-primary/30">
            <span className="text-sm font-semibold text-muted-foreground">
              {shape.name}
            </span>
          </div>
          <div className="flex items-center justify-between gap-1 text-sm">
            <span className="font-semibold text-foreground">{shape.name}</span>
            <span className="inline-flex w-fit items-center rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
              {shape.deformed ? "بدشکل" : "استاندارد"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-1 border-t border-border pt-3 mt-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteShape(shape)}
              className="h-8 w-8 rounded-md text-muted-foreground/70 transition-all hover:bg-red-500/10 hover:text-red-500 hover:scale-110 active:scale-95"
              title="حذف شکل"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEditShape(shape)}
              className="h-8 w-8 rounded-md text-muted-foreground/70 transition-all hover:bg-primary/10 hover:text-primary hover:scale-110 active:scale-95"
              title="ویرایش شکل"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
