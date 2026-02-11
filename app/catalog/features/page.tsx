"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
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
import {
  useFeatureModules,
  useCreateFeatureModule,
  useUpdateFeatureModule,
  useDeleteFeatureModule,
} from "../../../hooks/api/useFeatureModules";
import { useToast } from "../../../components/ui/feedback/ToastProvider";
import { CustomSelect } from "../../../components/ui/custom-select";
import { Input } from "../../../components/ui/input";
import { EmptyState } from "../../../components/ui/empty-state";
import { FeatureModuleDrawer } from "../../../components/catalog/FeatureModuleDrawer";
import { toPersianNumber } from "../../../lib/utils/numbers";
import { ConfirmDialog } from "../../../components/ui/dialog";

export default function CatalogFeaturesPage() {
  const { data: modules = [], isLoading, isError } = useFeatureModules();
  const createModule = useCreateFeatureModule();
  const updateModule = useUpdateFeatureModule();
  const deleteModule = useDeleteFeatureModule();
  const { addToast } = useToast();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const selectedFeature = modules.find((feature) => feature.id === selectedFeatureId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<
    { id: string; name: string; type: string } | null
  >(null);

  const typeLabels: Record<string, string> = {
    frame: "قاب",
    lightThread: "نخ نوری",
    backLight: "نور پس‌زمینه",
    zoom: "زوم",
    thickness: "ضخامت",
    sandblast: "سندبلاست",
    lol: "LOL",
  };

  const filteredModules = useMemo(
    () =>
      modules.filter((feature) => {
        const matchesType = typeFilter === "all" || feature.type === typeFilter;
        const matchesSearch =
          !searchTerm ||
          feature.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
      }),
    [modules, typeFilter, searchTerm],
  );

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

          {isLoading && (
            <BodyText className="text-sm text-muted-foreground">
              در حال بارگذاری ماژول‌ها...
            </BodyText>
          )}
          {isError && !isLoading && (
            <BodyText className="text-sm text-red-500">
              خطا در دریافت فهرست ماژول‌ها.
            </BodyText>
          )}
          {!isLoading && !isError && filteredModules.length === 0 ? (
              <EmptyState
                title="ماژول ویژگی یافت نشد"
                description="فیلتر نوع را تغییر دهید یا جستجو را پاک کنید تا رکوردهای بیشتری را ببینید."
                actionLabel="بازنشانی فیلترها"
                onAction={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                }}
              />
            ) : !isLoading && !isError ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>ویژگی‌ها</TableHead>
                <TableHead>به‌روزرسانی</TableHead>
                <TableHead>عملیات</TableHead>
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
                    {feature.updatedAt
                      ? new Date(feature.updatedAt).toLocaleDateString("fa-IR")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-start gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-primary/10"
                        onClick={() => {
                          setSelectedFeatureId(feature.id);
                          setDrawerMode("edit");
                        }}
                        title="ویرایش ماژول"
                        aria-label="ویرایش ماژول"
                      >
                        <Edit2 className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-red-500/10"
                        onClick={() => {
                          setFeatureToDelete({
                            id: feature.id,
                            name: feature.name,
                            type: feature.type,
                          });
                          setDeleteDialogOpen(true);
                        }}
                        title="حذف ماژول"
                        aria-label="حذف ماژول"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => {
            setSelectedFeatureId(null);
            setDrawerMode("create");
          }}
          disabled={isLoading || isError}
        >
          افزودن ماژول ویژگی
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {drawerMode && (
          <FeatureModuleDrawer
            mode={drawerMode}
            feature={drawerMode === "edit" ? selectedFeature : undefined}
            onClose={() => setDrawerMode(null)}
            onSubmit={async (payload) => {
              try {
                if (drawerMode === "create") {
                  await createModule.mutateAsync({
                    name: payload.name,
                    type: payload.type,
                    code: payload.code,
                    layerCount: payload.layerCount,
                  });
                  addToast({
                    title: "ماژول ویژگی ایجاد شد",
                    description: "ماژول جدید با موفقیت ایجاد شد.",
                    variant: "success",
                  });
                  setDrawerMode(null);
                } else if (drawerMode === "edit" && selectedFeature) {
                  await updateModule.mutateAsync({
                    id: selectedFeature.id,
                    name: payload.name,
                    type: payload.type,
                    code: payload.code,
                    layerCount: payload.layerCount,
                  });
                  addToast({
                    title: "ماژول ویژگی به‌روزرسانی شد",
                    description: "تغییرات با موفقیت ذخیره شد.",
                    variant: "success",
                  });
                  setDrawerMode(null);
                }
              } catch (error) {
                addToast({
                  title: "خطا در ذخیره ماژول",
                  description: "لطفاً دوباره تلاش کنید یا بعداً مراجعه کنید.",
                  variant: "error",
                });
                throw error; // Re-throw so drawer doesn't close on error
              }
            }}
            existingModules={modules}
            isLoading={createModule.isPending || updateModule.isPending}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setFeatureToDelete(null);
        }}
        onConfirm={async () => {
          if (!featureToDelete) return;
          try {
            await deleteModule.mutateAsync({
              id: featureToDelete.id,
              type: featureToDelete.type as any,
            });
            addToast({
              title: "ماژول حذف شد",
              description: `ماژول "${featureToDelete.name}" با موفقیت حذف شد.`,
              variant: "success",
            });
            setFeatureToDelete(null);
          } catch {
            addToast({
              title: "خطا در حذف ماژول",
              description:
                "متأسفانه امکان حذف ماژول وجود ندارد. لطفاً دوباره تلاش کنید.",
              variant: "error",
            });
          }
        }}
        title="حذف ماژول"
        description={
          featureToDelete
            ? `آیا از حذف ماژول "${featureToDelete.name}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`
            : ""
        }
        confirmLabel="حذف"
        cancelLabel="لغو"
        variant="destructive"
      />
    </section>
  );
}

