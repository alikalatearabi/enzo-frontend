"use client";

import { useRef, useState } from "react";
import { useAccountings, useCreateAccounting, useDeleteAccounting } from "../../../hooks/api/useAccounting";
import { useToast } from "../../../components/ui/feedback/ToastProvider";
import { parseAccountingExcel, type ParsedAccountingRow } from "../../../lib/utils/parseAccountingExcel";
import {
  PageTitle,
  SectionTitle,
  BodyText,
  MutedText,
} from "../../../components/ui/typography";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Dialog } from "../../../components/ui/dialog";
import { ConfirmDialog } from "../../../components/ui/dialog";
import { EmptyState } from "../../../components/ui/empty-state";
import { formatPersianCurrency, formatPersianNumber, toPersianNumber } from "../../../lib/utils/numbers";
import { FileSpreadsheet, Trash2 } from "lucide-react";

function formatDate(s: string | undefined): string {
  if (!s) return "—";
  try {
    const d = new Date(s);
    return d.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default function CatalogAccountingPage() {
  const { data: accountings = [], isLoading, isError } = useAccountings();
  const createAccountingMutation = useCreateAccounting();
  const deleteAccountingMutation = useDeleteAccounting();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importPreviewOpen, setImportPreviewOpen] = useState(false);
  const [importPreviewRows, setImportPreviewRows] = useState<ParsedAccountingRow[]>([]);
  const [importSkipped, setImportSkipped] = useState(0);
  const [importPending, setImportPending] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountingToDelete, setAccountingToDelete] = useState<{ id: string; label: string } | null>(null);

  const handleExcelFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const result = await parseAccountingExcel(file);
    if (!result.success) {
      addToast({ title: "خطا در خواندن فایل", description: result.error, variant: "error" });
      return;
    }
    if (result.rows.length === 0) {
      addToast({
        title: "داده‌ای برای import نیست",
        description: result.skipped ? `همه ${toPersianNumber(result.skipped)} ردیف به‌دلیل نام خالی نادیده گرفته شد.` : "جدول خالی است.",
        variant: "error",
      });
      return;
    }
    setImportPreviewRows(result.rows);
    setImportSkipped(result.skipped);
    setImportPreviewOpen(true);
  };

  const handleImportApprove = async () => {
    setImportPending(true);
    try {
      const items: Record<string, { name: string; retailPrice: number; wholeSalePrice: number }> = {};
      importPreviewRows.forEach((row) => {
        const key = row.name.trim() || String(Math.random());
        items[key] = { name: row.name.trim(), retailPrice: row.retailPrice, wholeSalePrice: row.wholeSalePrice };
      });
      await createAccountingMutation.mutateAsync({ items });
      addToast({
        title: "جدول قیمت ایجاد شد",
        description: `${toPersianNumber(importPreviewRows.length)} آیتم با موفقیت وارد شد.`,
        variant: "success",
      });
      setImportPreviewOpen(false);
      setImportPreviewRows([]);
    } catch (err) {
      addToast({
        title: "خطا در ایجاد جدول",
        description: err instanceof Error ? err.message : "لطفاً دوباره تلاش کنید.",
        variant: "error",
      });
    } finally {
      setImportPending(false);
    }
  };

  const handleDeleteClick = (acc: { id: string; items: Record<string, unknown> }) => {
    const count = Object.keys(acc.items || {}).length;
    setAccountingToDelete({
      id: acc.id,
      label: `جدول با ${toPersianNumber(count)} آیتم`,
    });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!accountingToDelete) return;
    try {
      await deleteAccountingMutation.mutateAsync(accountingToDelete.id);
      addToast({
        title: "جدول حذف شد",
        description: "جدول قیمت با موفقیت حذف شد.",
        variant: "success",
      });
      setDeleteDialogOpen(false);
      setAccountingToDelete(null);
    } catch {
      addToast({
        title: "خطا در حذف",
        description: "لطفاً دوباره تلاش کنید.",
        variant: "error",
      });
    }
  };

  return (
    <section className="flex flex-1 flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-2">
        <PageTitle>جداول حسابداری (قیمت‌گذاری)</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">فهرست جداول قیمت</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <BodyText className="text-sm text-muted-foreground">در حال بارگذاری...</BodyText>
          )}
          {isError && !isLoading && (
            <BodyText className="text-sm text-red-500">خطا در دریافت فهرست.</BodyText>
          )}
          {!isLoading && !isError && accountings.length === 0 && (
            <EmptyState
              title="هنوز جدولی ثبت نشده"
              description="با دکمهٔ «افزودن جدول قیمت» یا «بارگذاری از اکسل» یک جدول جدید ایجاد کنید."
              actionLabel="بارگذاری از اکسل"
              onAction={() => fileInputRef.current?.click()}
            />
          )}
          {!isLoading && !isError && accountings.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>شناسه</TableHead>
                  <TableHead>تعداد آیتم‌ها</TableHead>
                  <TableHead>آخرین به‌روزرسانی</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountings.map((acc, index) => (
                  <TableRow key={acc.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          جدول {toPersianNumber(index + 1)}
                        </span>
                        <MutedText className="text-xs font-mono">{acc.id.slice(-8)}</MutedText>
                      </div>
                    </TableCell>
                    <TableCell>{toPersianNumber(Object.keys(acc.items || {}).length)}</TableCell>
                    <TableCell>{formatDate(acc.updatedAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-red-500/10"
                        onClick={() => handleDeleteClick(acc)}
                        title="حذف جدول"
                        aria-label="حذف جدول"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
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
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleExcelFileSelect}
        />
        <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
          <FileSpreadsheet className="ml-2 h-4 w-4" />
          بارگذاری از اکسل
        </Button>
      </div>

      {/* Excel import preview modal */}
      <Dialog
        open={importPreviewOpen}
        onClose={() => !importPending && setImportPreviewOpen(false)}
        title="پیش‌نمایش داده‌های اکسل"
        description={
          importSkipped > 0
            ? `${toPersianNumber(importPreviewRows.length)} ردیف معتبر؛ ${toPersianNumber(importSkipped)} ردیف به‌دلیل نام خالی نادیده گرفته شد.`
            : `${toPersianNumber(importPreviewRows.length)} ردیف برای ایجاد جدول قیمت.`
        }
        contentClassName="max-w-4xl"
      >
        <div className="flex max-h-[60vh] flex-col gap-4">
          <div className="overflow-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام</TableHead>
                  <TableHead>قیمت خرده‌فروشی</TableHead>
                  <TableHead>قیمت عمده‌فروشی</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importPreviewRows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{formatPersianNumber(row.retailPrice)}</TableCell>
                    <TableCell>{formatPersianNumber(row.wholeSalePrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button
              variant="ghost"
              onClick={() => setImportPreviewOpen(false)}
              disabled={importPending}
            >
              انصراف
            </Button>
            <Button
              variant="primary"
              onClick={handleImportApprove}
              disabled={importPending || importPreviewRows.length === 0}
            >
              {importPending ? "در حال ایجاد..." : "تأیید و ایجاد جدول"}
            </Button>
          </div>
        </div>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setAccountingToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="حذف جدول قیمت"
        description={
          accountingToDelete
            ? `آیا از حذف «${accountingToDelete.label}» اطمینان دارید؟ این عمل قابل بازگشت نیست.`
            : ""
        }
        confirmLabel="حذف"
        cancelLabel="لغو"
        variant="destructive"
      />
    </section>
  );
}
