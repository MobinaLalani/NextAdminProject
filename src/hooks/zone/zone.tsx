import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ZoneData {
  ZoneTitle: string;
  ZoneStatus: number;
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
