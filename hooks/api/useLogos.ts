"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  logoApi,
  type Logo,
  type CreateLogoPayload,
  type UpdateLogoPayload,
} from "@/lib/api/logo";

export function useLogos() {
  return useQuery<Logo[]>({
    queryKey: ["logos"],
    queryFn: () => logoApi.getAll(),
  });
}

export function useCreateLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLogoPayload) => logoApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logos"] });
    },
  });
}

export function useUpdateLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLogoPayload }) =>
      logoApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logos"] });
    },
  });
}

export function useDeleteLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => logoApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logos"] });
    },
  });
}
