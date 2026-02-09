"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  BodyText,
  MutedText,
  PageTitle,
  SectionSubtitle,
  SectionTitle,
} from "../../../components/ui/typography";
import { useMockShapes } from "../../../lib/mocks/shapes";
import { useMockFeatureModules } from "../../../lib/mocks/features";
import { toPersianNumber } from "../../../lib/utils/numbers";
import { ShapeDrawer } from "../../../components/catalog/ShapeDrawer";

export default function CatalogShapesPage() {
  const { data: shapes } = useMockShapes();
  const { data: features } = useMockFeatureModules();
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);

  const getThickness = (thicknessId: string) =>
    features.find(
      (feature) => feature.id === thicknessId && feature.type === "thickness",
    )?.name ?? "نامشخص";

  return (
    <section className="flex flex-1 flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-2">
        <PageTitle>اشکال</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">کاتالوگ اشکال</SectionTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {shapes.map((shape) => (
            <div
              key={shape.id}
              className="flex flex-col gap-3 rounded-lg border border-border bg-layer p-4 transition-all hover:shadow-md"
            >
              <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border bg-surface">
                <span className="text-sm font-semibold text-muted-foreground">
                  {shape.name}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-semibold text-foreground">{shape.name}</span>
                <MutedText className="text-xs">شناسه: {shape.id}</MutedText>
                <MutedText className="text-xs">نسبت: {shape.aspectRatio}</MutedText>
                <MutedText className="text-xs">
                  ضخامت: {getThickness(shape.recommendedThickness)}
                </MutedText>
                <span className="inline-flex w-fit items-center rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
                  {shape.deformed ? "بدشکل" : "استاندارد"}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button 
          variant="secondary"
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
    </section>
  );
}

