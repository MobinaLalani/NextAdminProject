// components/map/NodeForm.tsx
"use client";

import React from "react";
import AutoComplete from "@/components/ui/AutoComplete";
import { NodeLabel } from "../../../../types/enums/node";

interface NodeFormProps {
  form: {
    Title: string;
    Latitude: number;
    Longitude: number;
    statusId: number;
    nodeLabels?: number[]; 
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setForm: (form: any) => void;
  creatingNode: boolean;
}

export default function NodeForm({
  form,
  onChange,
  setForm,
  creatingNode,
}: NodeFormProps) {
  console.log("form", form);
  return (
    <div className="h-[80vh] p-5">
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

      {/* AutoComplete for Node Labels */}
      <div className="mb-3">
        <label className="block mb-1">Node Labels</label>
        <AutoComplete
          placeholder="Select node labels"
          options={NodeLabel}
          value={form.nodeLabels}
          isMulty
          innerClassName="border border-gray-300 rounded-[12px]"
          className="my-3"
          onChange={(selected: number[]) =>
            setForm({ ...form, nodeLabels: selected })
          }
        />
      </div>
    </div>
  );
}
