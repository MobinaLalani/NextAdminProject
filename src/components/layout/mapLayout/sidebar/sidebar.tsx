"use client";

import { useState } from "react";
import {
  FiHome,
  FiSettings,
  FiMap,
  FiGrid,
  FiChevronLeft,
} from "react-icons/fi";
import { MapStore } from "@/store/mapStore"; // 👈 مسیر صحیح پروژه‌ات

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [active, setActive] = useState("خانه");

  // 👇 گرفتن تابع setMode از Zustand
  const setMode = MapStore((state) => state.setMode);

  const menuItems = [
    { icon: <FiHome />, label: "خانه", mode: "view" },
    { icon: <FiMap />, label: "نقشه", mode: "view" },
    { icon: <FiGrid />, label: "تعریف زون", mode: "defineZone" }, // 👈 تعریف زون
    { icon: <FiSettings />, label: "تنظیمات", mode: "view" },
  ];

  const handleClick = (item: any) => {
    setActive(item.label);
    console.log("item.mode", item.mode);
    setMode(item.mode); // 👈 اینجا تغییر حالت نقشه
  };

  return (
    <div className="relative flex">
      <div
        className={`flex flex-col bg-white border-r border-gray-200 shadow-lg h-screen transition-all duration-300 ${
          isOpen ? "w-60" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {isOpen && (
            <h1 className="text-lg font-bold text-gray-800 whitespace-nowrap">
              داشبورد
            </h1>
          )}
        </div>

        <div className="flex flex-col flex-1 mt-4 space-y-1 px-2">
          {menuItems.map((item, idx) => {
            const isActive = active === item.label;
            return (
              <button
                key={idx}
                onClick={() => handleClick(item)}
                className={`flex items-center gap-3 w-full p-2 rounded-xl transition-colors duration-200 ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span
                  className={`text-xl flex-shrink-0 ${
                    isActive ? "text-emerald-600" : ""
                  }`}
                >
                  {item.icon}
                </span>
                {isOpen && (
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 text-center text-xs text-gray-400">
          {isOpen && "© 2025 Neshan Dashboard"}
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-6 -left-4 bg-white border border-gray-200 shadow-md rounded-full p-2 hover:bg-gray-50 transition-transform duration-300"
      >
        <div
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <FiChevronLeft className="text-gray-700 text-lg" />
        </div>
      </button>
    </div>
  );
}
