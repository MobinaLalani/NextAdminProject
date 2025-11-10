// components/map/ZoneForm.tsx

"use client";
import React, { useState, useEffect } from "react";
import { MapStore } from "@/store/mapStore";
import { MapPoint } from "../../../../types/maps";
import AutoComplete, { IDropDown } from "@/components/ui/AutoComplete";
import { useNodes } from "../../../hooks/node/node";

interface ZoneFormProps {
  zoneForm: {
    ZoneTitle: string;
    ZoneStatus: number;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ZoneForm({ zoneForm, onChange }: ZoneFormProps) {
  const { data: nodes, isLoading, error } = useNodes();
  const { zoneNodes, setZoneNodes } = MapStore();

  // مقدار اولیه selectedFruits از zoneNodes گرفته میشه
  const initialSelected = zoneNodes.map((item: any) => Number(item.id));
  const [selectedFruits, setSelectedFruits] =
    useState<number[]>(initialSelected);

  // وقتی zoneNodes در store تغییر کرد، selectedFruits هم آپدیت بشه
  useEffect(() => {
    const ids = zoneNodes.map((item: any) => Number(item.id));
    setSelectedFruits(ids);
  }, [zoneNodes]);

  // آماده کردن options برای AutoComplete
  const NodeDropDown: IDropDown[] =
    nodes?.map((item: any) => ({
      value: Number(item.Id),
      label: item.Title,
    })) || [];

const handleNodeChange = (vals: number[]) => {
  setSelectedFruits(vals);

  // ساخت آرایه کامل MapPoint
  const newZoneNodes: MapPoint[] =
    nodes
      ?.filter((node: any) => vals.includes(Number(node.Id)))
      .map((node: any) => ({
        id: String(node.Id),
        lat: node.Latitude, // مقدار واقعی خودت
        lng: node.Longitude, // مقدار واقعی خودت
        name: node.Title, // پر کردن فیلد name
        category: node.Category || "node", // پر کردن category، default می‌ذاریم
        status: node.Status || "active", // پر کردن status
      })) || [];

  setZoneNodes(newZoneNodes); // آپدیت Store
};
 console.log("zoneNodesZoneForm", zoneNodes);
  return (
    <div className="h-[80vh] p-5">
      <div className="mb-3">
        <label className="block mb-1">عنوان زون</label>
        <input
          name="ZoneTitle"
          value={zoneForm.ZoneTitle}
          onChange={onChange}
          className="border px-3 py-2 w-full rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1">وضعیت زون (1 فعال / 0 غیرفعال)</label>
        <input
          type="number"
          name="ZoneStatus"
          value={zoneForm.ZoneStatus}
          onChange={onChange}
          className="border px-3 py-2 w-full rounded"
          min={0}
          max={1}
        />
      </div>

      <div className="mb-3">
        <AutoComplete
          placeholder="Select nodes"
          options={NodeDropDown}
          value={selectedFruits}
          innerClassName="border border-gray-300 rounded-[12px]"
          className="my-3"
          isMulty
          onChange={handleNodeChange}
        />
      </div>
    </div>
  );
}
