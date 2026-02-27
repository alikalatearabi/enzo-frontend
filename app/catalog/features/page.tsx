"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  BodyText,
  MutedText,
  PageTitle,
  SectionTitle,
} from "../../../components/ui/typography";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import {
  useFeatureModules,
  useCreateFeatureModule,
  useUpdateFeatureModule,
  useDeleteFeatureModule,
} from "../../../hooks/api/useFeatureModules";
import {
  useLogos,
  useCreateLogo,
  useUpdateLogo,
  useDeleteLogo,
} from "../../../hooks/api/useLogos";
import { useToast } from "../../../components/ui/feedback/ToastProvider";
import { CustomSelect } from "../../../components/ui/custom-select";
import { Input } from "../../../components/ui/input";
import { EmptyState } from "../../../components/ui/empty-state";
import { FeatureModuleDrawer } from "../../../components/catalog/FeatureModuleDrawer";
import { toPersianNumber } from "../../../lib/utils/numbers";
import { ConfirmDialog } from "../../../components/ui/dialog";
import type { FeatureModule } from "../../../lib/api/features";

type CatalogTableItem = {
  id: string;
  type: string;
  name: string;
  isLogo: boolean;
  layerCount?: number;
  code?: string;
  updatedAt?: string;
  active?: boolean;
  position?: string;
};

export default function CatalogFeaturesPage() {
  const { data: modules = [], isLoading: modulesLoading, isError: modulesError } = useFeatureModules();
  const { data: logos = [], isLoading: logosLoading, isError: logosError } = useLogos();
  const createModule = useCreateFeatureModule();
  const updateModule = useUpdateFeatureModule();
  const deleteModule = useDeleteFeatureModule();
  const createLogo = useCreateLogo();
  const updateLogo = useUpdateLogo();
  const deleteLogo = useDeleteLogo();
  const { addToast } = useToast();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);
  const selectedFeature = modules.find((f) => f.id === selectedFeatureId);
  const selectedLogo = logos.find((l) => l.id === selectedLogoId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CatalogTableItem | null>(null);

  const typeLabels: Record<string, string> = {
    frame: "قاب",
    lightThread: "نخ نوری",
    backLight: "نور پس‌زمینه",
    zoom: "زوم",
    thickness: "ضخامت",
    sandblast: "سندبلاست",
    lol: "LOL",
    logo: "لوگو",
  };

  const allItems = useMemo<CatalogTableItem[]>(() => {
    const fromModules: CatalogTableItem[] = modules.map((m) => ({
      id: m.id,
      type: m.type,
      name: m.name,
      isLogo: false,
      layerCount: m.layerCount,
      code: m.code,
      updatedAt: m.updatedAt,
    }));
    const fromLogos: CatalogTableItem[] = logos.map((l) => ({
      id: l.id,
      type: "logo",
      name: l.logoType,
      isLogo: true,
      active: l.active,
      position: l.position,
    }));
    return [...fromModules, ...fromLogos];
  }, [modules, logos]);

  const filteredItems = useMemo(
    () =>
      allItems.filter((item) => {
        const matchesType = typeFilter === "all" || item.type === typeFilter;
        const matchesSearch =
          !searchTerm ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
      }),
    [allItems, typeFilter, searchTerm],
  );

  const isLoading = modulesLoading || logosLoading;
  const isError = modulesError || logosError;

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
              نمایش {toPersianNumber(filteredItems.length)} از {toPersianNumber(allItems.length)} مورد
            </BodyText>
          </div>

          {isLoading && (
            <BodyText className="text-sm text-muted-foreground">
              در حال بارگذاری...
            </BodyText>
          )}
          {isError && !isLoading && (
            <BodyText className="text-sm text-red-500">
              خطا در دریافت فهرست.
            </BodyText>
          )}
          {!isLoading && !isError && filteredItems.length === 0 ? (
              <EmptyState
                title="موردی یافت نشد"
                description="فیلتر نوع را تغییر دهید یا جستجو را پاک کنید."
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
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {item.name}
                      </span>
                      <MutedText className="text-xs">{item.id}</MutedText>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
                      {typeLabels[item.type]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {item.isLogo ? (
                        <>
                          <span>{item.active ? "فعال" : "غیرفعال"}</span>
                          {item.position && (
                            <span>موقعیت: {item.position}</span>
                          )}
                        </>
                      ) : (
                        <>
                          {item.layerCount != null && (
                            <span>لایه‌ها: {toPersianNumber(item.layerCount)}</span>
                          )}
                          {item.code && <span>کد: {item.code}</span>}
                          {item.layerCount == null && !item.code && <span>—</span>}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-start gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-primary/10"
                        onClick={() => {
                          if (item.isLogo) {
                            setSelectedLogoId(item.id);
                            setSelectedFeatureId(null);
                          } else {
                            setSelectedFeatureId(item.id);
                            setSelectedLogoId(null);
                          }
                          setDrawerMode("edit");
                        }}
                        title={item.isLogo ? "ویرایش لوگو" : "ویرایش ماژول"}
                        aria-label={item.isLogo ? "ویرایش لوگو" : "ویرایش ماژول"}
                      >
                        <Edit2 className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-red-500/10"
                        onClick={() => {
                          setItemToDelete(item);
                          setDeleteDialogOpen(true);
                        }}
                        title={item.isLogo ? "حذف لوگو" : "حذف ماژول"}
                        aria-label={item.isLogo ? "حذف لوگو" : "حذف ماژول"}
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
            setSelectedLogoId(null);
            setDrawerMode("create");
          }}
          disabled={isLoading || isError}
        >
          افزودن ماژول ویژگی یا لوگو
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {drawerMode && (
          <FeatureModuleDrawer
            mode={drawerMode}
            feature={drawerMode === "edit" ? selectedFeature ?? undefined : undefined}
            logo={drawerMode === "edit" ? selectedLogo ?? undefined : undefined}
            onClose={() => {
              setDrawerMode(null);
              setSelectedFeatureId(null);
              setSelectedLogoId(null);
            }}
            onSubmit={async (payload) => {
              try {
                if (payload.kind === "logo") {
                  if (drawerMode === "create") {
                    await createLogo.mutateAsync({
                      logoType: payload.logoType,
                      active: payload.active,
                      position: payload.position,
                    });
                    addToast({
                      title: "لوگو ایجاد شد",
                      description: "لوگو جدید با موفقیت ایجاد شد.",
                      variant: "success",
                    });
                  } else if (selectedLogo) {
                    await updateLogo.mutateAsync({
                      id: selectedLogo.id,
                      payload: {
                        logoType: payload.logoType,
                        active: payload.active,
                        position: payload.position,
                      },
                    });
                    addToast({
                      title: "لوگو به‌روزرسانی شد",
                      description: "تغییرات با موفقیت ذخیره شد.",
                      variant: "success",
                    });
                  }
                } else {
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
                  } else if (selectedFeature) {
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
                  }
                }
                setDrawerMode(null);
                setSelectedFeatureId(null);
                setSelectedLogoId(null);
              } catch (error) {
                addToast({
                  title: "خطا در ذخیره",
                  description: "لطفاً دوباره تلاش کنید یا بعداً مراجعه کنید.",
                  variant: "error",
                });
                throw error;
              }
            }}
            existingModules={modules}
            existingLogos={logos}
            isLoading={
              createModule.isPending ||
              updateModule.isPending ||
              createLogo.isPending ||
              updateLogo.isPending
            }
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={async () => {
          if (!itemToDelete) return;
          try {
            if (itemToDelete.isLogo) {
              await deleteLogo.mutateAsync(itemToDelete.id);
              addToast({
                title: "لوگو حذف شد",
                description: `لوگو "${itemToDelete.name}" با موفقیت حذف شد.`,
                variant: "success",
              });
            } else {
              await deleteModule.mutateAsync({
                id: itemToDelete.id,
                type: itemToDelete.type as FeatureModule["type"],
              });
              addToast({
                title: "ماژول حذف شد",
                description: `ماژول "${itemToDelete.name}" با موفقیت حذف شد.`,
                variant: "success",
              });
            }
            setDeleteDialogOpen(false);
            setItemToDelete(null);
          } catch {
            addToast({
              title: "خطا در حذف",
              description: "متأسفانه امکان حذف وجود ندارد. لطفاً دوباره تلاش کنید.",
              variant: "error",
            });
          }
        }}
        title={itemToDelete?.isLogo ? "حذف لوگو" : "حذف ماژول"}
        description={
          itemToDelete
            ? `آیا از حذف "${itemToDelete.name}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`
            : ""
        }
        confirmLabel="حذف"
        cancelLabel="لغو"
        variant="destructive"
      />
    </section>
  );
}

