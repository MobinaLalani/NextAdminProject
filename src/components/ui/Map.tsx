"use client";

import { useEffect, useRef } from "react";
import type { Map } from "mapbox-gl";
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
          // ساختن المنت مارکر
          const markerEl = document.createElement("div");
          markerEl.className = "custom-marker";

          const color = point.status === "active" ? "#6c5ce7" : "#636e72";

          // HTML درون مارکر
          markerEl.innerHTML = `
            <div class="marker-wrapper" style="--marker-color:${color}">
              <div class="marker-circle">
                <img src="/icons/microhubIcone.svg" width="16" height="16" />
              </div>
              <div class="marker-stick"></div>
              <div class="marker-tooltip">
                <div class="tooltip-content">
                  <b>${point.name}</b><br/>
                  <small>${point.status}</small>
                </div>
              </div>
            </div>
          `;

          // اضافه کردن به نقشه
          new mapboxgl.Marker({
            element: markerEl,
            anchor: "bottom",
          })
            .setLngLat([point.lng, point.lat])
            .addTo(map);
        });
      });
    });
  }, [points]);

  return (
    <>
      {/* استایل‌های سفارشی مارکر */}
      <style jsx global>{`
        .marker-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .marker-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--marker-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .marker-stick {
          width: 4px;
          height: 12px;
          background: var(--marker-color);
          border-radius: 2px;
          margin-top: -2px;
        }

        .marker-circle:hover {
          transform: scale(1.1);
        }

        .marker-tooltip {
          position: absolute;
          top: 2px;
          right: -190px;
          opacity: 0;
          visibility: hidden;
          transform: translateX(10px);
          transition: all 0.3s ease;
        }

        .marker-wrapper:hover .marker-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }

        .tooltip-content {
          background: white;
          border-radius: 10px;
          padding: 8px 12px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
          border-left: 4px solid var(--marker-color);
          min-width: 130px;
          font-size: 13px;
          color: #333;
        }

        .tooltip-content::after {
          content: "";
          position: absolute;
          top: 14px;
          left: -6px;
          border-width: 6px;
          border-style: solid;
          border-color: transparent white transparent transparent;
        }
      `}</style>

      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">🗺️ نقشه نِشان</h1>
        <div
          ref={mapContainerRef}
          className="w-full h-[80vh] rounded-2xl border shadow-lg"
        />
      </div>
    </>
  );
}
