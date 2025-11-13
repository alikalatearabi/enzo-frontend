"use client";

import { useState } from "react";
import {
  FEATURE_MODULES,
  FeatureModule,
} from "../../lib/mocks/features";

type CreatePayload = {
  name: string;
  type: FeatureModule["type"];
  code?: string;
  layerCount?: number;
  notes?: string;
};

type UpdatePayload = CreatePayload & { id: string };

export function useFeatureModulesData() {
  const [modules, setModules] =
    useState<FeatureModule[]>(FEATURE_MODULES);

  const createModule = (payload: CreatePayload) => {
    const newModule: FeatureModule = {
      id: crypto.randomUUID(),
      name: payload.name,
      type: payload.type,
      code: payload.code,
      layerCount: payload.layerCount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setModules((prev) => [newModule, ...prev]);
    return newModule;
  };

  const updateModule = (payload: UpdatePayload) => {
    const updatedModule: FeatureModule = {
      id: payload.id,
      name: payload.name,
      type: payload.type,
      code: payload.code,
      layerCount: payload.layerCount,
      createdAt:
        modules.find((module) => module.id === payload.id)?.createdAt ??
        new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setModules((prev) =>
      prev.map((module) =>
        module.id === payload.id ? updatedModule : module,
      ),
    );
    return updatedModule;
  };

  return {
    modules,
    createModule,
    updateModule,
  };
}

