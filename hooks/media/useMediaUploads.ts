"use client";

import { useMemo, useState } from "react";
import { MEDIA_ASSETS, MediaAsset } from "../../lib/mocks/media";

export function useMediaUploads() {
  const [assets, setAssets] = useState<MediaAsset[]>(MEDIA_ASSETS);
  const [isUploading, setIsUploading] = useState(false);

  const addAsset = (asset: MediaAsset) => {
    setAssets((prev) => [asset, ...prev]);
  };

  const removeAsset = (assetId: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== assetId));
  };

  const latestUploads = useMemo(
    () =>
      [...assets].sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      ),
    [assets],
  );

  return {
    assets: latestUploads,
    addAsset,
    removeAsset,
    isUploading,
    setIsUploading,
  };
}

