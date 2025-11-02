"use client";

import { useEffect, useState } from "react";

interface MapNodeItem {
  Id: number;
  Title: string;
  Latitude: number;
  Longitude: number;
  statusId: number;
}

export default function MapNodePage() {
  const [nodes, setNodes] = useState<MapNodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/node") // مسیر جدید API
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
        setError("مشکلی در ارتباط با دیتابیس رخ داده است");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-500">در حال بارگذاری...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">لیست نقاط نقشه (Map Nodes)</h1>

      {nodes.length === 0 ? (
        <p>هیچ رکوردی یافت نشد.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Id</th>
              <th className="border px-4 py-2">عنوان</th>
              <th className="border px-4 py-2">عرض جغرافیایی (Latitude)</th>
              <th className="border px-4 py-2">طول جغرافیایی (Longitude)</th>
              <th className="border px-4 py-2">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => (
              <tr key={node.Id}>
                <td className="border px-4 py-2 text-center">{node.Id}</td>
                <td className="border px-4 py-2">{node.Title}</td>
                <td className="border px-4 py-2 text-center">{node.Latitude}</td>
                <td className="border px-4 py-2 text-center">{node.Longitude}</td>
                <td className="border px-4 py-2 text-center">
                  {node.statusId === 1 ? "فعال" : "غیرفعال"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
