// components/map/ZoneForm.tsx

"use client";
import React, { useState, useEffect } from "react";
import { MapStore } from "@/store/mapStore";
import type { MapPoint } from "@/store/mapStore";
import AutoComplete, { IDropDown } from "@/components/ui/AutoComplete";
import TextField from "@/components/ui/TextField";
import { useNodes } from "../../../hooks/node/node";

interface ZoneFormProps {
  zoneForm: {
    ZoneTitle: string;
    ZoneStatus: number;
    selectedNodeIds?: number[];
  };
  onChange: (name: string, value: string | number) => void;
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
  const { zoneNodes, setZoneNodes } = MapStore();
  const initialSelected = zoneNodes.map((item: any) => Number(item.id));
  const [selectedNodes, setSelectedNodes] = useState<number[]>(initialSelected);

  useEffect(() => {
    const ids = zoneNodes.map((item: any) => Number(item.nodeId));
    const uniqueIds = Array.from(new Set(ids));
    setSelectedNodes(uniqueIds);

    if (onFormChange) {
      onFormChange({
        ...zoneForm,
        selectedNodeIds: uniqueIds,
      });
    }
  }, [zoneNodes]);
 console.log("zoneForm.ZoneTitle", zoneForm);
  const NodeDropDown: IDropDown[] =
    nodes?.map((item: any) => ({
      value: Number(item.Id),
      label: item.Title,
    })) || [];

  const handleNodeChange = (vals: number[]) => {
    setSelectedNodes(vals);

    const newZoneNodes: MapPoint[] =
      nodes
        ?.filter((node: any) => vals.includes(Number(node.Id)))
        .map((node: any) => ({
          id: String(node.Id),
          lat: Number(node.Latitude),
          lng: Number(node.Longitude),
          name: String(node.Title),
          category: (node.Category as any) || "node",
          status:
            Number(node.statusId ?? node.Status) === 1 ? "active" : "inactive",
        })) || [];

    setZoneNodes(newZoneNodes);

    if (onFormChange) {
      onFormChange({
        ...zoneForm,
        selectedNodeIds: vals,
      });
    }
  };

  return (
    <div className="h-[80vh] p-5 space-y-4">
      <TextField
        label="عنوان زون"
        name="ZoneTitle"
        placeholder="عنوان زون را وارد کنید"
        value={zoneForm.ZoneTitle}
        onChange={(val) => onChange("ZoneTitle", val)}
      />

      <TextField
        label="وضعیت زون (1 فعال / 0 غیرفعال)"
        name="ZoneStatus"
        type="number"
        placeholder="0 یا 1"
        value={zoneForm.ZoneStatus}
        onChange={(val) => onChange("ZoneStatus", Number(val))}
      />

      <div className="mb-3">
        <label className="block mb-1">Nodes</label>
        <AutoComplete
          placeholder="Select nodes"
          options={NodeDropDown}
          value={zoneForm?.selectedNodeIds}
          isMulty
          innerClassName="border border-gray-300 rounded-[12px]"
          className="my-3"
          onChange={handleNodeChange}
        />
      </div>
    </div>
  );
}
