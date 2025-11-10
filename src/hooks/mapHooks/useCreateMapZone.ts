import { useMutation } from "@tanstack/react-query";

export function useCreateMapZone() {
  return useMutation({
    mutationFn: async (newZone: {
      Title: string;
      statusId: number;
      nodes: number[];
    }) => {
      const res = await fetch("/api/mapzone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newZone),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create zone");
      return data;
    },
  });
}
