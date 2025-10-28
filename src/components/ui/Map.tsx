"use client";

import { useEffect, useRef } from "react";
import type { Map, MapMouseEvent } from "mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";

export interface MapPoint {
  id: string;
  name: string;
  category: "taxi_terminal" | "microhub" | "node";
  status: "active" | "inactive";
  lat: number;
  lng: number;
}

interface MapComponentProps {
  points: MapPoint[];
}

export default function MapComponent({ points }: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    import("@neshan-maps-platform/mapbox-gl").then((module) => {
      const mapboxgl = module.default;
      if (!mapContainerRef.current || mapRef.current) return;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        mapKey: "web.28982402f11941ea986940075f138ff1",
        center: [51.389, 35.6892],
        zoom: 12,
      });

      mapRef.current = map;

      map.on("load", () => {
        points.forEach((point) => {
          const el = document.createElement("div");

          // فقط دایره ساده
          el.style.width = "18px";
          el.style.height = "18px";
          el.style.borderRadius = "50%";
          el.style.backgroundColor =
            point.status === "active" ? "#4CAF50" : "#FF4D4F";
          el.style.border = "2px solid white";
          el.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
          el.style.cursor = "pointer";

          // 🔹 ساخت marker
          const marker = new mapboxgl.Marker({
            element: el,
            anchor: "center", // باعث میشه دایره دقیقاً روی نقطه باشه
          })
            .setLngLat([point.lng, point.lat])
            .setPopup(
              new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                offset: 25, // پاپ‌آپ کمی بالاتر از نقطه
              }).setHTML(`
                <div style="display:flex;align-items:center;gap:6px;font-size:14px;">
                  <img src="/icons/microhubIcone.svg" width="20" height="20" />
                  <b>${point.name}</b>
                  <span>(${point.status})</span>
                </div>
              `)
            )
            .addTo(map);

          marker.togglePopup();
          markersRef.current.push(marker);
        });
      });
    });
  }, [points]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🗺️ نقشه نِشان</h1>
      <div
        ref={mapContainerRef}
        className="w-full h-[80vh] rounded-2xl border shadow-lg"
      />
    </div>
  );
}
