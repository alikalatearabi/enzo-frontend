"use client"

import { CreateInvoicePayload } from "@/lib/api/invoice";
import { useCreateInvoice, useInvoices } from "../api/useInvoince"

export const useInvoicesData = () => {
    const createInvoiceMutation = useCreateInvoice();
    const { data: invoices, isLoading, isError, error } = useInvoices();
    const createInvoice = async (payload: CreateInvoicePayload) => {
        return await createInvoiceMutation.mutateAsync(payload);
    };

    const invoicesData = invoices ?? [];

    return {
        invoices: invoicesData,
        isLoading,
        createInvoice,
        isCreating: createInvoiceMutation.isPending,
        isError: createInvoiceMutation.isError,
        error: createInvoiceMutation.error,
    }
}