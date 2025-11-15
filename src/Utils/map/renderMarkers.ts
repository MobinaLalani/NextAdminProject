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

  // ░░ پاک کردن مارکرهای قبلی ░░
  document.querySelectorAll(".custom-marker").forEach((el) => el.remove());

  points.forEach((point) => {
    console.log("Rendering marker → ", {
      name: point.name,
      lat: point.lat,
      lng: point.lng,
      LabelId: point.LabelId,
      status: point.status,
    });

    // جلوگیری از ایجاد مارکر با مختصات ناقص
    if (point.lat == null || point.lng == null) {
      console.warn("❌ lat/lng ناقص است:", point);
      return;
    }

    const markerEl = document.createElement("div");
    markerEl.className = "custom-marker";

    const isActive = point.status === "active";

    // ░░ تعیین رنگ بر اساس LabelId ░░
    let colorClass = "bg-gray-500"; // برای غیرفعال
    if (isActive) {
      if (point.LabelId === 1) colorClass = "bg-yellow-500"; // تاکسی
      else if (point.LabelId === 2) colorClass = "bg-blue-600"; // میکروهاب
      else if (point.LabelId === 3) colorClass = "bg-red-600"; // نود
    }

    const labelBgClass = isActive
      ? "bg-emerald-100 text-emerald-800"
      : "bg-gray-500 text-white";

    // ░░ تعیین آیکون بر اساس LabelId (دیگر category مهم نیست) ░░
    let iconSrc = "/icons/microhubIcone.svg";
    if (point.LabelId === 1) iconSrc = "/icons/TaxiIcon.svg";
    else if (point.LabelId === 2) iconSrc = "/icons/microhubIcone.svg";
    else if (point.LabelId === 3) iconSrc = "/icons/nodeIcon.svg";

    // ░░ HTML مارکر ░░
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

    // ░░ ساخت مارکر Mapbox ░░
    new mapboxgl.Marker({
      element: markerEl,
      anchor: "bottom",
    })
      .setLngLat([Number(point.lng), Number(point.lat)])
      .addTo(map);

    // ░░ کلیک مارکر ░░
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
