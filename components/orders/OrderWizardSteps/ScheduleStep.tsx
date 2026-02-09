"use client";

import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { CustomSelect } from "../../ui/custom-select";
import { BodyText } from "../../ui/typography";
import { statusOptions } from "./constants";
import { StepProps } from "./types";

export function ScheduleStep({ data, errors, setField }: StepProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="startDate" requiredMarker>
          تاریخ شروع
        </Label>
        <Input
          id="startDate"
          type="date"
          value={data.startDate ?? ""}
          onChange={(event) => setField("startDate", event.target.value)}
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
        <Input
          id="endDate"
          type="date"
          value={data.endDate ?? ""}
          onChange={(event) => setField("endDate", event.target.value)}
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

