"use client";

import { Label } from "../../ui/label";
import { CustomSelect } from "../../ui/custom-select";
import { Textarea } from "../../ui/textarea";
import { BodyText, MutedText } from "../../ui/typography";
import { StepProps } from "./types";

type ParticipantsStepProps = StepProps & {
  customers: Array<{ _id: string; name: string }>;
  cutters: Array<{ _id: string; name: string }>;
};

export function ParticipantsStep({
  data,
  errors,
  setField,
  customers,
  cutters,
}: ParticipantsStepProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="customer" requiredMarker>
          مشتری
        </Label>
        <CustomSelect
          value={data.customer ?? ""}
          onChange={(value) => setField("customer", value)}
          options={[
            { value: "", label: "انتخاب مشتری" },
            ...customers.map((customer) => ({
              value: customer._id,
              label: customer.name,
            })),
          ]}
          placeholder="انتخاب مشتری"
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
          value={data.cutter ?? ""}
          onChange={(value) => setField("cutter", value)}
          options={[
            { value: "", label: "انتخاب برشکار" },
            ...cutters.map((cutter) => ({
              value: cutter._id,
              label: cutter.name,
            })),
          ]}
          placeholder="انتخاب برشکار"
        />
        {errors.cutter && (
          <BodyText className="text-xs text-red-500">
            {errors.cutter}
          </BodyText>
        )}
      </div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <Label htmlFor="description">توضیحات</Label>
        <Textarea
          id="description"
          placeholder="یادداشت‌های اختیاری درباره الزامات سفارش"
          value={data.description ?? ""}
          onChange={(event) => setField("description", event.target.value)}
        />
      </div>
    </div>
  );
}

