"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllAccountings,
  createAccounting,
  deleteAccounting,
  type AccountingDto,
} from "../../lib/api/accounting";

export function useAccountings() {
  return useQuery({
    queryKey: ["accountings"],
    queryFn: () => getAllAccountings(),
  });
}

export function useCreateAccounting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AccountingDto) => createAccounting(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountings"] });
    },
  });
}

export function useDeleteAccounting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAccounting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountings"] });
    },
  });
}
