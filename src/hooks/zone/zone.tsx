import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ZoneData {
  ZoneTitle: string;
  ZoneStatus: number;
  NodeIds?: number[];
}
export function useUpdateZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ZoneData }) => {
      const res = await fetch(`/api/zone/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update zone");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}

export function useDeleteZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/zone/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete zone");
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}




export function useCreateZone() {
  return useMutation({
    mutationFn: async (data: ZoneData) => {
      const res = await fetch("/api/zone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "خطا در ایجاد زون");
      }

      return res.json();
    },
    onError: (error: any) => {
      console.error("❌ خطا در ایجاد زون:", error);
      throw error;
    },
  });
}
