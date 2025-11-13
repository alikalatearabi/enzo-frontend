"use client";

import { useEffect, useMemo, useState } from "react";
import { MirrorTemplate } from "../../lib/mocks/mirrors";
import { Shape, useMockShapes } from "../../lib/mocks/shapes";
import { useMockFeatureModules } from "../../lib/mocks/features";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { BodyText, SectionTitle } from "../ui/typography";
import { useToast } from "../ui/feedback/ToastProvider";

type MirrorDrawerProps = {
  mode: "create" | "edit";
  mirror?: MirrorTemplate;
  onClose: () => void;
};

export function MirrorDrawer({ mode, mirror, onClose }: MirrorDrawerProps) {
  const { data: shapes } = useMockShapes();
  const { data: features } = useMockFeatureModules();
  const { addToast } = useToast();
  const [name, setName] = useState(mirror?.name ?? "");
  const [shapeId, setShapeId] = useState(mirror?.shape ?? shapes[0]?.id ?? "");
  const [description, setDescription] = useState(mirror?.features ? "Prefilled features on load" : "");
  const [frame, setFrame] = useState(mirror?.features.frame ?? "");
  const [lightThread, setLightThread] = useState(mirror?.features.lightThread ?? "");
  const [backLight, setBackLight] = useState(mirror?.features.backLight ?? "");
  const [price, setPrice] = useState<number>(mirror?.price ?? 0);
  const [defaultHeight, setDefaultHeight] = useState<number>(mirror?.defaultHeight ?? 120);
  const [defaultWidth, setDefaultWidth] = useState<number>(mirror?.defaultWidth ?? 80);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mirror) {
      setName(mirror.name);
      setShapeId(mirror.shape);
      setFrame(mirror.features.frame ?? "");
      setLightThread(mirror.features.lightThread ?? "");
      setBackLight(mirror.features.backLight ?? "");
      setDefaultHeight(mirror.defaultHeight);
      setDefaultWidth(mirror.defaultWidth);
      setPrice(mirror.price ?? 0);
      setErrors({});
    }
  }, [mirror]);

  const frameOptions = features.filter((feature) => feature.type === "frame");
  const lightThreadOptions = features.filter((feature) => feature.type === "lightThread");
  const backLightOptions = features.filter((feature) => feature.type === "backLight");

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const isDirty = useMemo(() => {
    if (!mirror) return true;
    return (
      mirror.name !== name ||
      mirror.shape !== shapeId ||
      (mirror.features.frame ?? "") !== frame ||
      (mirror.features.lightThread ?? "") !== lightThread ||
      (mirror.features.backLight ?? "") !== backLight ||
      (mirror.price ?? 0) !== price ||
      mirror.defaultHeight !== defaultHeight ||
      mirror.defaultWidth !== defaultWidth ||
      description.trim().length > 0
    );
  }, [
    mirror,
    name,
    shapeId,
    frame,
    lightThread,
    backLight,
    price,
    defaultHeight,
    defaultWidth,
    description,
  ]);

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) {
      nextErrors.name = "Mirror name is required.";
    }
    if (!shapeId) {
      nextErrors.shape = "Shape selection is required.";
    }
    if (!frame) {
      nextErrors.frame = "Frame selection is required.";
    }
    if (!lightThread) {
      nextErrors.lightThread = "Light thread selection is required.";
    }
    if (defaultHeight <= 0) {
      nextErrors.height = "Height must be greater than zero.";
    }
    if (defaultWidth <= 0) {
      nextErrors.width = "Width must be greater than zero.";
    }
    if (price < 0) {
      nextErrors.price = "Price cannot be negative.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      addToast({
        title: "Validation failed",
        description: "Review highlighted fields before saving.",
        variant: "error",
      });
      return;
    }
    setErrors({});
    addToast({
      title: mode === "create" ? "Mirror created" : "Mirror updated",
      description: "Integrate POST/PUT /mirrors once backend is ready.",
      variant: "success",
    });
    onClose();
  };

  const getShapeName = (shapeId: string) =>
    shapes.find((shape) => shape.id === shapeId)?.name ?? "Unknown";

  return (
    <div className="fixed inset-0 z-40 flex items-stretch justify-end bg-black/40">
      <div className="flex h-full w-full max-w-xl flex-col gap-6 overflow-y-auto bg-layer p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <SectionTitle as="h3">
              {mode === "create" ? "Create Mirror Template" : "Edit Mirror Template"}
            </SectionTitle>
            <BodyText>
              Fields mirror the multipart form data DTO. Media upload will be added later.
            </BodyText>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="mirror-name" requiredMarker>
              Name
            </Label>
            <Input
              id="mirror-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearFieldError("name");
              }}
              placeholder="Luxury Oval Mirror"
            />
            {errors.name && (
              <BodyText className="text-xs text-red-500">{errors.name}</BodyText>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="mirror-shape" requiredMarker>
              Shape
            </Label>
            <Select
              id="mirror-shape"
              value={shapeId}
              onChange={(event) => {
                setShapeId(event.target.value);
                clearFieldError("shape");
              }}
            >
              {shapes.map((shape: Shape) => (
                <option key={shape.id} value={shape.id}>
                  {shape.name} {shape.deformed ? "(Deformed)" : ""}
                </option>
              ))}
            </Select>
            <BodyText className="text-xs">
              Currently selected: {getShapeName(shapeId)}
            </BodyText>
            {errors.shape && (
              <BodyText className="text-xs text-red-500">
                {errors.shape}
              </BodyText>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="mirror-height" requiredMarker>
                Default Height (cm)
              </Label>
              <Input
                id="mirror-height"
                type="number"
                value={defaultHeight}
              onChange={(event) => {
                setDefaultHeight(Number(event.target.value));
                clearFieldError("height");
              }}
              />
              {errors.height && (
                <BodyText className="text-xs text-red-500">
                  {errors.height}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mirror-width" requiredMarker>
                Default Width (cm)
              </Label>
              <Input
                id="mirror-width"
                type="number"
                value={defaultWidth}
              onChange={(event) => {
                setDefaultWidth(Number(event.target.value));
                clearFieldError("width");
              }}
              />
              {errors.width && (
                <BodyText className="text-xs text-red-500">
                  {errors.width}
                </BodyText>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="mirror-price">Reference Price ($)</Label>
            <Input
              id="mirror-price"
              type="number"
              value={price}
              onChange={(event) => {
                setPrice(Number(event.target.value));
                clearFieldError("price");
              }}
            />
            {errors.price && (
              <BodyText className="text-xs text-red-500">{errors.price}</BodyText>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="mirror-frame" requiredMarker>
                Default Frame
              </Label>
              <Select
                id="mirror-frame"
                value={frame}
              onChange={(event) => {
                setFrame(event.target.value);
                clearFieldError("frame");
              }}
              >
                <option value="" disabled>
                  Select frame
                </option>
                {frameOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </Select>
              {errors.frame && (
                <BodyText className="text-xs text-red-500">
                  {errors.frame}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mirror-lightThread" requiredMarker>
                Default Light Thread
              </Label>
              <Select
                id="mirror-lightThread"
                value={lightThread}
              onChange={(event) => {
                setLightThread(event.target.value);
                clearFieldError("lightThread");
              }}
              >
                <option value="" disabled>
                  Select light thread
                </option>
                {lightThreadOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </Select>
              {errors.lightThread && (
                <BodyText className="text-xs text-red-500">
                  {errors.lightThread}
                </BodyText>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mirror-backLight">Default Back Light</Label>
              <Select
                id="mirror-backLight"
                value={backLight}
                onChange={(event) => setBackLight(event.target.value)}
              >
                <option value="">None</option>
                {backLightOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="mirror-description">Internal Notes</Label>
            <Textarea
              id="mirror-description"
              placeholder="Optional description for operators."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isDirty}
          >
            {mode === "create" ? "Create Mirror" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

