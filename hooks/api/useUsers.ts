"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  User,
  UserRole,
  usersApi,
  type CreateUserPayload,
} from "@/lib/api/users";

export function useUsers(role?: UserRole) {
  const query = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
  });

  const filtered = useMemo(() => {
    if (!query.data) return [];
    if (!role) return query.data;
    return query.data.filter((user) => user.role === role);
  }, [query.data, role]);

  return {
    ...query,
    data: filtered,
  };
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

