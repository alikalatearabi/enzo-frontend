"use client";

import { cn } from "../../lib/utils/cn";

type StepStatus = "complete" | "current" | "upcoming";

export type WizardStep = {
  id: string;
  title: string;
  description: string;
  index: number;
  status: StepStatus;
};

type WizardStepperProps = {
  steps: WizardStep[];
  onStepClick?: (index: number) => void;
};

export function WizardStepper({ steps, onStepClick }: WizardStepperProps) {
  return (
    <ol className="grid gap-3 md:grid-cols-5 items-stretch">
      {steps.map((step) => (
        <li key={step.id} className="flex">
          <button
            type="button"
            className={cn(
              "flex w-full h-full flex-col gap-2 rounded-md border border-border px-4 py-3 text-right transition-colors min-h-[100px]",
              step.status === "current" && "border-primary bg-primary/5",
              step.status === "complete" && "border-primary/60 bg-primary/10",
              step.status === "upcoming" && "hover:bg-layer-hover",
            )}
            onClick={() => onStepClick?.(step.index)}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                step.status === "complete" && "bg-primary text-primary-foreground",
                step.status === "current" && "bg-primary text-primary-foreground",
                step.status === "upcoming" && "bg-layer-hover text-muted-foreground",
              )}
            >
              {step.index + 1}
            </span>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-semibold text-foreground">
                {step.title}
              </span>
              <span className="text-xs text-muted-foreground">{step.description}</span>
            </div>
          </button>
        </li>
      ))}
    </ol>
  );
}

