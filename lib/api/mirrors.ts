import apiClient from "./client";

export type Shape = {
  id: string;
  name: string;
  deformed: boolean;
};

export type Mirror = {
  id: string;
  name: string;
  price: number;
  /**
   * Picture URL as returned by the backend.
   * May be an empty string when no picture is set.
   */
  picture: string;
  shape: Shape;
};

export type CreateMirrorPayload = {
  name: string;
  shape: string;
  file: File;
};

export type UpdateMirrorPayload = {
  name?: string;
  shape?: string;
  file?: File;
};

export const mirrorsApi = {
  getAll: () => apiClient.get<Mirror[]>("/mirrors"),
  getById: (id: string) => apiClient.get<Mirror>(`/mirrors/${id}`),
  create: async (payload: CreateMirrorPayload): Promise<Mirror> => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("shape", payload.shape);
    formData.append("file", payload.file);
    return apiClient.postMultipart<Mirror>("/mirrors", formData);
  },
  update: async (
    id: string,
    payload: UpdateMirrorPayload,
  ): Promise<Mirror> => {
    const formData = new FormData();
    if (payload.name !== undefined) {
      formData.append("name", payload.name);
    }
    if (payload.shape !== undefined) {
      formData.append("shape", payload.shape);
    }
    if (payload.file !== undefined) {
      formData.append("file", payload.file);
    }
    return apiClient.putMultipart<Mirror>(`/mirrors/${id}`, formData);
  },
};

