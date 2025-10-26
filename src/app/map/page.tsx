"use client";

import { useEffect, useRef } from "react";
import type { Map, MapMouseEvent } from "mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";

// ✅ بازتعریف تایپ معتبر برای mapType
type NeshanMapStyle =
  | "standard-day"
  | "standard-night"
  | "osm-bright"
  | "osm-dark"
  | "neshan"
  | "dreamy";

export default function MapPage() {
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
        // mapType: "standard-day" as NeshanMapStyle, // ✅ type-safe بدون any
        center: [51.389, 35.6892],
        zoom: 13,
      });

      mapRef.current = map;

      // افزودن مارکر روی تهران
      new mapboxgl.Marker({ color: "red" })
        .setLngLat([51.389, 35.6892])
        .addTo(map);

      // رویداد کلیک با تایپ صحیح
      map.on("click", (e: MapMouseEvent) => {
        const { lng, lat } = e.lngLat;
        console.log("Clicked at:", lng, lat);
      });

      return () => {
        map.remove();
      };
    });
  }, []);

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
