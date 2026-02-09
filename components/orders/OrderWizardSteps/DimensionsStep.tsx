"use client";

import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { BodyText } from "../../ui/typography";
import { StepProps } from "./types";

export function DimensionsStep({ data, errors, setField }: StepProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="count" requiredMarker>
          تعداد
        </Label>
        <Input
          id="count"
          type="number"
          min={1}
          value={data.count ?? ""}
          onChange={(event) => setField("count", Number(event.target.value))}
          placeholder="2"
        />
        {errors.count && (
          <BodyText className="text-xs text-red-500">
            {errors.count}
          </BodyText>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="height" requiredMarker>
          ارتفاع (سانتی‌متر)
        </Label>
        <Input
          id="height"
          type="number"
          min={1}
          value={data.height ?? ""}
          onChange={(event) => setField("height", Number(event.target.value))}
          placeholder="120"
        />
        {errors.height && (
          <BodyText className="text-xs text-red-500">
            {errors.height}
          </BodyText>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="width" requiredMarker>
          عرض (سانتی‌متر)
        </Label>
        <Input
          id="width"
          type="number"
          min={1}
          value={data.width ?? ""}
          onChange={(event) => setField("width", Number(event.target.value))}
          placeholder="80"
        />
        {errors.width && (
          <BodyText className="text-xs text-red-500">
            {errors.width}
          </BodyText>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="cornerBend">خم گوشه (میلی‌متر)</Label>
        <Input
          id="cornerBend"
          type="number"
          min={0}
          value={data.cornerBend ?? ""}
          onChange={(event) =>
            setField("cornerBend", Number(event.target.value))
          }
          placeholder="4"
        />
      </div>
    </div>
  );
}

