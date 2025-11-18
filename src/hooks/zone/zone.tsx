import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ZoneCoord {
  nodeId: number;
  lng: number;
  lat: number;
}

export interface ZoneResponse {
  ZoneId: number; // 👈 جدید
  ZoneTitle: string;
  ZoneStatus: number;
  selectedNodeIds:
    [];
}


interface ZoneData {
  ZoneTitle: string;
  ZoneStatus: number;
  NodeIds?: number[];
}



export function useGetZone(id?: number, options?: { enabled?: boolean }) {
  return useQuery<ZoneResponse>({
    queryKey: ["zone", id],
    queryFn: async () => {
      const res = await fetch(`/api/zone/${id}`);
      if (!res.ok) throw new Error("Failed to fetch zone");
      return res.json();
    },
    enabled: !!id && options?.enabled !== false,
  });
}


export function useUpdateZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/zone/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), 
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update zone");
      return result.zone ?? result;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["zone", id] });
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
