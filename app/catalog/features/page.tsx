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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { useFeatureModulesData } from "../../../hooks/catalog/useFeatureModulesData";
import { CustomSelect } from "../../../components/ui/custom-select";
import { Input } from "../../../components/ui/input";
import { EmptyState } from "../../../components/ui/empty-state";
import { FeatureModuleDrawer } from "../../../components/catalog/FeatureModuleDrawer";
import { toPersianNumber } from "../../../lib/utils/numbers";

export default function CatalogFeaturesPage() {
  const { modules, createModule, updateModule } = useFeatureModulesData();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const selectedFeature = modules.find((feature) => feature.id === selectedFeatureId);

  const typeLabels: Record<string, string> = {
    frame: "قاب",
    lightThread: "نخ نوری",
    backLight: "نور پس‌زمینه",
    zoom: "زوم",
    thickness: "ضخامت",
    sandblast: "سندبلاست",
    lol: "LOL",
    mirrorModule: "ماژول آینه",
  };

  const filteredModules = modules.filter((feature) => {
    const matchesType = typeFilter === "all" || feature.type === typeFilter;
    const matchesSearch =
      !searchTerm ||
      feature.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <section className="flex flex-1 flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-2">
        <PageTitle>ماژول‌های ویژگی</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">فهرست ماژول‌ها</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="جستجوی ماژول ویژگی"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="max-w-xs"
            />
            <CustomSelect
              value={typeFilter}
              onChange={(value) => setTypeFilter(value)}
              options={[
                { value: "all", label: "همه انواع" },
                ...Object.entries(typeLabels).map(([key, label]) => ({
                  value: key,
                  label: label,
                })),
              ]}
              className="w-48"
            />
            <BodyText className="text-xs">
              نمایش {toPersianNumber(filteredModules.length)} از {toPersianNumber(modules.length)} ماژول
            </BodyText>
          </div>

          {filteredModules.length === 0 ? (
            <EmptyState
              title="ماژول ویژگی یافت نشد"
              description="فیلتر نوع را تغییر دهید یا جستجو را پاک کنید تا رکوردهای بیشتری را ببینید."
              actionLabel="بازنشانی فیلترها"
              onAction={() => {
                setSearchTerm("");
                setTypeFilter("all");
              }}
            />
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>ویژگی‌ها</TableHead>
                <TableHead>به‌روزرسانی</TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModules.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {feature.name}
                      </span>
                      <MutedText className="text-xs">{feature.id}</MutedText>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
                      {typeLabels[feature.type]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {feature.layerCount && (
                        <span>لایه‌ها: {toPersianNumber(feature.layerCount)}</span>
                      )}
                      {feature.code && <span>کد: {feature.code}</span>}
                      {!feature.layerCount && !feature.code && <span>—</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {new Date(feature.updatedAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell className="text-left">
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => {
                        setSelectedFeatureId(feature.id);
                        setDrawerMode("edit");
                      }}
                    >
                      ویرایش
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => {
            setSelectedFeatureId(null);
            setDrawerMode("create");
          }}
        >
          افزودن ماژول ویژگی
        </Button>
        <Button variant="subtle">مدیریت وابستگی‌ها</Button>
        <Button variant="ghost">مشاهده نگاشت حسابداری</Button>
      </div>

      <AnimatePresence mode="wait">
        {drawerMode && (
          <FeatureModuleDrawer
            mode={drawerMode}
            feature={drawerMode === "edit" ? selectedFeature : undefined}
            onClose={() => setDrawerMode(null)}
            onSubmit={(payload) => {
              if (drawerMode === "create") {
                createModule(payload);
              } else if (drawerMode === "edit" && selectedFeature) {
                updateModule({ ...payload, id: selectedFeature.id });
              }
            }}
            existingModules={modules}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

