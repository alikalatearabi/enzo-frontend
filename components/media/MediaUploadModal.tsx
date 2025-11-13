"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { BodyText, SectionTitle } from "../ui/typography";
import { useToast } from "../ui/feedback/ToastProvider";
import { MediaAsset } from "../../lib/mocks/media";

type MediaUploadModalProps = {
  onClose: () => void;
  onUpload: (asset: MediaAsset) => void;
};

export function MediaUploadModal({ onClose, onUpload }: MediaUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [bucket] = useState("mirrors");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setName(selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));
  };

  const handleUpload = () => {
    if (!file) {
      addToast({
        title: "Select a file first",
        description: "Choose an image to upload before continuing.",
        variant: "error",
      });
      return;
    }
    const fakeId = crypto.randomUUID();
    const asset: MediaAsset = {
      id: fakeId,
      name: name || file.name,
      filename: file.name,
      bucket,
      url: previewUrl ?? "",
      sizeKb: Math.round(file.size / 1024),
      uploadedBy: "mock.user",
      uploadedAt: new Date().toISOString(),
    };
    onUpload(asset);
    addToast({
      title: "Upload staged",
      description: "Replace this with POST /mirrors upload once backend is ready.",
      variant: "success",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-lg border border-border bg-layer p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <SectionTitle as="h3">Upload Media Asset</SectionTitle>
            <BodyText className="max-w-md text-sm">
              Simulates multipart upload to MinIO. Captured values are stored locally until API integration.
            </BodyText>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="mt-4 grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="media-file" requiredMarker>
              Asset
            </Label>
            <input
              ref={fileInputRef}
              id="media-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-muted-foreground"
            />
            <BodyText className="text-xs">
              Selected bucket: {bucket}. Future implementation will upload via multipart/form-data.
            </BodyText>
          </div>

          {previewUrl && (
            <div className="flex flex-col gap-2">
              <Label>Preview</Label>
              <div className="flex h-48 items-center justify-center rounded-md border border-border bg-layer-hover">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={180}
                  height={180}
                  className="h-40 w-40 object-contain"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="media-name">Display Name</Label>
            <Input
              id="media-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ambient mirror hero"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}

