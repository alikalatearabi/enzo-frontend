import apiClient from "./client";

export const LogoPosition = {
  TOP_LEFT: "TOP_LEFT",
  TOP_CENTER: "TOP_CENTER",
  TOP_RIGHT: "TOP_RIGHT",
  CENTER_LEFT: "CENTER_LEFT",
  CENTER: "CENTER",
  CENTER_RIGHT: "CENTER_RIGHT",
  BOTTOM_LEFT: "BOTTOM_LEFT",
  BOTTOM_CENTER: "BOTTOM_CENTER",
  BOTTOM_RIGHT: "BOTTOM_RIGHT",
} as const;

export type LogoPositionValue = (typeof LogoPosition)[keyof typeof LogoPosition];

export type Logo = {
  id: string;
  logoType: string;
  active: boolean;
  position: LogoPositionValue;
};

export type CreateLogoPayload = {
  logoType?: string;
  active?: boolean;
  position?: LogoPositionValue;
};

export type UpdateLogoPayload = {
  logoType?: string;
  active?: boolean;
  position?: LogoPositionValue;
};

export const logoApi = {
  getAll: () => apiClient.get<Logo[]>("/logo"),
  getById: (id: string) => apiClient.get<Logo>(`/logo/${id}`),
  create: (payload: CreateLogoPayload) =>
    apiClient.post<Logo>("/logo", payload),
  update: (id: string, payload: UpdateLogoPayload) =>
    apiClient.put<Logo>(`/logo/${id}`, payload),
  remove: (id: string) => apiClient.delete<void>(`/logo/${id}`),
};
