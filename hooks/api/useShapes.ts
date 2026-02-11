"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Shape, shapesApi } from "../../lib/api/shapes";

export function useShapes() {
  return useQuery<Shape[]>({
    queryKey: ["shapes"],
    queryFn: () => shapesApi.getAll(),
  });
}

export function useCreateShape() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; deformed: boolean }) =>
      shapesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shapes"] });
    },
  });
}

export function useUpdateShape() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: string;
      payload: { name: string; deformed: boolean };
    }) => shapesApi.update(params.id, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shapes"] });
    },
  });
}

export function useDeleteShape() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shapesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shapes"] });
    },
  });
}

