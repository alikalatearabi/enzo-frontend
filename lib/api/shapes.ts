import apiClient from "./client";

export type Shape = {
  id: string;
  name: string;
  deformed: boolean;
};

export const shapesApi = {
  getAll: () => apiClient.get<Shape[]>("/shapes"),
  getById: (id: string) => apiClient.get<Shape>(`/shapes/${id}`),
  create: (payload: { name: string; deformed: boolean }) =>
    apiClient.post<Shape>("/shapes", payload),
  update: (id: string, payload: { name: string; deformed: boolean }) =>
    apiClient.put<Shape>(`/shapes/${id}`, payload),
  remove: (id: string) => apiClient.delete<void>(`/shapes/${id}`),
};

