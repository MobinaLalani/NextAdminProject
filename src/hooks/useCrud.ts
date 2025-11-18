import { useEffect, useState, useCallback } from "react";

interface UseCrudOptions<T> {
  endpoint: string; 
  autoFetch?: boolean; 
}

export function useCrud<T extends { Id: number }>({
  endpoint,
  autoFetch = true,
}: UseCrudOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to fetch data");
      const result = await res.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const createItem = useCallback(
    async (newItem: Omit<T, "Id">) => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed to create item");
      const created = await res.json();
      setData((prev) => [...prev, created]);
      return created;
    },
    [endpoint]
  );

  const updateItem = useCallback(
    async (id: number, updatedFields: Partial<T>) => {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) throw new Error("Failed to update item");
      const updated = await res.json();
      setData((prev) => prev.map((i) => (i.Id === id ? updated : i)));
      return updated;
    },
    [endpoint]
  );

  const deleteItem = useCallback(
    async (id: number) => {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      setData((prev) => prev.filter((i) => i.Id !== id));
    },
    [endpoint]
  );

  useEffect(() => {
    if (autoFetch) fetchAll();
  }, [fetchAll, autoFetch]);

  return { data, loading, error, fetchAll, createItem, updateItem, deleteItem };
}
