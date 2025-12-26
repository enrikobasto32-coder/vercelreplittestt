import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type TransactionInput } from "@shared/routes";
import { z } from "zod";

// Helper to log validation errors
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    // In production, we might want to return a fallback or throw. 
    // Throwing ensures the error boundary catches it.
    throw result.error;
  }
  return result.data;
}

// GET /api/transactions
export function useTransactions() {
  return useQuery({
    queryKey: [api.transactions.list.path],
    queryFn: async () => {
      const res = await fetch(api.transactions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      return parseWithLogging(api.transactions.list.responses[200], data, "transactions.list");
    },
  });
}

// GET /api/stats
export function useStats() {
  return useQuery({
    queryKey: [api.transactions.stats.path],
    queryFn: async () => {
      const res = await fetch(api.transactions.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      return parseWithLogging(api.transactions.stats.responses[200], data, "transactions.stats");
    },
  });
}

// POST /api/transactions
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TransactionInput) => {
      // Validate input before sending (optional but good practice)
      const validatedInput = api.transactions.create.input.parse(data);
      
      const res = await fetch(api.transactions.create.path, {
        method: api.transactions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedInput),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.transactions.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create transaction");
      }
      return api.transactions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.transactions.stats.path] });
    },
  });
}

// DELETE /api/transactions/:id
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.transactions.delete.path, { id });
      const res = await fetch(url, {
        method: api.transactions.delete.method,
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Transaction not found");
        }
        throw new Error("Failed to delete transaction");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.transactions.stats.path] });
    },
  });
}
