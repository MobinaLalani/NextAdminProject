"use client";

import React, { useEffect, useState } from "react";
import MapComponent from "@/components/ui/Map";
import { MapStore } from "@/store/mapStore";

type PointStatus = "active" | "inactive";
type MarkerCategory = "node" | "microhub" | "taxi_terminal";

  interface MapPoint {
    id: string;
    name: string;
    category: MarkerCategory;
    status: PointStatus;
    lat: number;
    lng: number;
    statusId?: number;
  }

function index() {
  const { mode, setMode } = MapStore();
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 🟦 سایدبار ویرایش/حذف — باید قبل از هر return/شرطی تعریف شوند تا ترتیب هوک‌ها ثابت بماند
  const [openPanel, setOpenPanel] = useState(false);
  const [selected, setSelected] = useState<MapPoint | null>(null);
  const [form, setForm] = useState({ Title: "", Latitude: 0, Longitude: 0, statusId: 1 });
  // 🟩 وضعیت و داده‌های زون‌ها
  const [zoneShapes, setZoneShapes] = useState<{ zoneId: number; title: string; status: number; coords: [number, number][] }[]>([]);
  const [openZonePanel, setOpenZonePanel] = useState(false);
  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number | null>(null);
  const [zoneForm, setZoneForm] = useState<{ ZoneTitle: string; ZoneStatus: number }>({ ZoneTitle: "", ZoneStatus: 1 });
  const [creatingNode, setCreatingNode] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [resNodes, resZones] = await Promise.all([
          fetch("/api/node"),
          fetch("/api/zone"),
        ]);
        if (!resNodes.ok) throw new Error("خطا در دریافت نودها");
        if (!resZones.ok) throw new Error("خطا در دریافت زون‌ها");
        const nodes = await resNodes.json();
        const zoneRows = await resZones.json();
        const points: MapPoint[] = nodes.map((n: any) => ({
          id: String(n.Id),
          name: n.Title,
          category: "node",
          status: n.statusId === 1 ? "active" : "inactive",
          lat: Number(n.Latitude),
          lng: Number(n.Longitude),
          statusId: Number(n.statusId),
        }));
        setMapPoints(points);

        // گروه‌بندی ردیف‌های زون به چندضلعی‌ها
        const grouped: Record<number, { title: string; status: number; coords: [number, number][] }> = {};
        (zoneRows || []).forEach((row: any) => {
          const zid = Number(row.ZoneId);
          if (!grouped[zid]) {
            grouped[zid] = {
              title: row.ZoneTitle,
              status: Number(row.ZoneStatus),
              coords: [],
            };
          }
          // مختصات به شکل [lng, lat]
          grouped[zid].coords.push([Number(row.Longitude), Number(row.Latitude)]);
        });
        const shapes = Object.entries(grouped).map(([zid, v]) => ({
          zoneId: Number(zid),
          title: v.title,
          status: v.status,
          coords: v.coords,
        }));
        setZoneShapes(shapes);
      } catch (err: any) {
        setError(err.message || "خطای ناشناخته");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ⚡ تعریف چند زون آماده با چند نقطه
  const initialZones: [number, number][][] = zoneShapes.map((z) => z.coords);
  const zoneTitles: string[] = zoneShapes.map((z) => z.title);
  console.log('mode',mode)
  const handlePointClick = (p: MapPoint) => {
    if (creatingNode) return;
    // اگر پنل باز باشد، با کلیک روی هر مارکر پنل بسته شود
    if (openPanel) {
      setOpenPanel(false);
      setSelected(null);
      return;
    }
    // در حالت بسته، کلیک روی مارکر پنل را با داده همان مارکر باز می‌کند
    setSelected(p);
    setForm({
      Title: p.name,
      Latitude: p.lat,
      Longitude: p.lng,
      statusId: p.statusId ?? (p.status === "active" ? 1 : 0),
    });
    setOpenPanel(true);
  };

  // دریافت مختصات کلیک روی نقشه برای ایجاد نود جدید
  const handleCreateNodeRequest = ({ lat, lng }: { lat: number; lng: number }) => {
    setCreatingNode(true);
    setSelected(null);
    setForm({ Title: "", Latitude: lat, Longitude: lng, statusId: 1 });
    setOpenPanel(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "Title" ? value : Number(value),
    }));
  };

  const handleSave = async () => {
    if (!selected) return;
    const id = selected.id;
    const res = await fetch(`/api/node/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      alert("خطا در ذخیره نود");
      return;
    }
    const updated = await res.json();
    // بروزرسانی نقطه در نقشه
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
            }
          : p
      )
    );
    setOpenPanel(false);
  };

  const handleDelete = async () => {
    if (!selected) return;
    const id = selected.id;
    const res = await fetch(`/api/node/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("خطا در حذف نود");
      return;
    }
    setMapPoints((prev) => prev.filter((p) => p.id !== id));
    setOpenPanel(false);
    setSelected(null);
  };

  const handleCreateSave = async () => {
    try {
      const res = await fetch(`/api/node`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("خطا در ایجاد نود");
      const created = await res.json();
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
        },
      ]);
      setOpenPanel(false);
      setCreatingNode(false);
      setMode("view");
    } catch (err: any) {
      alert(err.message || "خطای ناشناخته");
    }
  };

  // کلیک روی زون — باز کردن پنل ویرایش زون
  const handleZoneClick = (info: { index: number; coordinates: [number, number][] }) => {
    const idx = info.index;
    const z = zoneShapes[idx];
    if (!z) return;
    setSelectedZoneIndex(idx);
    setZoneForm({ ZoneTitle: z.title, ZoneStatus: z.status });
    setOpenZonePanel(true);
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setZoneForm((prev) => ({
      ...prev,
      [name]: name === "ZoneTitle" ? value : Number(value),
    }));
  };

  const handleZoneSave = async () => {
    if (selectedZoneIndex === null) return;
    const z = zoneShapes[selectedZoneIndex];
    try {
      const res = await fetch(`/api/zone/${z.zoneId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Title: zoneForm.ZoneTitle, StatusId: zoneForm.ZoneStatus }),
      });
      if (!res.ok) throw new Error("خطا در ویرایش زون");
      // به‌روزرسانی محلی
      setZoneShapes((prev) =>
        prev.map((item, i) => (i === selectedZoneIndex ? { ...item, title: zoneForm.ZoneTitle, status: zoneForm.ZoneStatus } : item))
      );
      setOpenZonePanel(false);
    } catch (err: any) {
      alert(err.message || "خطای ناشناخته");
    }
  };

  const handleZoneDelete = async () => {
    if (selectedZoneIndex === null) return;
    const z = zoneShapes[selectedZoneIndex];
    try {
      const res = await fetch(`/api/zone/${z.zoneId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف زون");
      setZoneShapes((prev) => prev.filter((_, i) => i !== selectedZoneIndex));
      setOpenZonePanel(false);
      setSelectedZoneIndex(null);
    } catch (err: any) {
      alert(err.message || "خطای ناشناخته");
    }
  };

  return (
    <div>
      <div className="p-4 flex gap-2 items-center">
        <span className="text-sm text-gray-600">حالت فعلی: {mode === "defineZone" ? "تعریف زون" : mode === "createNode" ? "ایجاد نود" : "نمایش"}</span>
        <button
          className={`px-3 py-1.5 rounded border ${mode === "createNode" ? "bg-blue-600 text-white" : "bg-white"}`}
          onClick={() => setMode(mode === "createNode" ? "view" : "createNode")}
        >
          ایجاد نود
        </button>
        <button
          className={`px-3 py-1.5 rounded border ${mode === "defineZone" ? "bg-emerald-600 text-white" : "bg-white"}`}
          onClick={() => setMode(mode === "defineZone" ? "view" : "defineZone")}
        >
          تعریف زون
        </button>
      </div>
      {loading && <div className="p-6">در حال بارگذاری نقشه...</div>}
      {!loading && !error && (
        <>
          <MapComponent points={mapPoints} initialZones={initialZones} zoneTitles={zoneTitles} onPointClick={handlePointClick} onZoneClick={handleZoneClick} onCreateNodeRequest={handleCreateNodeRequest} />

          {/* Drawer سمت چپ */}
          {openPanel && (
            <div className="fixed inset-y-0 left-0 w-[380px] bg-white border-r shadow-xl z-50">
              <div className="p-4 flex items-center justify-between border-b">
                <h2 className="font-semibold">{creatingNode ? "ایجاد نود" : "ویرایش نود"}</h2>
                <button className="text-xl" onClick={() => { setOpenPanel(false); setCreatingNode(false); }}>کنسل کردن</button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block mb-1">عنوان</label>
                  <input
                    name="Title"
                    value={form.Title}
                    onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                    onChange={handleChange}
                    className="border px-3 py-2 w-full rounded"
                    min={0}
                    max={1}
                  />
                </div>
              </div>
              <div className="p-4 border-t flex gap-2">
                {creatingNode ? (
                  <>
                    <button onClick={handleCreateSave} className="bg-blue-600 text-white px-4 py-2 rounded">ایجاد</button>
                    <button onClick={() => { setOpenPanel(false); setCreatingNode(false); }} className="bg-gray-300 text-gray-900 px-4 py-2 rounded">انصراف</button>
                  </>
                ) : (
                  <>
                    <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">ذخیره</button>
                    <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">حذف</button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Drawer زون از سمت چپ */}
          {openZonePanel && (
            <div className="fixed inset-y-0 left-0 w-[380px] bg-white border-r shadow-xl z-50">
              <div className="p-4 flex items-center justify-between border-b">
                <h2 className="font-semibold">ویرایش زون</h2>
                <button className="text-xl" onClick={() => setOpenZonePanel(false)}>×</button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block mb-1">عنوان زون</label>
                  <input
                    name="ZoneTitle"
                    value={zoneForm.ZoneTitle}
                    onChange={handleZoneChange}
                    className="border px-3 py-2 w-full rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">وضعیت زون (1 فعال / 0 غیرفعال)</label>
                  <input
                    type="number"
                    name="ZoneStatus"
                    value={zoneForm.ZoneStatus}
                    onChange={handleZoneChange}
                    className="border px-3 py-2 w-full rounded"
                    min={0}
                    max={1}
                  />
                </div>
              </div>
              <div className="p-4 border-t flex gap-2">
                <button onClick={handleZoneSave} className="bg-blue-600 text-white px-4 py-2 rounded">ذخیره زون</button>
                <button onClick={handleZoneDelete} className="bg-red-600 text-white px-4 py-2 rounded">حذف زون</button>
              </div>
            </div>
          )}
        </>
      )}
      {!loading && error && <div className="p-6 text-red-600">{error}</div>}
    </div>
  );
}

export default index;
