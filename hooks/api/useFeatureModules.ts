"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FeatureModule,
  getAllFeatureModules,
  createFeatureModule,
  updateFeatureModule,
  deleteFeatureModule,
  type CreateFeatureModulePayload,
  type UpdateFeatureModulePayload,
} from "../../lib/api/features";

export function useFeatureModules() {
  return useQuery<FeatureModule[]>({
    queryKey: ["feature-modules"],
    queryFn: () => getAllFeatureModules(),
  });
}

export function useCreateFeatureModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFeatureModulePayload) =>
      createFeatureModule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-modules"] });
    },
  });
}

export function useUpdateFeatureModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateFeatureModulePayload) =>
      updateFeatureModule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-modules"] });
    },
  });
}

export function useDeleteFeatureModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; type: FeatureModule["type"] }) =>
      deleteFeatureModule(params.id, params.type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-modules"] });
    },
  });
}

