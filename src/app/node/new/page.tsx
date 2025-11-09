"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewMapNodePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    Title: "",
    Latitude: 0,
    Longitude: 0,
    statusId: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "Title" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/node", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("خطا در ایجاد نود");
      await res.json();
      router.push("/node");
    } catch (err: any) {
      setError(err.message || "خطای ناشناخته");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">افزودن نود جدید</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">عنوان</label>
          <input
            name="Title"
            value={form.Title}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
            placeholder="عنوان"
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
            disabled={submitting}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "در حال ارسال..." : "ثبت"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/node")}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}