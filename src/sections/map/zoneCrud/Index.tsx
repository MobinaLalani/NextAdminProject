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
    selectedNodeIds?: number[];
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFormChange?: (updatedForm: {
    ZoneTitle: string;
    ZoneStatus: number;
    selectedNodeIds: number[];
  }) => void;
}

export default function ZoneForm({
  zoneForm,
  onChange,
  onFormChange,
}: ZoneFormProps) {
  const { data: nodes } = useNodes();
  const { setZoneNodes } = MapStore();

  const [selectedNodes, setSelectedNodes] = useState<number[]>([]);

  // -----------------------------
  //  ⬇️ مقداردهی اولیه از zoneForm
  // -----------------------------
  useEffect(() => {
    if (zoneForm?.selectedNodeIds) {
      setSelectedNodes(zoneForm.selectedNodeIds);

      // اینجا mapStore را نیز مقداردهی می‌کنیم
      if (nodes) {
        const newZoneNodes = nodes
          .filter((node: any) =>
            zoneForm.selectedNodeIds?.includes(Number(node.Id))
          )
          .map((node: any) => ({
            id: String(node.Id),
            lat: node.Latitude,
            lng: node.Longitude,
            name: node.Title,
            category: node.Category || "node",
            status: node.Status || "active",
          })) as MapPoint[];

        setZoneNodes(newZoneNodes);
      }
    }
  }, [zoneForm, nodes]);

  // -----------------------------
  //  ⬇️ dropdown options
  // -----------------------------
  const NodeDropDown: IDropDown[] =
    nodes?.map((item: any) => ({
      value: Number(item.Id),
      label: item.Title,
    })) || [];

  // -----------------------------
  //   ⬇️ تغییر Nodeها
  // -----------------------------
  const handleNodeChange = (vals: number[]) => {
    setSelectedNodes(vals);

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

    if (onFormChange) {
      onFormChange({
        ...zoneForm,
        selectedNodeIds: vals,
      });
    }
  };
  console.log("zoneFormInzoneForm", zoneForm);
  return (
    <div className="h-[80vh] p-5">
      <div className="mb-3">
        <label className="block mb-1">عنوان زون</label>
        <input
          name="ZoneTitle"
          value={zoneForm.ZoneTitle ?? ""}
          onChange={onChange}
          className="border px-3 py-2 w-full rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1">وضعیت زون (1 فعال / 0 غیرفعال)</label>
        <input
          type="number"
          name="ZoneStatus"
          value={zoneForm.ZoneStatus ?? 1}
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
          value={selectedNodes}
          innerClassName="border border-gray-300 rounded-[12px]"
          className="my-3"
          isMulty
          onChange={handleNodeChange}
        />
      </div>
    </div>
  );
}
