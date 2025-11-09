"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface MapNodeItem {
  Id: number;
  Title: string;
  Latitude: number;
  Longitude: number;
  statusId: number;
}

export default function EditMapNodePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const [form, setForm] = useState<MapNodeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/node/${id}`);
        if (!res.ok) throw new Error("خطا در دریافت نود");
        const data = await res.json();
        setForm(data);
      } catch (err: any) {
        setError(err.message || "خطای ناشناخته");
      } finally {
        setLoading(false);
      }
    };
    if (!Number.isNaN(id)) load();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "Title" ? value : Number(value),
          }
        : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/node/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Title: form.Title,
          Latitude: form.Latitude,
          Longitude: form.Longitude,
          statusId: form.statusId,
        }),
      });
      if (!res.ok) throw new Error("خطا در ویرایش نود");
      await res.json();
      router.push("/node");
    } catch (err: any) {
      setError(err.message || "خطای ناشناخته");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">در حال بارگذاری...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!form) return <p className="p-6">مورد یافت نشد</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ویرایش نود #{id}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">عنوان</label>
          <input
            name="Title"
            value={form.Title}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">عرض (Latitude)</label>
            <input
              type="number"
              name="Latitude"
              value={form.Latitude}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
              step="any"
              required
            />
          </div>
          <div>
            <label className="block mb-1">طول (Longitude)</label>
            <input
              type="number"
              name="Longitude"
              value={form.Longitude}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
              step="any"
              required
            />
          </div>
        </div>
        <div>
          <label className="block mb-1">وضعیت</label>
          <input
            type="number"
            name="statusId"
            value={form.statusId}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {saving ? "در حال ذخیره..." : "ذخیره"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/node")}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            بازگشت
          </button>
        </div>
      </form>
    </div>
  );
}