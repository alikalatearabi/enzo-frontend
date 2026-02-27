import apiClient from "./client";

export type AccountingItemRo = {
  name: string;
  retailPrice: number;
  wholeSalePrice: number;
};

export type AccountingRo = {
  id: string;
  createdAt: string;
  updatedAt: string;
  items: Record<string, AccountingItemRo>;
};

export type AccountingItemDto = {
  name: string;
  retailPrice: number;
  wholeSalePrice: number;
};

export type AccountingDto = {
  items: Record<string, AccountingItemDto>;
};

export async function getAllAccountings(): Promise<AccountingRo[]> {
  const list = await apiClient.get<AccountingRo[]>("/accounting");
  return Array.isArray(list) ? list : [];
}

export async function getAccounting(id: string): Promise<AccountingRo | null> {
  try {
    return await apiClient.get<AccountingRo>(`/accounting/${id}`);
  } catch {
    return null;
  }
}

export async function createAccounting(payload: AccountingDto): Promise<AccountingRo> {
  return apiClient.post<AccountingRo>("/accounting", payload);
}

export async function updateAccounting(id: string, payload: AccountingDto): Promise<AccountingRo> {
  return apiClient.put<AccountingRo>(`/accounting/${id}`, payload);
}

export async function deleteAccounting(id: string): Promise<void> {
  await apiClient.delete(`/accounting/${id}`);
}
