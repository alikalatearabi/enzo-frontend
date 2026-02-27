import { CreateInvoicePayload, invoiceApi } from "@/lib/api/invoice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateInvoicePayload) => invoiceApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
        },
    })
}

export function useInvoices() {
    return useQuery({
        queryKey: ["invoices"],
        queryFn: () => invoiceApi.getAll(),
    })
}

export function useInvoice(id: string | null) {
    return useQuery({
        queryKey: ["invoices", id],
        queryFn: () => invoiceApi.getById(id as string),
        enabled: !!id,
    })
}

export function useDeleteInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => invoiceApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
        },
    });
}