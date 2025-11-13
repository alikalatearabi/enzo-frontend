 "use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { BodyText, MutedText, PageTitle, SectionSubtitle, SectionTitle } from "../../components/ui/typography";
import { useToast } from "../../components/ui/feedback/ToastProvider";
import { MediaUploadModal } from "../../components/media/MediaUploadModal";
import { useMediaUploads } from "../../hooks/media/useMediaUploads";

export default function MediaPage() {
  const { assets, addAsset, removeAsset } = useMediaUploads();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SectionSubtitle>Operations</SectionSubtitle>
        <PageTitle>Media Gallery</PageTitle>
        <BodyText className="max-w-2xl">
          Browse mirror images stored in MinIO. Uploading and image management are
          staged for future integration, so this view uses placeholder assets.
        </BodyText>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">Asset Overview</SectionTitle>
          <CardDescription>
            Media cards mimic final layout; replace with dynamic data when API hooks are ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-md border border-border bg-layer p-4"
            >
              <div className="flex h-36 items-center justify-center rounded-md border border-dashed border-border bg-surface">
                <Image
                  src={item.url}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="opacity-70"
                />
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-foreground">{item.name}</span>
                <MutedText>{item.filename}</MutedText>
                <MutedText>
                  Uploaded {new Date(item.uploadedAt).toLocaleDateString()} ·{" "}
                  {item.sizeKb} KB
                </MutedText>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="w-fit">
                  Preview
                </Button>
                <Button
                  variant="ghost"
                  className="w-fit"
                  onClick={() => {
                    removeAsset(item.id);
                    addToast({
                      title: "Asset removed",
                      description: "Replace with DELETE /media when API is available.",
                    });
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Upload Media
        </Button>
        <Button variant="ghost">Manage Buckets</Button>
      </div>

      {isModalOpen && (
        <MediaUploadModal
          onClose={() => setIsModalOpen(false)}
          onUpload={addAsset}
        />
      )}
    </section>
  );
}

