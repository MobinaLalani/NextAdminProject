"use client";

import { useEffect, useRef } from "react";
import type { Map, MapMouseEvent } from "mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import { MapStore } from "@/store/mapStore";

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
  const markerRef = useRef<any>(null);

  // مقدار ذخیره شده در store
  const searchText = MapStore((state) => state.searchText);

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

      // مارکر اولیه
      markerRef.current = new mapboxgl.Marker({ color: "red" })
        .setLngLat([51.389, 35.6892])
        .addTo(map);

      // کلیک روی نقشه
      map.on("click", (e: MapMouseEvent) => {
        const { lng, lat } = e.lngLat;
        markerRef.current.setLngLat([lng, lat]);
      });
    });
  }, []);

  // وقتی مقدار searchText تغییر کرد، مارکر روی مختصات جدید قرار بگیرد
  useEffect(() => {
    if (!searchText) return;

    const [latStr, lngStr] = searchText.split(",").map((v) => v.trim());
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng)) return;

    if (mapRef.current && markerRef.current) {
      mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
      markerRef.current.setLngLat([lng, lat]);
    }
  }, [searchText]);

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
