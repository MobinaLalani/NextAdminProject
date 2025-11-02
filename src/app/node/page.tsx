"use client";

import { useEffect, useState } from "react";

interface NodeItem {
  Id: number;
  Title: string;
  LocationWKT?: string | null;
  Address?: string | null;
  IsActive?: boolean;
}

export default function NodesPage() {
  const [nodes, setNodes] = useState<NodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/node") // دریافت داده‌ها از روت جدید
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setNodes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("خطا در دریافت داده‌ها:", err);
        setError("مشکل در دریافت اطلاعات دیتابیس");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-500">در حال بارگذاری...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">لیست نودها</h1>

      {nodes.length === 0 ? (
        <p>هیچ رکوردی پیدا نشد.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Id</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Location (WKT)</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => (
              <tr key={node.Id}>
                <td className="border px-4 py-2">{node.Id}</td>
                <td className="border px-4 py-2">{node.Title}</td>
                <td className="border px-4 py-2">{node.LocationWKT ?? "-"}</td>
                <td className="border px-4 py-2">{node.Address ?? "-"}</td>
                <td className="border px-4 py-2">{node.IsActive ? "بلی" : "خیر"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
