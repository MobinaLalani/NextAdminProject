"use client";

import { useEffect, useRef, useState } from "react";
import type { Map } from "mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
// ⚠ مسیر استور را با مسیر واقعی خودت جایگزین کن
import { MapStore } from "@/store/mapStore";

export type MarkerCategory = "taxi_terminal" | "microhub" | "node";
export type PointStatus = "active" | "inactive";

export interface MapPoint {
  id: string;
  name: string;
  category: MarkerCategory;
  status: PointStatus;
  lat: number;
  lng: number;
}

interface MapComponentProps {
  points: any[];
  initialZones?: [number, number][][]; // آرایه‌ای از زون‌ها، هر زون خودش آرایه‌ای از نقاط [lng, lat]
}

export default function MapComponent({
  points,
  initialZones,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const mapboxglRef = useRef<any>(null);

  const { mode } = MapStore(); // فقط mode از استور گرفته می‌شود
  const [zonePoints, setZonePoints] = useState<[number, number][]>([]);

  // 🗺️ ایجاد نقشه
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mapRef.current) return;

    import("@neshan-maps-platform/mapbox-gl").then((module) => {
      const mapboxgl = module.default;
      mapboxglRef.current = mapboxgl;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        mapKey: "web.28982402f11941ea986940075f138ff1",
        center: [51.389, 35.6892],
        zoom: 12,
      });

      mapRef.current = map;

      map.on("load", () => {
        renderMarkers();
        if (initialZones && initialZones.length > 0) {
          initialZones.forEach((zone: any) => drawZoneLine(zone, true));
        }
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 🔁 با تغییر نقاط یا mode دوباره مارکرها رندر می‌شوند
  useEffect(() => {
    renderMarkers();
  }, [points, mode]);

  const drawZoneLine = (coordinates: [number, number][], isInitial = false) => {
    const map = mapRef.current;
    if (!map) return;

    // حذف لایه‌ها و سورس‌ها فقط اگر زون جدید است (برای زون‌های آماده جدا)
    if (!isInitial) {
      ["zone-line", "zone-fill"].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
      ["zone", "zone-line"].forEach((id) => {
        if (map.getSource(id)) map.removeSource(id);
      });
    }

    if (coordinates.length < 2) return;

    const isClosed =
      coordinates.length >= 3 &&
      coordinates[0][0] === coordinates[coordinates.length - 1][0] &&
      coordinates[0][1] === coordinates[coordinates.length - 1][1];

    if (isClosed) {
      const polygonGeoJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
        type: "Feature",
        geometry: { type: "Polygon", coordinates: [coordinates] },
        properties: {},
      };

      const sourceId = isInitial ? `zone-initial-${Math.random()}` : "zone";

      map.addSource(sourceId, { type: "geojson", data: polygonGeoJSON });

      map.addLayer({
        id: `${sourceId}-fill`,
        type: "fill",
        source: sourceId,
        layout: {},
        paint: { "fill-color": "#00B894", "fill-opacity": 0.25 },
      });
    }

    // رسم خط هم مشابه قبلی
    const lineGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
      type: "Feature",
      geometry: { type: "LineString", coordinates },
      properties: {},
    };

    const lineSourceId = isInitial
      ? `zone-line-initial-${Math.random()}`
      : "zone-line";

    if (!map.getSource(lineSourceId)) {
      map.addSource(lineSourceId, { type: "geojson", data: lineGeoJSON });
    } else {
      (map.getSource(lineSourceId) as any).setData(lineGeoJSON);
    }

    if (!map.getLayer(lineSourceId)) {
      map.addLayer({
        id: lineSourceId,
        type: "line",
        source: lineSourceId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#00B894",
          "line-width": 3,
          "line-dasharray": [2, 2],
        },
      });
    }
  };

  const renderMarkers = () => {
    const map = mapRef.current;
    const mapboxgl = mapboxglRef.current;
    if (!map || !mapboxgl) return;

    document.querySelectorAll(".custom-marker").forEach((el) => el.remove());

    points.forEach((point) => {
      const markerEl = document.createElement("div");
      markerEl.className = "custom-marker";

      const isActive = point.status === "active";
      const colorClass = isActive ? "bg-emerald-600" : "bg-gray-500";
      const labelBgClass = isActive
        ? "bg-emerald-100 text-emerald-800"
        : "bg-gray-500 text-white";

      let iconSrc = "/icons/microhubIcone.svg";
      if (point.category === "taxi_terminal") iconSrc = "/icons/TaxiIcon.svg";
      else if (point.category === "node") iconSrc = "/icons/nodeIcon.svg";

      markerEl.innerHTML = `
        <div class="flex flex-col items-center cursor-pointer">
         <div class="mb-1 bg-white px-2 py-1 rounded-md shadow text-xs font-medium">
            <div class="flex items-center gap-1.5">
              <b class="font-semibold">${point.name}</b>
              <span class="px-2 py-0.5 rounded-md text-xs font-medium ${labelBgClass}">
                ${isActive ? "فعال" : "غیرفعال"}
              </span>
            </div>
          </div>
          <div class="w-7 h-7 rounded-full flex items-center justify-center shadow-md ${colorClass}">
            <img src="${iconSrc}" width="16" height="16" />
          </div>
          <div class="w-0.5 h-6 ${colorClass} -mt-0.5"></div>
         
        </div>
      `;

      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: "bottom",
      })
        .setLngLat([point.lng, point.lat])
        .addTo(map);

      markerEl.addEventListener("click", () => {
        if (mode === "defineZone") {
          // ✅ فقط نقاط فعال را بررسی می‌کنیم
          if (
            ["node", "microhub", "taxi_terminal"].includes(point.category) &&
            point.status === "active" // <-- اضافه شد
          ) {
            setZonePoints((prev: any) => {
              const newPoints = [...prev, [point.lng, point.lat]];
              drawZoneLine(newPoints);
              return newPoints;
            });
          }
        }
      });
    });
  };

  useEffect(() => {
    if (zonePoints.length >= 3) {
      console.log("✅ Zone points:", zonePoints);
    }
  }, [zonePoints]);

  return (
    <div className="p-6 space-y-4">
      <p className="text-sm text-gray-500">
        حالت فعلی: <b>{mode === "defineZone" ? "تعریف زون" : "نمایش"}</b>
      </p>
      <div
        ref={mapContainerRef}
        className="w-full h-[80vh] rounded-2xl border shadow-lg"
      />
    </div>
  );
}
