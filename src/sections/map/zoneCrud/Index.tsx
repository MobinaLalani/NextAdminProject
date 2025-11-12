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
    selectedNodeIds?: number[]; // اضافه کردیم
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFormChange?: (updatedForm: {
    ZoneTitle: string;
    ZoneStatus: number;
    selectedNodeIds: number[];
  }) => void; // callback برای ارسال کامل فرم
}

export default function ZoneForm({
  zoneForm,
  onChange,
  onFormChange,
}: ZoneFormProps) {
  const { data: nodes } = useNodes();
  const { zoneNodes, setZoneNodes } = MapStore();
  console.log("zoneForm", zoneForm);
  const initialSelected = zoneNodes.map((item: any) => Number(item.id));
  const [selectedFruits, setSelectedFruits] =
    useState<number[]>(initialSelected);

  useEffect(() => {
    const ids = zoneNodes.map((item: any) => Number(item.id));
    const uniqueIds = Array.from(new Set(ids));
    setSelectedFruits(uniqueIds);
    if (onFormChange) {
      onFormChange({
        ...zoneForm,
        selectedNodeIds: uniqueIds,
      });
    }
  }, [zoneNodes]);

  const NodeDropDown: IDropDown[] =
    nodes?.map((item: any) => ({
      value: Number(item.Id),
      label: item.Title,
    })) || [];

  const handleNodeChange = (vals: number[]) => {
    setSelectedFruits(vals);

    const newZoneNodes: MapPoint[] =
      nodes
        ?.filter((node: any) => vals.includes(Number(node.Id)))
        .map((node: any) => ({
          id: String(node.Id),
          lat: node.Latitude,
          lng: node.Longitude,
          name: node.Title,
          category: node.Category || "node",
          status: node.Status || "active",
        })) || [];

    setZoneNodes(newZoneNodes);

    // ارسال تغییرات به بیرون فرم
    if (onFormChange) {
      onFormChange({
        ...zoneForm,
        selectedNodeIds: vals,
      });
    }
  };

  return (
    {zoneForm}
    // <div className="h-[80vh] p-5">
    //   <div className="mb-3">
    //     <label className="block mb-1">عنوان زون</label>
    //     <input
    //       name="ZoneTitle"
    //       value={zoneForm.ZoneTitle}
    //       onChange={onChange}
    //       className="border px-3 py-2 w-full rounded"
    //     />
    //   </div>

    //   <div className="mb-3">
    //     <label className="block mb-1">وضعیت زون (1 فعال / 0 غیرفعال)</label>
    //     <input
    //       type="number"
    //       name="ZoneStatus"
    //       value={zoneForm.ZoneStatus}
    //       onChange={onChange}
    //       className="border px-3 py-2 w-full rounded"
    //       min={0}
    //       max={1}
    //     />
    //   </div>

    //   <div className="mb-3">
    //     <AutoComplete
    //       placeholder="Select nodes"
    //       options={NodeDropDown}
    //       value={selectedFruits}
    //       innerClassName="border border-gray-300 rounded-[12px]"
    //       className="my-3"
    //       isMulty
    //       onChange={handleNodeChange}
    //     />
    //   </div>
    // </div>
  );
}
