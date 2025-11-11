"use client";
import type { MapComponentProps } from "../../../types/maps";
import { MapPoint } from "@/store/mapStore";
import { useEffect, useRef, useState } from "react";
import type { Map } from "mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import { MapStore } from "@/store/mapStore";





export default function MapComponent({
  points,
  initialZones,
  zoneTitles,
  onPointClick,
  onZoneClick,
  onCreateNodeRequest,
}: MapComponentProps) {
 
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const mapboxglRef = useRef<any>(null);

  const { mode, setZoneNodes ,setOpenPanel } = MapStore();
  const [zonePoints, setZonePoints] = useState<MapPoint[]>([]);

  const pendingMarkerRef = useRef<any>(null);
  const pendingCoordsRef = useRef<MapPoint[] | null>(null);
  const [newZone, setNewZone] = useState<MapPoint[]>([]);

  const polygonCentroid = (coords: [number, number][]): [number, number] => {
    if (!coords || coords.length < 3) {
      return coords && coords.length ? coords[0] : [0, 0];
    }
    const arr = coords[0][0] === coords[coords.length - 1][0] && coords[0][1] === coords[coords.length - 1][1]
      ? coords.slice(0, -1)
      : coords;
    let area = 0;
    let cx = 0;
    let cy = 0;
    for (let i = 0, j = arr.length - 1; i < arr.length; j = i++) {
      const [x1, y1] = arr[j];
      const [x2, y2] = arr[i];
      const f = x1 * y2 - x2 * y1;
      area += f;
      cx += (x1 + x2) * f;
      cy += (y1 + y2) * f;
    }
    area *= 0.5;
    if (area === 0) {
      // fallback: میانگین ساده
      const sum = arr.reduce((acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]], [0, 0]) as [number, number];
      return [sum[0] / arr.length, sum[1] / arr.length];
    }
    return [cx / (6 * area), cy / (6 * area)];
  };


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
          initialZones.forEach((zone: any, idx: number) => {
            // برای زون‌های اولیه شناسه‌های قابل پیش‌بینی بسازیم تا بتوانیم رویداد کلیک ثبت کنیم
            const fillSourceId = `zone-initial-${idx}`;
            const fillLayerId = `${fillSourceId}-fill`;
            const lineSourceId = `${fillSourceId}-line`;
            const labelSourceId = `${fillSourceId}-label`;
            const labelLayerId = `${fillSourceId}-label-layer`;

            // ساخت GeoJSON ها
            const alreadyClosed =
              zone.length >= 3 &&
              zone[0][0] === zone[zone.length - 1][0] &&
              zone[0][1] === zone[zone.length - 1][1];
            const closedZone: [number, number][] =
              zone.length >= 3
                ? alreadyClosed
                  ? zone
                  : [...zone, zone[0]]
                : zone;

            if (closedZone.length >= 4) {
              const polygonGeoJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
                type: "Feature",
                geometry: { type: "Polygon", coordinates: [closedZone] },
                properties: {},
              };
              map.addSource(fillSourceId, { type: "geojson", data: polygonGeoJSON });
              map.addLayer({
                id: fillLayerId,
                type: "fill",
                source: fillSourceId,
                layout: {},
                paint: { "fill-color": "#00B894", "fill-opacity": 0.25 },
              });
            }

            const lineGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
              type: "Feature",
              geometry: { type: "LineString", coordinates: closedZone },
              properties: {},
            };
            map.addSource(lineSourceId, { type: "geojson", data: lineGeoJSON });
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

const title = zoneTitles?.[idx] ?? "";
if (title) {
  const centroid = polygonCentroid(closedZone);

  const labelGeoJSON: GeoJSON.Feature<GeoJSON.Point> = {
    type: "Feature",
    geometry: { type: "Point", coordinates: centroid },
    properties: { title },
  };

  map.addSource(labelSourceId, { type: "geojson", data: labelGeoJSON });
  map.addLayer({
    id: labelLayerId,
    type: "symbol",
    source: labelSourceId,
    layout: {
      "text-field": ["get", "title"],
      "text-size": 14,
      "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      "text-anchor": "center",
      "text-allow-overlap": true,
    },
    paint: {
      "text-color": "#065f46",
      "text-halo-color": "#ffffff",
      "text-halo-width": 2,
    },
  });
}

            // رویدادهای hover برای نشانگر دست
            [fillLayerId, lineSourceId].forEach((layerId) => {
              if (map.getLayer(layerId)) {
                map.on("mouseenter", layerId, () => (map.getCanvas().style.cursor = "pointer"));
                map.on("mouseleave", layerId, () => (map.getCanvas().style.cursor = ""));
              }
            });

            // رویداد کلیک روی زون
            [fillLayerId, lineSourceId].forEach((layerId) => {
              if (map.getLayer(layerId)) {
                map.on("click", layerId, () => {
                  if (typeof onZoneClick === "function") {
                    onZoneClick({ index: idx, coordinates: closedZone });
                  }
                });
              }
            });
          });
        }

// کلیک روی نقشه برای ایجاد نود
map.on("click", (e: any) => {
  if (mode === "createNode") {
    const { lng, lat } = e.lngLat;
    console.log("📍 مختصات نقطه جدید:", { lat, lng }); // ✅ نمایش مختصات در کنسول

    // پاک کردن مارکر قبلی در صورت وجود
    if (pendingMarkerRef.current) {
      pendingMarkerRef.current.remove();
      pendingMarkerRef.current = null;
    }

    pendingCoordsRef.current = [lng, lat];
    const markerEl = document.createElement("div");
    markerEl.className = "custom-marker";
    markerEl.innerHTML = `
      <div class="flex flex-col items-center">
        <div class="mb-1 bg-white px-2 py-1 rounded-md shadow text-xs font-semibold">نقطه جدید</div>
        <div class="w-7 h-7 rounded-full flex items-center justify-center shadow-md bg-blue-600">
          <img src="/icons/nodeIcon.svg" width="16" height="16" />
        </div>
        <div class="w-0.5 h-6 bg-blue-600 -mt-0.5"></div>
      </div>
    `;

    const marker = new mapboxglRef.current.Marker({ element: markerEl, anchor: "bottom" })
      .setLngLat([lng, lat])
      .addTo(map);

    pendingMarkerRef.current = marker;

    if (typeof onCreateNodeRequest === "function") {
      onCreateNodeRequest({ lat, lng });
    }
  }
});

      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);


  useEffect(() => {
    renderMarkers();
  }, [points, mode]);
  
  useEffect(() => {
  const map = mapRef.current;
  if (!map) return;

  if (mode === "createNode") {
    map.getCanvas().style.cursor = "crosshair";
  } else {
    map.getCanvas().style.cursor = "";
  }
  }, [mode]);

  useEffect(() => {
    if (mode !== "createNode" && pendingMarkerRef.current) {
      pendingMarkerRef.current.remove();
      pendingMarkerRef.current = null;
      pendingCoordsRef.current = null;
    }
  }, [mode]);

const drawZoneLine = (
  points: { lat: number; lng: number }[],
  isInitial = false
) => {
  const map = mapRef.current;
  if (!map) return;

  if (!isInitial) {
    ["zone-line", "zone-fill"].forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    ["zone", "zone-line"].forEach((id) => {
      if (map.getSource(id)) map.removeSource(id);
    });
  }

  if (points.length < 2) return;

  const coordinates = points.map((p) => [p.lng, p.lat]) as [number, number][];

  const isClosed =
    coordinates.length >= 3 &&
    coordinates[0][0] === coordinates[coordinates.length - 1][0] &&
    coordinates[0][1] === coordinates[coordinates.length - 1][1];

  // 🎨 رسم ناحیه (Polygon)
  if (isClosed) {
    const polygonGeoJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [coordinates] },
      properties: {},
    };

    const sourceId = isInitial ? `zone-initial-${Math.random()}` : "zone";


    if (map.getLayer(`${sourceId}-fill`)) map.removeLayer(`${sourceId}-fill`);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    map.addSource(sourceId, { type: "geojson", data: polygonGeoJSON });

    const fillLayerId = `${sourceId}-fill`;

    map.addLayer({
      id: fillLayerId,
      type: "fill",
      source: sourceId,
      layout: {},
      paint: { "fill-color": "#00B894", "fill-opacity": 0.25 },
    });

 
    map.on("mouseenter", fillLayerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", fillLayerId, () => {
      map.getCanvas().style.cursor = "";
    });

  //  map.on("click", fillLayerId, (e: any) => {
  //    setOpenPanel(true);
  //   //  console.log("سلام! روی زون جدید کلیک شد.");
  //  });

  }


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

          if (
            ["node", "microhub", "taxi_terminal"].includes(point.category) &&
            point.status === "active"
          ) {
            setZonePoints((prev: any) => {
            const newPoints = [
              ...prev,
              { id: point.id, lat: point.lat, lng: point.lng },
            ];
              drawZoneLine(newPoints);
              return newPoints;
            });
          }
        } else {

          if (typeof onPointClick === "function") onPointClick(point);
        }
      });
    });
  };

useEffect(() => {
  const map = mapRef.current;
  const mapboxgl = mapboxglRef.current;
  if (!map || !mapboxgl) return;


  const handleMapClick = (e: any) => {
    if (mode !== "createNode") return;

    const { lng, lat } = e.lngLat;
    console.log("📍 مختصات نود جدید:", { lat, lng });


    document.querySelectorAll(".temp-node-marker").forEach((el) => el.remove());

    const markerEl = document.createElement("div");
    markerEl.className = "custom-marker temp-node-marker";
    markerEl.innerHTML = `
      <div class="flex flex-col items-center">
        <div class="mb-1 bg-white px-2 py-1 rounded-md shadow text-xs font-semibold">نقطه جدید</div>
        <div class="w-7 h-7 rounded-full flex items-center justify-center shadow-md bg-blue-600">
          <img src="/icons/nodeIcon.svg" width="16" height="16" />
        </div>
        <div class="w-0.5 h-6 bg-blue-600 -mt-0.5"></div>
      </div>
    `;


    new mapboxgl.Marker({ element: markerEl, anchor: "bottom" })
      .setLngLat([lng, lat])
      .addTo(map);


    if (typeof onCreateNodeRequest === "function") {
      onCreateNodeRequest({ lat, lng });
    }
  };


  map.on("click", handleMapClick);


  return () => {
    map.off("click", handleMapClick);
  };
}, [mode, onCreateNodeRequest]);


  useEffect(() => {
    if (zonePoints.length >= 3) {
      console.log("✅ Zone points:", zonePoints);
      setZoneNodes(zonePoints);
      setNewZone(zonePoints)
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

      {mode === "defineZone" && zonePoints.length >= 3 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              const first = zonePoints[0];
              const last = zonePoints[zonePoints.length - 1];

              const closedZone =
                first.lng === last.lng && first.lat === last.lat
                  ? zonePoints
                  : [...zonePoints, first];

              drawZoneLine(closedZone);

              setZonePoints([]);
              setNewZone(closedZone);

              const center = polygonCentroid(
                closedZone.map((p) => [p.lng, p.lat])
              );

              const map = mapRef.current;
              if (map) {
                const labelSourceId = `new-zone-label`;
                const labelLayerId = `new-zone-label-layer`;

                const labelGeoJSON: GeoJSON.Feature<GeoJSON.Point> = {
                  type: "Feature",
                  geometry: { type: "Point", coordinates: center },
                  properties: { title: "زون جدید" },
                };

                if (map.getLayer(labelLayerId)) map.removeLayer(labelLayerId);
                if (map.getSource(labelSourceId))
                  map.removeSource(labelSourceId);

                map.addSource(labelSourceId, {
                  type: "geojson",
                  data: labelGeoJSON,
                });
                map.addLayer({
                  id: labelLayerId,
                  type: "symbol",
                  source: labelSourceId,
                  layout: {
                    "text-field": ["get", "title"],
                    "text-size": 14,
                    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                    "text-anchor": "center",
                    "text-allow-overlap": true,
                  },
                  paint: {
                    "text-color": "#065f46",
                    "text-halo-color": "#ffffff",
                    "text-halo-width": 2,
                  },
                });
              }

              if (typeof onZoneClick === "function") {
                onZoneClick({
                  index: -1,
                  coordinates: closedZone,
                });
              }
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow"
          >
            ✅ اتمام ترسیم زون
          </button>
        </div>
      )}
    </div>
  );

}
