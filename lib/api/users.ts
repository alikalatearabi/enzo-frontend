import apiClient from "./client";

export type UserRole = "CUSTOMER" | "CUTTER";

export type User = {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  role: UserRole;
};

export type CreateUserPayload = {
  name: string;
  phone: string;
  address?: string;
  role: UserRole;
};

export const usersApi = {
  getAll: () => apiClient.get<User[]>("/users"),
  getById: (id: string) => apiClient.get<User>(`/users/${id}`),
  create: (payload: CreateUserPayload) =>
    apiClient.post<User>("/users", payload),
};

