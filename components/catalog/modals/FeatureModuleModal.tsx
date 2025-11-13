"use client";

import { useMemo, useState } from "react";
import { FeatureModule } from "../../../lib/mocks/features";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select } from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { BodyText, SectionTitle } from "../../ui/typography";
import { useToast } from "../../ui/feedback/ToastProvider";

type FeatureModuleModalProps = {
  mode: "create" | "edit";
  feature?: FeatureModule;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    type: FeatureModule["type"];
    code?: string;
    layerCount?: number;
    notes?: string;
  }) => void;
  existingModules: FeatureModule[];
};

const typeOptions = [
  { value: "frame", label: "Frame" },
  { value: "lightThread", label: "Light Thread" },
  { value: "backLight", label: "Back Light" },
  { value: "zoom", label: "Zoom" },
  { value: "thickness", label: "Thickness" },
  { value: "sandblast", label: "Sandblast" },
  { value: "lol", label: "LOL" },
  { value: "mirrorModule", label: "Mirror Module" },
];

export function FeatureModuleModal({
  mode,
  feature,
  onClose,
  onSubmit,
  existingModules,
}: FeatureModuleModalProps) {
  const { addToast } = useToast();
  const [name, setName] = useState(feature?.name ?? "");
  const [type, setType] = useState(feature?.type ?? "frame");
  const [code, setCode] = useState(feature?.code ?? "");
  const [layerCount, setLayerCount] = useState(feature?.layerCount ?? 1);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const isDirty = useMemo(() => {
    if (!feature) return true;
    return (
      feature.name !== name ||
      feature.type !== type ||
      (feature.code ?? "") !== code ||
      (feature.layerCount ?? 1) !== layerCount ||
      notes.trim().length > 0
    );
  }, [feature, name, type, code, layerCount, notes]);

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) {
      nextErrors.name = "Feature name is required.";
    }
    if (!type) {
      nextErrors.type = "Type is required.";
    }
    if (layerCount <= 0) {
      nextErrors.layerCount = "Layer count must be greater than zero.";
    }
    const duplicate = existingModules.some(
      (module) =>
        module.name.toLowerCase() === name.toLowerCase() &&
        module.id !== feature?.id,
    );
    if (duplicate) {
      addToast({
        title: "Duplicate name",
        description: "Another feature module already uses this name.",
        variant: "error",
      });
      return;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      addToast({
        title: "Validation failed",
        description: "Resolve the highlighted issues before submitting.",
        variant: "error",
      });
      return;
    }
    setErrors({});
    onSubmit({
      name,
      type: type as FeatureModule["type"],
      code,
      layerCount,
      notes,
    });
    addToast({
      title: mode === "create" ? "Feature module created" : "Feature module updated",
      description: "Hook into POST/PUT /{module} endpoints in the future.",
      variant: "success",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-lg border border-border bg-layer p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <SectionTitle as="h3">
              {mode === "create" ? "Add Feature Module" : "Edit Feature Module"}
            </SectionTitle>
            <BodyText className="text-sm">
              Represents the payload for the module-specific DTO (e.g., POST /frames).
            </BodyText>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="mt-4 grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="feature-name" requiredMarker>
              Name
            </Label>
            <Input
              id="feature-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearFieldError("name");
              }}
              placeholder="Carbon Edge Frame"
            />
            {errors.name && (
              <BodyText className="text-xs text-red-500">
                {errors.name}
              </BodyText>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="feature-type" requiredMarker>
              Type
            </Label>
            <Select
              id="feature-type"
              value={type}
              onChange={(event) => {
                setType(event.target.value as FeatureModule["type"]);
                clearFieldError("type");
              }}
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <BodyText className="text-xs">
              Each type maps to its own REST resource (frames, lightThreads, etc.).
            </BodyText>
            {errors.type && (
              <BodyText className="text-xs text-red-500">
                {errors.type}
              </BodyText>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="feature-code">Code (optional)</Label>
              <Input
                id="feature-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="SB-FT-001"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="feature-layerCount">Layer Count</Label>
              <Input
                id="feature-layerCount"
                type="number"
                min={1}
                value={layerCount}
                onChange={(event) => {
                  setLayerCount(Number(event.target.value));
                  clearFieldError("layerCount");
                }}
              />
              {errors.layerCount && (
                <BodyText className="text-xs text-red-500">
                  {errors.layerCount}
                </BodyText>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="feature-notes">Notes</Label>
            <Textarea
              id="feature-notes"
              placeholder="Internal notes and dependencies."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isDirty}
          >
            {mode === "create" ? "Create Feature Module" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

