export interface RenderMarkersParams {
  map: any;
  mapboxgl: any;
  points: any[];
  mode: string;

  onPointClick?: (point: any) => void;
  onZonePointAdd?: (point: any) => void;
}

export function renderMarkers({
  map,
  mapboxgl,
  points,
  mode,
  onPointClick,
  onZonePointAdd,
}: RenderMarkersParams) {
  if (!map || !mapboxgl) return;

  document.querySelectorAll(".custom-marker").forEach((el) => el.remove());

  points.forEach((point) => {
    console.log("point", point);
    if (point.lat == null || point.lng == null) {
      console.warn("❌ lat/lng ناقص است:", point);
      return;
    }

    const markerEl = document.createElement("div");
    markerEl.className = "custom-marker";

    const statusNumeric = Number(point.statusId ?? (point.status === "active" ? 1 : point.status === "inactive" ? 0 : point.status));
    const isActive = statusNumeric === 1;

    
    let colorClass = "bg-gray-500"; 
    if (isActive) {
      const labelId = Number(point.LabelId ?? point.labelId);
      if (labelId === 1) colorClass = "bg-yellow-500";  
      else if (labelId === 2) colorClass = "bg-blue-600"; 
      else if (labelId === 3) colorClass = "bg-red-600"; 
      else colorClass = "bg-green-500";
    }

    const labelBgClass =
      isActive
        ? "bg-emerald-100 text-emerald-800"
        : "bg-gray-500 text-white";
 
    let iconSrc = "/icons/microhubIcone.svg";
    const labelId = Number(point.LabelId ?? point.labelId);
    if (labelId === 1) iconSrc = "/icons/TaxiIcon.svg";
    else if (labelId === 2) iconSrc = "/icons/microhubIcone.svg";
    else if (labelId === 3) iconSrc = "/icons/nodeIcon.svg";

    markerEl.innerHTML =`
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

    new mapboxgl.Marker({
      element: markerEl,
      anchor: "bottom",
    })
      .setLngLat([Number(point.lng), Number(point.lat)])
      .addTo(map);

    markerEl.addEventListener("click", () => {
      if (mode === "defineZone") {
        if (isActive) {
          onZonePointAdd?.(point);
        }
      } else {
        onPointClick?.(point);
      }
    });
  });
}
