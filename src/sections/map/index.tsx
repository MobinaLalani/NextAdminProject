import React from "react";
import MapComponent from "@/components/ui/Map";

function index() {
  const mapPoints = [
    {
      id: "1",
      name: "پایانه آزادی",
      category: "taxi_terminal",
      status: "active",
      lat: 35.6997,
      lng: 51.337,
    },
    {
      id: "2",
      name: "میکروهاب صادقیه",
      category: "microhub",
      status: "active",
      lat: 35.7212,
      lng: 51.3456,
    },
    {
      id: "3",
      name: "نود غرب",
      category: "node",
      status: "active",
      lat: 35.732,
      lng: 51.383,
    },
    {
      id: "4",
      name: "میکروهاب مرکزی",
      category: "microhub",
      status: "inactive",
      lat: 35.71,
      lng: 51.35,
    },
    {
      id: "5",
      name: "نود شرق",
      category: "node",
      status: "active",
      lat: 35.74,
      lng: 51.39,
    },
    {
      id: "6",
      name: "پایانه جنوب",
      category: "taxi_terminal",
      status: "inactive",
      lat: 35.68,
      lng: 51.32,
    },
    {
      id: "7",
      name: "میکروهاب شمال",
      category: "microhub",
      status: "active",
      lat: 35.75,
      lng: 51.36,
    },
    {
      id: "8",
      name: "نود شمال غرب",
      category: "node",
      status: "inactive",
      lat: 35.76,
      lng: 51.37,
    },
  ];

  // ⚡ تعریف چند زون آماده با چند نقطه
  const initialZones: [number, number][][] = [
    [
      [51.337, 35.6997],
      [51.3456, 35.7212],
      [51.35, 35.71],
      [51.337, 35.6997], // بستن زون
    ],
    [
      [51.383, 35.732],
      [51.39, 35.74],
      [51.37, 35.76],
      [51.383, 35.732], // زون دوم
    ],
  
  ];

  return (
    <div>
      <MapComponent points={mapPoints} initialZones={initialZones} />
    </div>
  );
}

export default index;
