"use client";

import { useEffect, useState } from "react";

interface ZoneNode {
  ZoneNodeId: number;
  ZoneId: number;
  ZoneTitle: string;
  ZoneStatus: number;
  NodeId: number;
  NodeTitle: string;
  Latitude: number;
  Longitude: number;
  NodeStatus: number;
}

export default function ZonePage() {
  const [data, setData] = useState<ZoneNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/zone", { cache: "no-store" });
        if (!res.ok) throw new Error("خطا در دریافت داده‌های زون");
        const json = await res.json();
        setData(json as ZoneNode[]);
      } catch (err: any) {
        setError(err.message || "خطای ناشناخته");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6">در حال بارگذاری...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">لیست زون‌ها و نودها</h1>
        <span className="text-sm text-gray-600">تعداد رکورد: {data.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">ZoneNodeId</th>
              <th className="border px-3 py-2">ZoneId</th>
              <th className="border px-3 py-2">عنوان زون</th>
              <th className="border px-3 py-2">وضعیت زون</th>
              <th className="border px-3 py-2">NodeId</th>
              <th className="border px-3 py-2">عنوان نود</th>
              <th className="border px-3 py-2">Latitude</th>
              <th className="border px-3 py-2">Longitude</th>
              <th className="border px-3 py-2">وضعیت نود</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.ZoneNodeId} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2 text-center">{row.ZoneNodeId}</td>
                <td className="border px-3 py-2 text-center">{row.ZoneId}</td>
                <td className="border px-3 py-2">{row.ZoneTitle}</td>
                <td className="border px-3 py-2 text-center">{row.ZoneStatus === 1 ? "فعال" : "غیرفعال"}</td>
                <td className="border px-3 py-2 text-center">{row.NodeId}</td>
                <td className="border px-3 py-2">{row.NodeTitle}</td>
                <td className="border px-3 py-2 text-center">{row.Latitude}</td>
                <td className="border px-3 py-2 text-center">{row.Longitude}</td>
                <td className="border px-3 py-2 text-center">{row.NodeStatus === 1 ? "فعال" : "غیرفعال"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}