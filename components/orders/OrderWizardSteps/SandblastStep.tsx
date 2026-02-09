"use client";

import { BodyText } from "../../ui/typography";
import { StepProps } from "./types";

type SandblastOption = {
  id: string;
  name: string;
  code?: string;
};

type SandblastStepProps = StepProps & {
  sandblastOptions: SandblastOption[];
};

export function SandblastStep({
  data,
  errors,
  setField,
  sandblastOptions,
}: SandblastStepProps) {
  return (
    <div className="flex flex-col gap-4">
      {errors.sandblast && (
        <BodyText className="text-sm text-red-500">
          {errors.sandblast}
        </BodyText>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => setField("sandblast", "")}
          className={`group relative flex flex-col overflow-hidden rounded-xl border-2 transition-all duration-200 ${
            !data.sandblast
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]"
              : "border-border bg-layer hover:border-primary/50 hover:shadow-md hover:scale-[1.01]"
          }`}
        >
          <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-layer-hover to-layer">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-layer-hover/80 to-layer-hover/60 backdrop-blur-sm">
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium">بدون سندبلاست</span>
              </div>
            </div>
            {!data.sandblast && (
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
                !data.sandblast ? "bg-primary/5" : "group-hover:bg-primary/5"
              }`}
            />
          </div>
          <div className="flex flex-col gap-2 p-5 text-right">
            <span className="text-base font-bold text-foreground">
              هیچکدام
            </span>
          </div>
        </button>
        {sandblastOptions.map((sandblast) => {
          const isSelected = data.sandblast === sandblast.id;
          return (
            <button
              key={sandblast.id}
              type="button"
              onClick={() => setField("sandblast", sandblast.id)}
              className={`group relative flex flex-col overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]"
                  : "border-border bg-layer hover:border-primary/50 hover:shadow-md hover:scale-[1.01]"
              }`}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-layer-hover to-layer">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-layer-hover/80 to-layer-hover/60 backdrop-blur-sm">
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
                    <span className="text-xs font-medium">تصویر سندبلاست</span>
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
                    {sandblast.name}
                  </span>
                  {sandblast.code && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {sandblast.code}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

