"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { SectionTitle } from "./ui/typography";
import { cn } from "../lib/utils/cn";

const inputUnderlineClass =
  "border-0 border-b border-border rounded-none px-0 shadow-none bg-transparent transition-colors focus-visible:ring-0 focus-visible:border-primary focus-visible:outline-none";

function RadioOption({
  name,
  id,
  checked,
  onChange,
  label,
}: { name: string; id: string; checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors">
      <input
        type="radio"
        name={name}
        id={id}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 border-border text-primary focus:ring-primary"
      />
      <span className="text-sm select-none">{label}</span>
    </label>
  );
}

function CheckOption({
  id,
  checked,
  onChange,
  label,
}: { id: string; checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
      />
      <span className="text-sm select-none">{label}</span>
    </label>
  );
}

/**
 * Mirror order form – React version of the legacy HTML form.
 *
 * Order-mappable form items (can be filled from Order): 14
 * - workOrder (شماره سفارش)
 * - startDate / endDate or date (تاریخ)
 * - thickness (ضخامت 6/4mm)
 * - height (ارتفاع)
 * - width (عرض)
 * - count (تعداد)
 * - lol / toolType (نوع ابزار: فقط برش، تراش، لول مات، لول براق)
 * - cornerBend (گوشه R: دارد + اندازه R)
 * - sandblast (سند بلاست دارد/ندارد)
 * - code / designCode (کد طرح)
 * - description (توضیحات)
 * - lightThread / touchHas (تاچ)
 * - logo / logoHas (لوگو)
 * - backLight / backLightCode (آینه بک لایت – کد محصول)
 *
 * Not from Order: customerName (نام مشتری), shape (شکل هندسی), mirrorColor (رنگ آینه),
 * other (سایر), attachment (پیوست), sketch (اتود دستی), lightColor, antifog, backLightDescription.
 */

/** Optional initial values, e.g. from an Order, to pre-fill the form */
export type MirrorOrderFormInitialValues = Partial<{
  /** نام مشتری – not in Order schema (e.g. from Invoice) */
  customerName: string;
  /** شماره سفارش – maps to order.workOrder */
  workOrder: string;
  /** تاریخ – maps to order.startDate / endDate */
  date: string;
  startDate: string;
  endDate: string;
  /** ضخامت – 6 | 4 (mm), maps to order.thickness */
  thickness: "6" | "4";
  /** ارتفاع (cm), maps to order.height */
  height: number | string;
  /** عرض (cm), maps to order.width */
  width: number | string;
  /** شکل هندسی – mirror-related */
  shape: string;
  /** رنگ آینه – mirror-related */
  mirrorColor: string;
  /** تعداد – maps to order.count */
  count: number | string;
  /** نوع ابزار – cut | bevel | matte | polished, maps to order.lol */
  toolType: "cut" | "bevel" | "matte" | "polished";
  /** سایر */
  other: string;
  /** گوشه R دارد – maps to order.cornerBend (has corner) */
  cornerHas: boolean;
  /** اندازه R (mm), maps to order.cornerBend */
  cornerR: number | string;
  /** سند بلاست دارد – maps to order.sandblast */
  sandblastHas: boolean;
  /** کد طرح – maps to order.code */
  designCode: string;
  /** توضیحات – maps to order.description */
  description: string;
  /** تاچ دارد – maps to order.lightThread */
  touchHas: boolean;
  /** لوگو دارد – maps to order.logo */
  logoHas: boolean;
  /** پیوست دارد */
  attachmentHas: boolean;
  /** آینه بک لایت – کد محصول, maps to order.backLight */
  backLightCode: string;
  /** رنگ نور – backLight */
  lightColor: string;
  /** پد ضد بخار */
  antifogHas: boolean;
  /** توضیحات بک لایت */
  backLightDescription: string;
}>;

const defaultValues: Required<MirrorOrderFormInitialValues> = {
  customerName: "",
  workOrder: "",
  date: "",
  startDate: "",
  endDate: "",
  thickness: "6",
  height: "",
  width: "",
  shape: "",
  mirrorColor: "",
  count: "",
  toolType: "cut",
  other: "",
  cornerHas: false,
  cornerR: "",
  sandblastHas: false,
  designCode: "",
  description: "",
  touchHas: false,
  logoHas: false,
  attachmentHas: false,
  backLightCode: "",
  lightColor: "",
  antifogHas: false,
  backLightDescription: "",
};

export interface MirrorOrderFormProps {
  /** Optional initial values (e.g. from Order) to pre-fill the form */
  initialValues?: MirrorOrderFormInitialValues;
  /** Called when user clicks PDF export; receives the form content element to export. May return a Promise. */
  onExportPdf?: (element: HTMLElement) => void | Promise<void>;
  className?: string;
}

export function MirrorOrderForm({
  initialValues,
  onExportPdf,
  className,
}: MirrorOrderFormProps) {
  const [values, setValues] = useState<Required<MirrorOrderFormInitialValues>>(() => ({
    ...defaultValues,
    ...initialValues,
  }));
  const [isExporting, setIsExporting] = useState(false);
  const [compactForPdf, setCompactForPdf] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Required<MirrorOrderFormInitialValues>>(
    key: K,
    value: Required<MirrorOrderFormInitialValues>[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const compact = compactForPdf;

  const handleExportPdf = async () => {
    if (!contentRef.current || !onExportPdf) return;
    setIsExporting(true);
    try {
      setCompactForPdf(true);
      await new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r())),
      );
      await onExportPdf(contentRef.current);
    } finally {
      setCompactForPdf(false);
      setIsExporting(false);
    }
  };

  return (
    <div className={cn("w-full max-w-[900px] min-w-0 rounded-xl border border-border bg-layer shadow-md overflow-hidden", className)} dir="rtl">
      <div ref={contentRef} className={cn(compact && "w-[680px]")}>
      <div className={cn("bg-muted/30 border-b border-border", compact ? "px-3 py-2" : "px-6 py-5")}>
        <h2 className={cn("font-semibold text-foreground", compact ? "text-sm" : "text-lg")}>فرم سفارش آینه</h2>
        {!compact && <p className="text-sm text-muted-foreground mt-0.5">مشخصات و ویژگی‌های سفارش را وارد کنید</p>}
      </div>

      <div className={cn(compact ? "p-3 space-y-2" : "p-6 space-y-6")}>
      {/* Customer and Order Information */}
      <section className={cn(compact ? "space-y-1.5" : "space-y-4")}>
        <SectionTitle as="h3" className={cn("font-semibold text-foreground border-b border-border/60", compact ? "text-xs pb-0.5" : "text-base pb-1")}>
          اطلاعات سفارش و مشتری
        </SectionTitle>
        <div className={cn("grid grid-cols-1 sm:grid-cols-3", compact ? "gap-2" : "gap-4")}>
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-medium">نام مشتری</Label>
            <Input
              value={values.customerName}
              onChange={(e) => set("customerName", e.target.value)}
              placeholder="نام مشتری"
              className={inputUnderlineClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-medium">شماره سفارش</Label>
            <Input
              value={values.workOrder}
              onChange={(e) => set("workOrder", e.target.value)}
              placeholder="شماره سفارش"
              className={inputUnderlineClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-medium">تاریخ</Label>
            <Input
              value={values.date || values.startDate}
              onChange={(e) => set("date", e.target.value)}
              placeholder="تاریخ"
              className={inputUnderlineClass}
            />
          </div>
        </div>
      </section>

      {/* Mirror Specifications */}
      <section className={cn(compact ? "space-y-1.5" : "space-y-4")}>
        <SectionTitle as="h3" className={cn("font-semibold text-foreground border-b border-border/60", compact ? "text-xs pb-0.5" : "text-base pb-1")}>
          مشخصات آینه
        </SectionTitle>
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", compact ? "gap-2" : "gap-4")}>
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-medium">ضخامت</Label>
            <div className="flex gap-2 flex-wrap">
              <RadioOption
                name="thickness"
                id="thick-6"
                checked={values.thickness === "6"}
                onChange={() => set("thickness", "6")}
                label="6mm"
              />
              <RadioOption
                name="thickness"
                id="thick-4"
                checked={values.thickness === "4"}
                onChange={() => set("thickness", "4")}
                label="4mm"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-medium">سایز (cm)</Label>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">ارتفاع</Label>
                <Input
                  type="number"
                  step={0.1}
                  value={values.height}
                  onChange={(e) => set("height", e.target.value)}
                  className={cn("w-20 text-center", inputUnderlineClass)}
                />
              </div>
              <span className="text-muted-foreground">×</span>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">عرض</Label>
                <Input
                  type="number"
                  step={0.1}
                  value={values.width}
                  onChange={(e) => set("width", e.target.value)}
                  className={cn("w-20 text-center", inputUnderlineClass)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-medium">تعداد</Label>
            <Input
              type="number"
              min={1}
              value={values.count}
              onChange={(e) => set("count", e.target.value)}
              placeholder="تعداد"
              className={inputUnderlineClass}
            />
          </div>
        </div>
        <div className={cn("grid grid-cols-1 sm:grid-cols-2", compact ? "gap-2" : "gap-4")}>
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-medium">شکل هندسی</Label>
            <Input
              value={values.shape}
              onChange={(e) => set("shape", e.target.value)}
              placeholder="شکل هندسی"
              className={inputUnderlineClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-medium">رنگ آینه</Label>
            <Input
              value={values.mirrorColor}
              onChange={(e) => set("mirrorColor", e.target.value)}
              placeholder="رنگ آینه"
              className={inputUnderlineClass}
            />
          </div>
        </div>
      </section>

      {/* Edge Processing */}
      <section className={cn(compact ? "space-y-1.5" : "space-y-4")}>
        <SectionTitle as="h3" className={cn("font-semibold text-foreground border-b border-border/60", compact ? "text-xs pb-0.5" : "text-base pb-1")}>
          پردازش لبه
        </SectionTitle>
        <div className={cn("flex flex-col", compact ? "gap-2" : "gap-4")}>
          <div>
            <Label className={cn("text-muted-foreground font-medium block", compact ? "text-[10px] mb-1" : "text-xs mb-2")}>نوع ابزار</Label>
            <div className={cn("flex flex-wrap gap-1 rounded-lg bg-muted/20 border border-border/50", compact ? "p-1" : "p-2")}>
              {[
                { id: "tool-cut", value: "cut" as const, label: "فقط برش" },
                { id: "tool-bevel", value: "bevel" as const, label: "تراش" },
                { id: "tool-matte", value: "matte" as const, label: "لول مات" },
                { id: "tool-polished", value: "polished" as const, label: "لول براق" },
              ].map(({ id, value, label }) => (
                <RadioOption
                  key={id}
                  name="tool-type"
                  id={id}
                  checked={values.toolType === value}
                  onChange={() => set("toolType", value)}
                  label={label}
                />
              ))}
            </div>
          </div>
          <div className={cn("grid grid-cols-1 sm:grid-cols-2", compact ? "gap-2" : "gap-4")}>
            <div className="flex flex-col gap-1.5">
              <Label className="text-muted-foreground text-xs font-medium">سایر</Label>
              <Input
                value={values.other}
                onChange={(e) => set("other", e.target.value)}
                placeholder="سایر توضیحات"
                className={inputUnderlineClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-muted-foreground text-xs font-medium">گوشه (R)</Label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-1">
                  <CheckOption
                    id="corner-has"
                    checked={values.cornerHas}
                    onChange={(v) => set("cornerHas", v)}
                    label="دارد"
                  />
                  <CheckOption
                    id="corner-not"
                    checked={!values.cornerHas}
                    onChange={(v) => set("cornerHas", !v)}
                    label="ندارد"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">اندازه (mm)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={values.cornerR}
                    onChange={(e) => set("cornerR", e.target.value)}
                    placeholder=""
                    className={cn("w-16 text-center", inputUnderlineClass)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Features – two columns */}
      <section className={cn("min-w-0", compact ? "space-y-1.5" : "space-y-4")}>
        <SectionTitle as="h3" className={cn("font-semibold text-foreground border-b border-border/60", compact ? "text-xs pb-0.5" : "text-base pb-1")}>
          ویژگی‌های ویژه
        </SectionTitle>
        <div className={cn("grid grid-cols-1 lg:grid-cols-[1fr_2px_1fr] gap-0 rounded-xl border border-border bg-muted/10 overflow-hidden min-w-0", compact ? "p-2" : "p-5")}>
          <div className={cn("flex flex-col min-w-0", compact ? "gap-2" : "gap-4")}>
            <div>
              <Label className={cn("text-muted-foreground font-medium block", compact ? "text-[10px] mb-1" : "text-xs mb-2")}>سند بلاست</Label>
              <div className="flex gap-1">
                <CheckOption id="sandblast-has" checked={values.sandblastHas} onChange={(v) => set("sandblastHas", v)} label="دارد" />
                <CheckOption id="sandblast-not" checked={!values.sandblastHas} onChange={(v) => set("sandblastHas", !v)} label="ندارد" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className={cn("text-muted-foreground font-medium", compact ? "text-[10px]" : "text-xs")}>کد طرح</Label>
              <Input
                type="number"
                min={1}
                value={values.designCode}
                onChange={(e) => set("designCode", e.target.value)}
                placeholder="کد طرح"
                className={cn("border border-border rounded-md", compact ? "h-7 text-xs" : "h-9")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className={cn("text-muted-foreground font-medium", compact ? "text-[10px]" : "text-xs")}>توضیحات</Label>
              <Textarea
                value={values.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="توضیحات تکمیلی"
                className={cn("rounded-md border-border resize-y", compact ? "min-h-[44px] text-xs" : "min-h-[100px]")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className={cn("text-muted-foreground font-medium", compact ? "text-[10px]" : "text-xs")}>اتود دستی</Label>
              <div className={cn("rounded-lg border border-dashed border-border bg-muted/20 flex items-center justify-center", compact ? "min-h-[40px]" : "min-h-[100px]")}>
                <span className={cn("text-muted-foreground", compact ? "text-[10px]" : "text-xs")}>محل قرارگیری طرح یا اسکچ</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block w-px bg-border self-stretch shrink-0" />
          <div className={cn("flex flex-col min-w-0 border-t lg:border-t-0 border-border", compact ? "gap-2" : "gap-4")}>
            <div>
              <Label className={cn("text-muted-foreground font-medium block", compact ? "text-[10px] mb-1" : "text-xs mb-2")}>تاچ</Label>
              <div className="flex gap-1">
                <CheckOption id="touch-has" checked={values.touchHas} onChange={(v) => set("touchHas", v)} label="دارد" />
                <CheckOption id="touch-not" checked={!values.touchHas} onChange={(v) => set("touchHas", !v)} label="ندارد" />
              </div>
              <p className={cn("text-muted-foreground", compact ? "mt-0.5 text-[10px]" : "mt-1.5 text-xs")}>نوع تاچ: فول نمایشگردار · موقعیت: پایین وسط</p>
            </div>
            <div>
              <Label className={cn("text-muted-foreground font-medium block", compact ? "text-[10px] mb-1" : "text-xs mb-2")}>لوگو</Label>
              <div className="flex gap-1">
                <CheckOption id="logo-has" checked={values.logoHas} onChange={(v) => set("logoHas", v)} label="دارد" />
                <CheckOption id="logo-not" checked={!values.logoHas} onChange={(v) => set("logoHas", !v)} label="ندارد" />
              </div>
              <p className={cn("text-muted-foreground", compact ? "mt-0.5 text-[10px]" : "mt-1.5 text-xs")}>نوع لوگو: Enzo · موقعیت: بالا وسط</p>
            </div>
            <div>
              <Label className={cn("text-muted-foreground font-medium block", compact ? "text-[10px] mb-1" : "text-xs mb-2")}>پیوست نقشه / عکس</Label>
              <div className="flex gap-1">
                <CheckOption id="attach-has" checked={values.attachmentHas} onChange={(v) => set("attachmentHas", v)} label="دارد" />
                <CheckOption id="attach-not" checked={!values.attachmentHas} onChange={(v) => set("attachmentHas", !v)} label="ندارد" />
              </div>
            </div>
            <div className={cn("border-t border-border", compact ? "pt-2" : "pt-4")}>
              <Label className={cn("font-medium block", compact ? "text-foreground text-[10px] mb-2" : "text-foreground text-xs mb-3")}>آینه بک لایت (محصول کامل)</Label>
              <div className={cn(compact ? "space-y-2" : "space-y-3")}>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-muted-foreground text-xs">کد محصول</Label>
                  <Input
                    value={values.backLightCode}
                    onChange={(e) => set("backLightCode", e.target.value)}
                    placeholder="کد محصول"
                    className={inputUnderlineClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-muted-foreground text-xs">رنگ نور</Label>
                    <Input
                      value={values.lightColor}
                      onChange={(e) => set("lightColor", e.target.value)}
                      placeholder="رنگ نور"
                      className={inputUnderlineClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-muted-foreground text-xs">پد ضد بخار</Label>
                    <div className="flex gap-1">
                      <CheckOption id="antifog-has" checked={values.antifogHas} onChange={(v) => set("antifogHas", v)} label="دارد" />
                      <CheckOption id="antifog-not" checked={!values.antifogHas} onChange={(v) => set("antifogHas", !v)} label="ندارد" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-muted-foreground text-xs">توضیحات</Label>
                  <Input
                    value={values.backLightDescription}
                    onChange={(e) => set("backLightDescription", e.target.value)}
                    placeholder="توضیحات بک لایت"
                    className={inputUnderlineClass}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>
      </div>
      {onExportPdf && (
        <div className="pt-4 border-t border-border px-6 pb-6">
          <Button variant="primary" onClick={handleExportPdf} isLoading={isExporting}>
            خروجی PDF
          </Button>
        </div>
      )}
    </div>
  );
}
