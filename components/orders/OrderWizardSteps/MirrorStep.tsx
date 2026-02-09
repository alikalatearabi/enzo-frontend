"use client";

import { formatPersianCurrency } from "../../../lib/utils/numbers";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { BodyText } from "../../ui/typography";
import { StepProps } from "./types";

type MirrorTemplate = {
  id: string;
  name: string;
  shapeName: string;
  price?: number;
  picture?: {
    url: string;
  };
};

type MirrorStepProps = StepProps & {
  mirrors: MirrorTemplate[];
  onMirrorSelect: (mirrorId: string) => void;
};

export function MirrorStep({
  data,
  errors,
  setField,
  mirrors,
  onMirrorSelect,
}: MirrorStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-4">
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

      <div className="flex flex-col gap-4">
        {errors.mirror && (
          <BodyText className="text-sm text-red-500">
            {errors.mirror}
          </BodyText>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mirrors.map((mirror) => {
            const isSelected = data.mirror === mirror.id;
            return (
              <button
                key={mirror.id}
                type="button"
                onClick={() => onMirrorSelect(mirror.id)}
                className={`group relative flex flex-col overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]"
                    : "border-border bg-layer hover:border-primary/50 hover:shadow-md hover:scale-[1.01]"
                }`}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-layer-hover to-layer">
                  {mirror.picture?.url ? (
                    <img
                      src={mirror.picture.url}
                      alt={mirror.name}
                      className={`h-full w-full object-cover transition-transform duration-300 ${
                        isSelected ? "scale-105" : "group-hover:scale-110"
                      }`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const placeholder = target.nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-layer-hover/80 to-layer-hover/60 backdrop-blur-sm ${
                      mirror.picture?.url ? "hidden" : "flex"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="rounded-full bg-layer p-4 shadow-inner">
                        <svg
                          className="h-10 w-10"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-medium">تصویر آینه</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/50 ring-2 ring-primary/20">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 bg-primary/0 transition-colors duration-200 ${
                      isSelected ? "bg-primary/5" : "group-hover:bg-primary/5"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-2 p-5 text-right">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-bold text-foreground">
                      {mirror.name}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {mirror.shapeName}
                    </span>
                  </div>
                  {mirror.price && (
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-sm font-semibold text-primary">
                        {formatPersianCurrency(mirror.price)}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

