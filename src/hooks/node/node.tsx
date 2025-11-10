import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface NodeData {
  Title: string;
  Latitude: number;
  Longitude: number;
  statusId: number;
}

export interface MapNode extends NodeData {
  Id: string;
}

// --------------------
// Fetch Nodes
// --------------------
export function useNodes() {
  return useQuery<MapNode[], Error>({
    queryKey: ["nodes"],
    queryFn: async () => {
      const res = await fetch("/api/node");
      if (!res.ok) throw new Error("Failed to fetch nodes");
      return res.json();
    },
    staleTime: 1000 * 60 * 2, // 2 دقیقه
  });
}

// --------------------
// Create Node
// --------------------
export function useCreateNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NodeData) => {
      const res = await fetch("/api/node", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create node");
      return result;
    },
    onSuccess: () => {
      // رفرش داده‌های نود
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
    },
  });
}

// --------------------
// Update Node
// --------------------
export function useUpdateNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: NodeData }) => {
      const res = await fetch(`/api/node/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update node");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
    },
  });
}

// --------------------
// Delete Node
// --------------------
export function useDeleteNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/node/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete node");
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
    },
  });
}
