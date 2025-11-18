"use client";

import React, { useState, useEffect } from "react";
import { MapPoint } from "../../../types/maps";
import Sidebar from "@/components/layout/mapLayout/sidebar/sidebar";
import MapComponent from "@/components/ui/Map";
import { MapStore } from "@/store/mapStore";
import NodeForm from "./nodeCrud/Index";
import ZoneForm from "./zoneCrud/Index";
import {
  useCreateNode,
  useUpdateNode,
  useDeleteNode,
  useGetNode,
} from "@/hooks/node/node";
import {
  useUpdateZone,
  useDeleteZone,
  useCreateZone,
  useGetZone,
} from "@/hooks/zone/zone";

export default function MapIndex() {
  const [openPanel, setOpenPanel] = useState(false);
  const [creatingNode, setCreatingNode] = useState(false);
  const [openZonePanel, setOpenZonePanel] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<string>();
  const [selectedZone, setSelectedZone] = useState();
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [zoneShapes, setZoneShapes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { mode, setMode, zoneNodes  ,setSelectedZoneId} = MapStore();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    Title: "",
    Latitude: 0,
    Longitude: 0,
    statusId: 1,
    nodeLabels: [] as number[],
  });
  const [zoneForm, setZoneForm] = useState({
    ZoneTitle: "",
    ZoneStatus: 1,
    selectedNodeIds: [] as number[] | undefined, 
  });
  const createNode = useCreateNode();
  const updateNode = useUpdateNode();
  const deleteNode = useDeleteNode();
  const updateZone = useUpdateZone();
  const deleteZone = useDeleteZone();
  const createZone = useCreateZone();
  const { data: NodeData, isLoading: nodeLoading } = useGetNode(selectedNode);
  const { data: zoneData, isLoading: zoneLoading } = useGetZone(selectedZone, {
    enabled: !!selectedZone, 
  });
 ///function
  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleCreateSave = () => {
    createNode.mutate(form, {
      onSuccess: (created) => {
        console.log("created", created);
        setMapPoints((prev) => [
          ...prev,
          {
            id: String(created.Id),
            name: created.Title,
            category: "node",
            status: Number(created.statusId) === 1 ? "active" : "inactive",
            lat: Number(created.Latitude),
            lng: Number(created.Longitude),
            statusId: Number(created.statusId),
            LabelId:
              form.nodeLabels && form.nodeLabels.length > 0
                ? Number(form.nodeLabels[0])
                : undefined,
          },
        ]);
        setOpenPanel(false);
        setMode("view");
        setCreatingNode(false);
      },
      onError: (err: any) => alert(err.message || "خطا در ایجاد نود"),
    });
  };
  const handleSave = () => {
    if (!selected) return;
    updateNode.mutate(
      { id: selected.id, data: form },
      {
        onSuccess: (updated) => {
          setMapPoints((prev) =>
            prev.map((p) =>
              p.id === String(updated.Id)
                ? {
                    ...p,
                    name: updated.Title,
                    lat: Number(updated.Latitude),
                    lng: Number(updated.Longitude),
                    statusId: Number(updated.statusId),
                    status: Number(updated.statusId) === 1 ? "active" : "inactive",
                    LabelId:
                      updated.nodeLabels && updated.nodeLabels.length > 0
                        ? Number(updated.nodeLabels[0])
                        : undefined,
                  }
                : p
            )
          );
          setOpenPanel(false);
        },
        onError: (err: any) => alert(err.message || "خطا در ویرایش نود"),
      }
    );
  };
  const handleDelete = () => {
    if (!selected) return;
    deleteNode.mutate(selected.id, {
      onSuccess: () => {
        setMapPoints((prev) => prev.filter((p) => p.id !== selected.id));
        setOpenPanel(false);
        setSelected(null);
      },
      onError: (err: any) => alert(err.message || "خطا در حذف نود"),
    });
  };
  const handleZoneChange = (name: string, value: string | number) => {
    console.log(name,value);
    setZoneForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleZoneSave = () => {
    if (!selectedZone) {
      const createPayload = {
        ZoneTitle: zoneForm.ZoneTitle,
        ZoneStatus: zoneForm.ZoneStatus,
        NodeIds: zoneForm.selectedNodeIds,
      };
      createZone.mutate(createPayload, {
        onSuccess: (res) => {
          setOpenZonePanel(false);
          setZoneShapes((prev) => [
            ...prev,
            {
              zoneId: res.zone.Id,
              title: res.zone.Title,
              status: res.zone.StatusId,
              coords: [],
            },
          ]);
        },
        onError: (err: any) => alert(err.message || "خطا در ایجاد زون"),
      });
      return;
    }
    const updatePayload = {
      ZoneTitle: zoneForm.ZoneTitle,
      ZoneStatus: zoneForm.ZoneStatus,
      selectedNodeIds: zoneForm.selectedNodeIds,
    };
    updateZone.mutate(
      { id: Number(selectedZone), data: updatePayload },
      {
        onSuccess: () => {
          setOpenZonePanel(false);
        },
        onError: (err: any) => alert(err.message || "خطا در ویرایش زون"),
      }
    );
  };
  const handleCreateNodeRequest = ({
    lat,
    lng,
  }: {
    lat: number;
    lng: number;
  }) => {
    setCreatingNode(true);
    setSelected(null);
    setForm({
      Title: "",
      Latitude: lat,
      Longitude: lng,
      statusId: 1,
      nodeLabels: [],
    });
    setOpenPanel(true);
  };
  const handleZoneDelete = () => {
    if (!selectedZone) return;
    deleteZone.mutate(Number(selectedZone), {
      onSuccess: () => {
        setZoneShapes((prev) => prev.filter((z) => z.zoneId !== Number(selectedZone)));
        setOpenZonePanel(false);
        setSelectedZone(undefined as any);
      },
      onError: (err: any) => alert(err.message || "خطا در حذف زون"),
    });
  };
  const handlePointClick = (p: MapPoint) => {
    if (creatingNode) return;
    if (openPanel) {
      setOpenPanel(false);
      setSelected(null);
      return;
    }
    setSelected(p);
    setSelectedNode(p.id);
    setOpenPanel(true);
  };
  const handleZoneClick = (info: {
    index: number;
    coordinates: [number, number][];
  }) => {
    const idx = info.index;
    setSelectedZoneId(zoneShapes[idx].zoneId);
    setSelectedZone(zoneShapes[idx].zoneId);
    setOpenZonePanel(true);
  };

  
  useEffect(() => {
    const load = async () => {
      try {
        const [nodesRes, zonesRes] = await Promise.all([
          fetch("/api/node"),
          fetch("/api/zone"),
        ]);
        if (!nodesRes.ok) throw new Error("خطا در دریافت نودها");
        if (!zonesRes.ok) throw new Error("خطا در دریافت زون‌ها");
        const nodes = await nodesRes.json();
        const zones = await zonesRes.json();
        const mapPointsData: MapPoint[] = nodes.map((n: any) => ({
          id: String(n.Id),
          name: n.Title,
          category: "node",
          status: n.statusId,
          lat: Number(n.Latitude),
          lng: Number(n.Longitude),
          statusId: Number(n.statusId),
          LabelId: n.LabelId,
        }));
        setMapPoints(mapPointsData);
        const groupedZones: Record<
          number,
          { title: string; status: number; coords: [number, number][] }
        > = {};
        zones.forEach((z: any) => {
          const zid = Number(z.ZoneId);
          if (!groupedZones[zid]) {
            groupedZones[zid] = {
              title: z.ZoneTitle,
              status: Number(z.ZoneStatus),
              coords: [],
            };
          }
          groupedZones[zid].coords.push([
            Number(z.Longitude),
            Number(z.Latitude),
          ]);
        });

        const zoneShapesData: any[] = Object.entries(groupedZones).map(
          ([id, v]) => ({
            zoneId: Number(id),
            title: v.title,
            status: v.status,
            coords: v.coords,
          })
        );

        setZoneShapes(zoneShapesData);
      } catch (err: any) {
        setError(err.message || "خطای ناشناخته");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);
  useEffect(() => {
  if (!openZonePanel || !zoneData) return;
  setZoneForm({
    ZoneTitle: zoneData.ZoneTitle ?? "",
    ZoneStatus: Number(zoneData.ZoneStatus ?? 1),
    selectedNodeIds: 
      zoneData?.selectedNodeIds.map((item:any)=>item.nodeId)
     ,
  });
  }, [zoneData, openZonePanel]);
  useEffect(() => {
      if (!NodeData || !selected) return;
      setForm({
        Title: selected.name,
        Latitude: selected.lat,
        Longitude: selected.lng,
        statusId: Number(
          (selected as any).statusId ??
            (selected as any).status ??
            NodeData.statusId ??
            1
        ),
        nodeLabels: NodeData.nodeLabels ?? [],
      });
  }, [NodeData, selected]);

  return (
    <div>
      {loading && <div>در حال بارگذاری نقشه...</div>}

      {!loading && !error && (
        <>
          <div className="flex flex-row gap-2">
            <button
              onClick={() =>
                setMode(mode === "createNode" ? "view" : "createNode")
              }
              className="text-white font-semibold bg-[#FF7959] px-5 py-2 rounded-xl"
            >
              ایجاد نود
            </button>
            <button
              onClick={() =>
                setMode(mode === "defineZone" ? "view" : "defineZone")
              }
              className="text-white font-semibold bg-foreground px-5 py-2 rounded-[12px]"
            >
              ایجاد زون
            </button>
            {mode === "defineZone" && (
              <button
                onClick={() => setOpenZonePanel(true)}
                className="text-white font-semibold bg-[#009966] px-5 py-2 rounded-[12px]"
              >
                تایید زون
              </button>
            )}
          </div>
          <MapComponent
            points={mapPoints}
            initialZones={zoneShapes.map((z) => z.coords)}
            zoneTitles={zoneShapes.map((z) => z.title)}
            onPointClick={handlePointClick}
            onZoneClick={handleZoneClick}
            onCreateNodeRequest={handleCreateNodeRequest}
          />
          <Sidebar
            open={openPanel}
            title={creatingNode ? "ایجاد نود" : "ویرایش نود"}
            onClose={() => {
              setOpenPanel(false);
              setCreatingNode(false);
            }}
            footer={
              creatingNode ? (
                <>
                  <button
                    onClick={handleCreateSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={createNode.isPending}
                  >
                    {createNode.isPending ? "در حال ایجاد..." : "ایجاد"}
                  </button>
                  <button
                    onClick={() => {
                      setOpenPanel(false);
                      setCreatingNode(false);
                    }}
                    className="bg-gray-300 text-gray-900 px-4 py-2 rounded"
                  >
                    انصراف
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={updateNode.isPending}
                  >
                    {updateNode.isPending ? "در حال ذخیره..." : "ذخیره"}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    disabled={deleteNode.isPending}
                  >
                    {deleteNode.isPending ? "در حال حذف..." : "حذف"}
                  </button>
                </>
              )
            }
          >
            <NodeForm
              form={form}
              setForm={setForm}
              onChange={handleChange}
              creatingNode={creatingNode}
            />
          </Sidebar>
          <Sidebar
            open={openZonePanel}
            title="ویرایش زون"
            onClose={() => setOpenZonePanel(false)}
            footer={
              <>
                <button
                  onClick={handleZoneSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  disabled={updateZone.isPending}
                >
                  {updateZone.isPending ? "در حال ذخیره..." : "ذخیره زون"}
                </button>
                <button
                  onClick={handleZoneDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                  disabled={deleteZone.isPending}
                >
                  {deleteZone.isPending ? "در حال حذف..." : "حذف زون"}
                </button>
              </>
            }
          >
            <ZoneForm
              zoneForm={zoneForm} 
              onChange={handleZoneChange}
              onFormChange={(updatedForm) => setZoneForm(updatedForm)}
            />
          </Sidebar>
        </>
      )}
      {!loading && error && <div className="text-red-600 p-4">{error}</div>}
    </div>
  );
}
