"use client";

import DateObject from "react-date-object";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Label } from "../../ui/label";
import { CustomSelect } from "../../ui/custom-select";
import { BodyText } from "../../ui/typography";
import { statusOptions } from "./constants";
import { StepProps } from "./types";
import { toEnglishDigits } from "../../../lib/utils/numbers";
import "./persian-date-picker.css";

function toGregorianYYYYMMDD(date: DateObject | null): string | undefined {
  if (!date) return undefined;
  const d = new DateObject(date);
  if (!d.isValid) return undefined;
  d.convert(); // to Gregorian
  return toEnglishDigits(d.format("YYYY-MM-DD"));
}

function fromGregorianString(value: string | undefined): DateObject | undefined {
  if (!value) return undefined;
  const d = new DateObject(value);
  return d.isValid ? d : undefined;
}

export function ScheduleStep({ data, errors, setField }: StepProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="startDate" requiredMarker>
          تاریخ شروع
        </Label>
        <DatePicker
          id="startDate"
          calendar={persian}
          locale={persian_fa}
          value={fromGregorianString(data.startDate)}
          onChange={(d) => setField("startDate", toGregorianYYYYMMDD(d as DateObject | null))}
          format="YYYY/MM/DD"
          className="persian-date-picker rmdp-prime"
          containerClassName="w-full"
          inputClass="flex h-10 w-full rounded-md border border-border bg-layer px-3 text-sm text-foreground shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary outline-none placeholder:text-muted-foreground"
          placeholder="انتخاب تاریخ"
          calendarPosition="bottom-right"
        />
        {errors.startDate && (
          <BodyText className="text-xs text-red-500">
            {errors.startDate}
          </BodyText>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="endDate" requiredMarker>
          تاریخ پایان
        </Label>
        <DatePicker
          id="endDate"
          calendar={persian}
          locale={persian_fa}
          value={fromGregorianString(data.endDate)}
          onChange={(d) => setField("endDate", toGregorianYYYYMMDD(d as DateObject | null))}
          format="YYYY/MM/DD"
          className="persian-date-picker rmdp-prime"
          containerClassName="w-full"
          inputClass="flex h-10 w-full rounded-md border border-border bg-layer px-3 text-sm text-foreground shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary outline-none placeholder:text-muted-foreground"
          placeholder="انتخاب تاریخ"
          calendarPosition="bottom-right"
        />
        {errors.endDate && (
          <BodyText className="text-xs text-red-500">
            {errors.endDate}
          </BodyText>
        )}
      </div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <Label htmlFor="status" requiredMarker>
          وضعیت اولیه
        </Label>
        <CustomSelect
          value={data.status}
          onChange={(value) => setField("status", value)}
          options={statusOptions}
        />
      </div>
    </div>
  );
}

