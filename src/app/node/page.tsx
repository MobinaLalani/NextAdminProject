"use client";

import { useCrud } from "@/hooks/useCrud";
import Link from "next/link";

interface MapNodeItem {
  Id: number;
  Title: string;
  Latitude: number;
  Longitude: number;
  statusId: number;
}

export default function MapNodePage() {
  const {
    data: nodes,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud<MapNodeItem>({ endpoint: "/api/node" });

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleAdd = async () => {
    await createItem({
      Title: "نقطه جدید",
      Latitude: 35.7,
      Longitude: 51.4,
      statusId: 1,
    });
  };

  const handleUpdate = async (id: number) => {
    await updateItem(id, { Title: "ویرایش شده ✅" });
  };

  const handleDelete = async (id: number) => {
    await deleteItem(id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">مدیریت نقاط نقشه</h1>
        <div className="flex gap-2">
          <Link
            href="/node/new"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            افزودن (صفحه)
          </Link>
          <button
            onClick={handleAdd}
            className="bg-green-500/80 text-white px-4 py-2 rounded"
          >
            افزودن سریع
          </button>
        </div>
      </div>

      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Id</th>
            <th className="border px-4 py-2">عنوان</th>
            <th className="border px-4 py-2">عرض</th>
            <th className="border px-4 py-2">طول</th>
            <th className="border px-4 py-2">وضعیت</th>
            <th className="border px-4 py-2">عملیات</th>
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
              <td className="border px-4 py-2 text-center space-x-2">
                <div className="inline-flex gap-2">
                  <Link
                    href={`/node/${node.Id}/edit`}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    ویرایش (صفحه)
                  </Link>
                  <button
                    onClick={() => handleUpdate(node.Id)}
                    className="bg-blue-500/80 text-white px-2 py-1 rounded"
                  >
                    ویرایش سریع
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(node.Id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
