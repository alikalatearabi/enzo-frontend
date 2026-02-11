"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../components/ui/card";
import {
  PageTitle,
  SectionSubtitle,
  SectionTitle,
} from "../../../components/ui/typography";
import { ShapeDrawer } from "../../../components/catalog/ShapeDrawer";
import { ShapesCatalogContent } from "./ShapesCatalogContent";
import { useShapes, useDeleteShape } from "../../../hooks/api/useShapes";
import { ConfirmDialog } from "../../../components/ui/dialog";
import { useToast } from "../../../components/ui/feedback/ToastProvider";
import type { Shape } from "../../../lib/api/shapes";

export default function CatalogShapesPage() {
  const { data: shapes = [], isLoading, isError } = useShapes();
  const deleteShape = useDeleteShape();
  const { addToast } = useToast();
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [shapeToDelete, setShapeToDelete] = useState<Shape | null>(null);
  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);

  const handleEditShape = (shape: Shape) => {
    setSelectedShapeId(shape.id);
    setDrawerMode("edit");
  };

  const handleDeleteClick = (shape: Shape) => {
    setShapeToDelete(shape);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!shapeToDelete) return;

    try {
      await deleteShape.mutateAsync(shapeToDelete.id);
      addToast({
        title: "شکل حذف شد",
        description: `شکل "${shapeToDelete.name}" با موفقیت حذف شد.`,
        variant: "success",
      });
      setShapeToDelete(null);
    } catch (error) {
      addToast({
        title: "خطا در حذف شکل",
        description: "متأسفانه امکان حذف شکل وجود ندارد. لطفاً دوباره تلاش کنید.",
        variant: "error",
      });
    }
  };

  return (
    <section className="flex flex-1 flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-2">
        <PageTitle>اشکال</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">کاتالوگ اشکال</SectionTitle>
        </CardHeader>
        <CardContent>
          <ShapesCatalogContent
            shapes={shapes}
            isLoading={isLoading}
            isError={isError}
            onCreateShape={() => {
              setSelectedShapeId(null);
              setDrawerMode("create");
            }}
            onEditShape={handleEditShape}
            onDeleteShape={handleDeleteClick}
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={() => {
            setSelectedShapeId(null);
            setDrawerMode("create");
          }}
        >
          افزودن شکل
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {drawerMode && (
          <ShapeDrawer
            mode={drawerMode}
            shape={drawerMode === "edit" ? selectedShape : undefined}
            onClose={() => setDrawerMode(null)}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setShapeToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="حذف شکل"
        description={`آیا از حذف شکل "${shapeToDelete?.name}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`}
        confirmLabel="حذف"
        cancelLabel="لغو"
        variant="destructive"
      />
    </section>
  );
}

