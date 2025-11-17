"use client";

import React from "react";
import AutoComplete from "@/components/ui/AutoComplete";
import TextField from "@/components/ui/TextField"; // مسیر درست TextField
import { NodeLabel } from "../../../../types/enums/node";

interface NodeFormProps {
  form: {
    Title: string;
    Latitude: number;
    Longitude: number;
    statusId: number;
    nodeLabels?: number[];
  };
  onChange: (name: string, value: string | number) => void;
  setForm: (form: any) => void;
  creatingNode: boolean;
}

export default function NodeForm({
  form,
  onChange,
  setForm,
  creatingNode,
}: NodeFormProps) {
  return (
    <div className="h-[80vh] p-5 space-y-4">
      <TextField
        label="عنوان"
        name="Title"
        placeholder="عنوان را وارد کنید"
        value={form.Title}
        onChange={(val) => onChange("Title", val)}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="عرض (Latitude)"
          name="Latitude"
          type="number"
          placeholder="مثال: 35.6892"
          value={form.Latitude}
          onChange={(val) => onChange("Latitude", Number(val))}
        />
        <TextField
          label="طول (Longitude)"
          name="Longitude"
          type="number"
          placeholder="مثال: 51.3890"
          value={form.Longitude}
          onChange={(val) => onChange("Longitude", Number(val))}
        />
      </div>

      <TextField
        label="وضعیت (1 فعال / 0 غیرفعال)"
        name="statusId"
        type="number"
        value={form.statusId}
        onChange={(val) => onChange("statusId", Number(val))}
      />

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
