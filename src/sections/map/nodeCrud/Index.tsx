// components/map/NodeForm.tsx
"use client";

import React from "react";

interface NodeFormProps {
  form: {
    Title: string;
    Latitude: number;
    Longitude: number;
    statusId: number;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  creatingNode: boolean;
}

export default function NodeForm({
  form,
  onChange,
  creatingNode,
}: NodeFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1">عنوان</label>
        <input
          name="Title"
          value={form.Title}
          onChange={onChange}
          className="border px-3 py-2 w-full rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">عرض (Latitude)</label>
          <input
            type="number"
            name="Latitude"
            value={form.Latitude}
            onChange={onChange}
            className="border px-3 py-2 w-full rounded"
            step="any"
          />
        </div>
        <div>
          <label className="block mb-1">طول (Longitude)</label>
          <input
            type="number"
            name="Longitude"
            value={form.Longitude}
            onChange={onChange}
            className="border px-3 py-2 w-full rounded"
            step="any"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1">وضعیت (1 فعال / 0 غیرفعال)</label>
        <input
          type="number"
          name="statusId"
          value={form.statusId}
          onChange={onChange}
          className="border px-3 py-2 w-full rounded"
          min={0}
          max={1}
        />
      </div>
    </div>
  );
}
