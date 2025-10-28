import React from 'react';
import MapComponent from '@/components/ui/Map';

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
   ];
  return (
    <div>
      <MapComponent points={mapPoints} />
    </div>
  );
}

export default index
