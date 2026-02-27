"use client";

import { useMemo } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { CustomSelect } from "../../ui/custom-select";
import { BodyText } from "../../ui/typography";
import { useUsers } from "@/hooks/api/useUsers";
import { useInvoices } from "@/hooks/api/useInvoince";
import { User } from "@/lib/api/users";
import { StepProps } from "./types";

const INVOICE_CHOICES = [
  { value: "new", label: "ایجاد صورت‌حساب جدید" },
  { value: "existing", label: "انتخاب صورت‌حساب موجود" },
] as const;

export function InvoiceStep({ data, errors, setField }: StepProps) {
  const { data: users = [] } = useUsers();
  const { data: invoices = [] } = useInvoices();

  const customers = useMemo(
    () => (users as User[]).filter((u) => u.role === "CUSTOMER"),
    [users],
  );
  const cutters = useMemo(
    () => (users as User[]).filter((u) => u.role === "CUTTER"),
    [users],
  );

  const invoiceOptions = useMemo(
    () =>
      invoices.map((inv) => ({
        value: inv.id,
        label: `${inv.invoiceNumber} - ${(inv.customer as { name?: string })?.name ?? ""}`,
      })),
    [invoices],
  );

  const choice = data.invoiceChoice ?? "new";

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <Label>نوع صورت‌حساب</Label>
        <CustomSelect
          value={choice}
          onChange={(value) =>
            setField("invoiceChoice", (value || "new") as "new" | "existing")
          }
          options={INVOICE_CHOICES.map((c) => ({ value: c.value, label: c.label }))}
        />
        {errors.invoiceChoice && (
          <BodyText className="text-xs text-red-500">
            {errors.invoiceChoice}
          </BodyText>
        )}
      </div>

      {choice === "existing" && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="selectedExistingInvoiceId" requiredMarker>
            صورت‌حساب موجود
          </Label>
          <CustomSelect
            value={data.selectedExistingInvoiceId ?? ""}
            onChange={(value) =>
              setField("selectedExistingInvoiceId", value || undefined)
            }
            options={[
              { value: "", label: "انتخاب صورت‌حساب" },
              ...invoiceOptions,
            ]}
          />
          {errors.selectedExistingInvoiceId && (
            <BodyText className="text-xs text-red-500">
              {errors.selectedExistingInvoiceId}
            </BodyText>
          )}
        </div>
      )}

      {choice === "new" && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="invoiceNumber" requiredMarker>
              شماره صورت‌حساب
            </Label>
            <Input
              id="invoiceNumber"
              type="text"
              inputMode="numeric"
              value={data.invoiceNumber ?? ""}
              onChange={(e) =>
                setField(
                  "invoiceNumber",
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
              placeholder="شماره صورت‌حساب"
            />
            {errors.invoiceNumber && (
              <BodyText className="text-xs text-red-500">
                {errors.invoiceNumber}
              </BodyText>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="customer" requiredMarker>
              مشتری
            </Label>
            <CustomSelect
              value={data.customer?._id ?? ""}
              onChange={(value) =>
                setField(
                  "customer",
                  (users as User[]).find((u) => u._id === value),
                )
              }
              options={[
                { value: "", label: "انتخاب مشتری" },
                ...customers.map((c) => ({ value: c._id, label: c.name })),
              ]}
            />
            {errors.customer && (
              <BodyText className="text-xs text-red-500">
                {errors.customer}
              </BodyText>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cutter" requiredMarker>
              برشکار
            </Label>
            <CustomSelect
              value={data.cutter?._id ?? ""}
              onChange={(value) =>
                setField(
                  "cutter",
                  (users as User[]).find((u) => u._id === value),
                )
              }
              options={[
                { value: "", label: "انتخاب برشکار" },
                ...cutters.map((c) => ({ value: c._id, label: c.name })),
              ]}
            />
            {errors.cutter && (
              <BodyText className="text-xs text-red-500">
                {errors.cutter}
              </BodyText>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
