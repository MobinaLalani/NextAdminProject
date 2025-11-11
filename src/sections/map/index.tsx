"use client";

import React, { useState  ,useEffect} from "react";3
import { MapPoint } from "../../../types/maps";
import Drawer from "@/components/ui/Drawer";
import MapComponent from "@/components/ui/Map";
import { MapStore } from "@/store/mapStore";
import NodeForm from "./nodeCrud/Index";
import ZoneForm from "./zoneCrud/Index";

// هوک‌های React Query برای CRUD
import { useCreateNode, useUpdateNode, useDeleteNode  } from "@/hooks/node/node";
import { useUpdateZone, useDeleteZone ,useCreateZone } from "@/hooks/zone/zone";

export default function MapIndex() {
  // -----------------------------
  // Stateها
  // -----------------------------
  const [openPanel, setOpenPanel] = useState(false);
  const [creatingNode, setCreatingNode] = useState(false);
  const [openZonePanel, setOpenZonePanel] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [zoneShapes, setZoneShapes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { mode, setMode  , zoneNodes} = MapStore();
  const [error, setError] = useState<string | null>(null);


  // بارگذاری اولیه
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

        // تبدیل nodes به MapPoint
        const mapPointsData: MapPoint[] = nodes.map((n: any) => ({
          id: String(n.Id),
          name: n.Title,
          category: "node",
          status: n.statusId === 1 ? "active" : "inactive",
          lat: Number(n.Latitude),
          lng: Number(n.Longitude),
          statusId: Number(n.statusId),
        }));
        setMapPoints(mapPointsData);

        // تبدیل zones به ZoneShapeType
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

        const zoneShapesData: any[] = Object.entries(
          groupedZones
        ).map(([id, v]) => ({
          zoneId: Number(id),
          title: v.title,
          status: v.status,
          coords: v.coords,
        }));

        setZoneShapes(zoneShapesData);
      } catch (err: any) {
        setError(err.message || "خطای ناشناخته");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const [form, setForm] = useState({
    Title: "",
    Latitude: 0,
    Longitude: 0,
    statusId: 1,
  });
const [zoneForm, setZoneForm] = useState({
  ZoneTitle: "",
  ZoneStatus: 1,
  selectedNodeIds: [] as number[], // اضافه شد
});


  // -----------------------------
  // React Query mutations
  // -----------------------------
  const createNode = useCreateNode();
  const updateNode = useUpdateNode();
  const deleteNode = useDeleteNode();
  const updateZone = useUpdateZone();
  const deleteZone = useDeleteZone();
  const createZone = useCreateZone();

  // -----------------------------
  // Node handlers
  // -----------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateSave = () => {
    createNode.mutate(form, {
      onSuccess: (created) => {
        setMapPoints((prev) => [
          ...prev,
          {
            id: String(created.Id),
            name: created.Title,
            category: "node",
            status: created.statusId === 1 ? "active" : "inactive",
            lat: Number(created.Latitude),
            lng: Number(created.Longitude),
            statusId: Number(created.statusId),
          },
        ]);
        setOpenPanel(false);
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
                    status: updated.statusId === 1 ? "active" : "inactive",
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

  // -----------------------------
  // Zone handlers
  // -----------------------------
  const handleZoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoneForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleZoneSave = () => {

  const dataToSave = {
    ZoneTitle: zoneForm.ZoneTitle,
    ZoneStatus: zoneForm.ZoneStatus,
    NodeIds: zoneForm.selectedNodeIds,
  };
  if (!selected) {
    createZone.mutate(dataToSave, {
      onSuccess: (res) => {
        console.log("✅ Zone created:", res);
        setOpenZonePanel(false);
        // آپدیت لیست زون‌ها (اختیاری)
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

  console.log("dataToSave", dataToSave);
  updateZone.mutate(
    { id: selected.id, data: dataToSave },
    {
      onSuccess: (updated) => {
        setMapPoints((prev) =>
          prev.map((z) =>
            z.id === String(updated.Id)
              ? { ...z, name: updated.Title, statusId: updated.StatusId }
              : z
          )
        );
        setOpenZonePanel(false);
      },
      onError: (err: any) => alert(err.message || "خطا در ویرایش زون"),
    }
  );
};

// const handleZoneSave = () => {
//   const dataToSave = {
//     Title: zoneForm.ZoneTitle,
//     statusId: zoneForm.ZoneStatus,
//     nodes: zoneForm.selectedNodeIds,
//   };

//   // اگر selected خالی بود یعنی زون جدید می‌سازیم
//   if (!selected) {
//     createZone.mutate(dataToSave, {
//       onSuccess: (res) => {
//         console.log("✅ Zone created:", res);
//         setOpenZonePanel(false);
//         // آپدیت لیست زون‌ها (اختیاری)
//         setZoneShapes((prev) => [
//           ...prev,
//           {
//             zoneId: res.zone.Id,
//             title: res.zone.Title,
//             status: res.zone.StatusId,
//             coords: [],
//           },
//         ]);
//       },
//       onError: (err: any) => alert(err.message || "خطا در ایجاد زون"),
//     });
//     return;
//   }

//   // در غیر این صورت یعنی ویرایش زون
//   updateZone.mutate(
//     { id: selected.id, data: dataToSave },
//     {
//       onSuccess: (updated) => {
//         setZoneShapes((prev) =>
//           prev.map((z) =>
//             z.zoneId === updated.Id
//               ? { ...z, title: updated.Title, status: updated.StatusId }
//               : z
//           )
//         );
//         setOpenZonePanel(false);
//       },
//       onError: (err: any) => alert(err.message || "خطا در ویرایش زون"),
//     }
//   );
// };


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
    });
    setOpenPanel(true); 
  };

  const handleZoneDelete = () => {
    if (!selected) return;
    deleteZone.mutate(selected.id, {
      onSuccess: () => {
        setMapPoints((prev) => prev.filter((z) => z.id !== selected.id));
        setOpenZonePanel(false);
        setSelected(null);
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
    setForm({
      Title: p.name,
      Latitude: p.lat,
      Longitude: p.lng,
      statusId:  (p.status === "active" ? 1 : 0),
    });
    setOpenPanel(true);
  };

  const handleZoneClick = (info: {
    index: number;
    coordinates: [number, number][];
  }) => {
    const idx = info.index;
    const z = zoneShapes[idx];
    if (!z) return;

    setSelected(idx); 
setZoneForm({
  ZoneTitle: z.title,
  ZoneStatus: z.status,
  selectedNodeIds: z.nodeIds || [], // اضافه شد
});
    setOpenZonePanel(true);     
  };

  // -----------------------------
  // Render UI
  // -----------------------------
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
              className="text-white font-semibold bg-[#FF7959] px-5 py-2 rounded-[12px]"
            >
              ایجاد نود
            </button>
            <button
              onClick={() =>
                setMode(mode === "defineZone" ? "view" : "defineZone")
              }
              className="text-white font-semibold bg-[#FF7959] px-5 py-2 rounded-[12px]"
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
          <Drawer
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
              onChange={handleChange}
              creatingNode={creatingNode}
            />
          </Drawer>

          {/* Drawer زون */}
          <Drawer
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
          </Drawer>
        </>
      )}

      {/* خطا */}
      {!loading && error && <div className="text-red-600 p-4">{error}</div>}
    </div>
  );
}
