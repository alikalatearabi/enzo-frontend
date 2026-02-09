"use client";

import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { CustomSelect } from "../../ui/custom-select";
import { BodyText, MutedText } from "../../ui/typography";
import { StepProps } from "./types";

type FeatureOption = {
  id: string;
  name: string;
};

type MirrorComponentsStepProps = StepProps & {
  lightThreadOptions: FeatureOption[];
  backLightOptions: FeatureOption[];
  zoomOptions: FeatureOption[];
  thicknessOptions: FeatureOption[];
  moduleOptions: FeatureOption[];
  onToggleModule: (moduleId: string) => void;
};

export function MirrorComponentsStep({
  data,
  errors,
  setField,
  lightThreadOptions,
  backLightOptions,
  zoomOptions,
  thicknessOptions,
  moduleOptions,
  onToggleModule,
}: MirrorComponentsStepProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="lightThread" requiredMarker>
          نخ نوری
        </Label>
        <CustomSelect
          value={data.lightThread ?? ""}
          onChange={(value) => setField("lightThread", value)}
          options={[
            { value: "", label: "انتخاب نخ نوری" },
            ...lightThreadOptions.map((thread) => ({
              value: thread.id,
              label: thread.name,
            })),
          ]}
          placeholder="انتخاب نخ نوری"
        />
        {errors.lightThread && (
          <BodyText className="text-xs text-red-500">
            {errors.lightThread}
          </BodyText>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="backLight">نور پس‌زمینه</Label>
        <CustomSelect
          value={data.backLight ?? ""}
          onChange={(value) => setField("backLight", value)}
          options={[
            { value: "", label: "هیچکدام" },
            ...backLightOptions.map((backLight) => ({
              value: backLight.id,
              label: backLight.name,
            })),
          ]}
          placeholder="هیچکدام"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="zoom">زوم</Label>
        <CustomSelect
          value={data.zoom ?? ""}
          onChange={(value) => setField("zoom", value)}
          options={[
            { value: "", label: "هیچکدام" },
            ...zoomOptions.map((zoom) => ({
              value: zoom.id,
              label: zoom.name,
            })),
          ]}
          placeholder="هیچکدام"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="thickness" requiredMarker>
          ضخامت
        </Label>
        <CustomSelect
          value={data.thickness ?? ""}
          onChange={(value) => setField("thickness", value)}
          options={[
            { value: "", label: "انتخاب ضخامت" },
            ...thicknessOptions.map((option) => ({
              value: option.id,
              label: option.name,
            })),
          ]}
          placeholder="انتخاب ضخامت"
        />
        {errors.thickness && (
          <BodyText className="text-xs text-red-500">
            {errors.thickness}
          </BodyText>
        )}
      </div>
    </div>
  );
}

