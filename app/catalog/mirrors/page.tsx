 "use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../components/ui/card";
import {
  BodyText,
  MutedText,
  PageTitle,
  SectionTitle,
} from "../../../components/ui/typography";
import {
  PolishedTable,
  PolishedTableBody,
  PolishedTableCell,
  PolishedTableHead,
  PolishedTableHeader,
  PolishedTableRow,
} from "../../../components/ui/polished-table";
import { Input } from "../../../components/ui/input";
import { CustomSelect } from "../../../components/ui/custom-select";
import { formatPersianCurrency, toPersianNumber } from "../../../lib/utils/numbers";
import { useMockMirrors } from "../../../lib/mocks/mirrors";
import { useMockShapes } from "../../../lib/mocks/shapes";
import { useMockFeatureModules } from "../../../lib/mocks/features";
import { MirrorDrawer } from "../../../components/catalog/MirrorDrawer";
import { useMirrorFilters } from "../../../hooks/catalog/useMirrorFilters";
import { MediaUploadModal } from "../../../components/media/MediaUploadModal";
import { useMediaUploads } from "../../../hooks/media/useMediaUploads";
import { MediaAsset } from "../../../lib/mocks/media";

export default function CatalogMirrorsPage() {
  const { data: mirrors } = useMockMirrors();
  const { data: shapes } = useMockShapes();
  const { data: featureModules } = useMockFeatureModules();
  const {
    filteredMirrors,
    searchTerm,
    setSearchTerm,
    shapeFilter,
    setShapeFilter,
  } = useMirrorFilters(mirrors);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [selectedMirrorId, setSelectedMirrorId] = useState<string | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const { addAsset } = useMediaUploads();
  const selectedMirror = mirrors.find((mirror) => mirror.id === selectedMirrorId);

  const findShape = (shapeId: string) =>
    shapes.find((shape) => shape.id === shapeId)?.name ?? "نامشخص";

  const findFeature = (featureId: string | undefined) =>
    featureModules.find((feature) => feature.id === featureId)?.name ?? "—";

  const handleMediaUpload = (asset: MediaAsset) => {
    addAsset(asset);
  };

  return (
    <section className="flex flex-1 flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-2">
        <PageTitle>آینه‌ها</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">کاتالوگ آینه</SectionTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="جستجو بر اساس نام یا شکل"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="max-w-xs"
            />
            <CustomSelect
              value={shapeFilter}
              onChange={(value) => setShapeFilter(value as "all" | string)}
              options={[
                { value: "all", label: "همه اشکال" },
                ...shapes.map((shape) => ({
                  value: shape.id,
                  label: shape.name,
                })),
              ]}
              className="w-48"
            />
            <BodyText className="text-xs">
              نمایش {toPersianNumber(filteredMirrors.length)} از {toPersianNumber(mirrors.length)} قالب
            </BodyText>
          </div>
          <PolishedTable>
            <PolishedTableHeader>
              <PolishedTableHead>آینه</PolishedTableHead>
              <PolishedTableHead>شکل</PolishedTableHead>
              <PolishedTableHead>ابعاد</PolishedTableHead>
              <PolishedTableHead>ویژگی‌ها</PolishedTableHead>
              <PolishedTableHead>قیمت</PolishedTableHead>
              <PolishedTableHead align="center">عملیات</PolishedTableHead>
            </PolishedTableHeader>
            <PolishedTableBody>
              {filteredMirrors.map((mirror) => (
                <PolishedTableRow key={mirror.id}>
                  <PolishedTableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-gradient-to-br from-layer-hover to-layer">
                        {mirror.picture ? (
                          <Image
                            src={mirror.picture.url}
                            alt={mirror.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) placeholder.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-layer-hover/90 to-layer-hover/70 ${
                            mirror.picture ? "hidden" : "flex"
                          }`}
                        >
                          <svg
                            className="h-5 w-5 text-muted-foreground/60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-foreground truncate">
                          {mirror.name}
                        </span>
                        <MutedText className="text-xs truncate">{mirror.id}</MutedText>
                      </div>
                    </div>
                  </PolishedTableCell>
                  <PolishedTableCell>{findShape(mirror.shape)}</PolishedTableCell>
                  <PolishedTableCell>
                    {toPersianNumber(mirror.defaultHeight)} × {toPersianNumber(mirror.defaultWidth)} سانتی‌متر
                  </PolishedTableCell>
                  <PolishedTableCell>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
                        قاب: {findFeature(mirror.features.frame)}
                      </span>
                      <span className="rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
                        نور: {findFeature(mirror.features.lightThread)}
                      </span>
                      <span className="rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
                        نور پس‌زمینه: {findFeature(mirror.features.backLight)}
                      </span>
                    </div>
                  </PolishedTableCell>
                  <PolishedTableCell>
                    {mirror.price ? formatPersianCurrency(mirror.price) : "—"}
                  </PolishedTableCell>
                  <PolishedTableCell align="center">
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => {
                        setSelectedMirrorId(mirror.id);
                        setDrawerMode("edit");
                      }}
                    >
                      ویرایش
                    </Button>
                  </PolishedTableCell>
                </PolishedTableRow>
              ))}
            </PolishedTableBody>
          </PolishedTable>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={() => {
            setSelectedMirrorId(null);
            setDrawerMode("create");
          }}
        >
          افزودن قالب آینه
        </Button>
        <Button 
          variant="secondary"
          onClick={() => setIsMediaModalOpen(true)}
        >
          آپلود رسانه
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {drawerMode && (
          <MirrorDrawer
            mode={drawerMode}
            mirror={drawerMode === "edit" ? selectedMirror : undefined}
            onClose={() => setDrawerMode(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMediaModalOpen && (
          <MediaUploadModal
            onClose={() => setIsMediaModalOpen(false)}
            onUpload={handleMediaUpload}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

