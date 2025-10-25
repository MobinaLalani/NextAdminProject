"use client";
import React from "react";
import Map from "./map/map";
import Table from "./table/table";
import Charts from "./charts/Charts";

function Index() {
  return (
    <div className="p-6 space-y-6">
      {/* عنوان صفحه */}
      <h1 className="text-2xl font-bold text-gray-800">داشبورد</h1>

      {/* گرید اصلی */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* چارت */}
        <div className="lg:col-span-2">
          <Charts />
        </div>

        {/* نقشه */}
        <div className="lg:col-span-1">
          <Map />
        </div>
      </div>

      {/* جدول زیر گرید */}
      <div>
        <Table />
      </div>
    </div>
  );
}

export default Index;
