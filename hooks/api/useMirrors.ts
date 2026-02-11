"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Mirror,
  CreateMirrorPayload,
  UpdateMirrorPayload,
  mirrorsApi,
} from "../../lib/api/mirrors";

export function useMirrors() {
  return useQuery<Mirror[]>({
    queryKey: ["mirrors"],
    queryFn: () => mirrorsApi.getAll(),
  });
}

export function useCreateMirror() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMirrorPayload) => mirrorsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mirrors"] });
    },
  });
}

export function useUpdateMirror() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: string;
      payload: UpdateMirrorPayload;
    }) => mirrorsApi.update(params.id, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mirrors"] });
    },
  });
}

