import apiClient from "./client";
import { User } from "./users";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  totalPrice: number;
  status: string;
  customer: User;
  cutter: User;
  createdAt: string;
  updatedAt: string;
};

export type CreateInvoicePayload = {
  invoiceNumber: string;
  customer: string; 
  cutter: string;
};


export const invoiceApi = {
    getAll: () => apiClient.get<Invoice[]>("/invoice"),
    getById: (id: string) => apiClient.get<Invoice>(`/invoice/${id}`),
    create: (payload: CreateInvoicePayload) =>
        apiClient.post<Invoice>("/invoice", payload),
    remove: (id: string) => apiClient.delete<void>(`/invoice/${id}`),
}