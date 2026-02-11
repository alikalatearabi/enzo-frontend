"use client";

import { useMemo, useState } from "react";
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
import {
  formatPersianCurrency,
  toPersianNumber,
} from "../../../lib/utils/numbers";
import { MirrorDrawer } from "../../../components/catalog/MirrorDrawer";
import { useMirrorFilters } from "../../../hooks/catalog/useMirrorFilters";
import { useMirrors } from "../../../hooks/api/useMirrors";

export default function CatalogMirrorsPage() {
  const { data: mirrors = [], isLoading, isError } = useMirrors();
  const {
    filteredMirrors,
    searchTerm,
    setSearchTerm,
    shapeFilter,
    setShapeFilter,
  } = useMirrorFilters(mirrors);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [selectedMirrorId, setSelectedMirrorId] = useState<string | null>(null);
  const selectedMirror = mirrors.find((mirror) => mirror.id === selectedMirrorId);

  const shapeOptions = useMemo(
    () => [
      { value: "all", label: "همه اشکال" },
      ...Array.from(
        new Map(
          mirrors.map((mirror) => [mirror.shape.id, mirror.shape.name]),
        ).entries(),
      ).map(([id, name]) => ({ value: id, label: name })),
    ],
    [mirrors],
  );

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
              options={shapeOptions}
              className="w-48"
            />
            <BodyText className="text-xs">
              {isLoading
                ? "در حال بارگذاری..."
                : isError
                  ? "خطا در دریافت داده‌ها"
                  : `نمایش ${toPersianNumber(filteredMirrors.length)} از ${toPersianNumber(mirrors.length)} قالب`}
            </BodyText>
          </div>
          <PolishedTable>
            <PolishedTableHeader>
              <PolishedTableHead>آینه</PolishedTableHead>
              <PolishedTableHead>شکل</PolishedTableHead>
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
                            src={mirror.picture}
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
                  <PolishedTableCell>{mirror.shape.name}</PolishedTableCell>
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
        {/* Media upload is driven by a separate media catalog page now */}
      </AnimatePresence>
    </section>
  );
}

