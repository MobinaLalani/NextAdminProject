"use client";

import { useState } from "react";
import {
  FiHome,
  FiSettings,
  FiMap,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: <FiHome />, label: "خانه" },
    { icon: <FiMap />, label: "نقشه" },
    { icon: <FiSettings />, label: "تنظیمات" },
  ];

  return (
    <div className="relative flex">
      {/* سایدبار */}
      <div
        className={`flex flex-col bg-white  shadow-lg h-screen transition-all duration-300 ${
          isOpen ? "w-56" : "w-16"
        }`}
      >
        {/* آیتم‌های منو */}
        <div className="flex flex-col  items-center justify-center h-full space-y-2 px-2">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span className="text-gray-700">{item.label}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* دکمه‌ی فلش */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-6 -left-4 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition-transform duration-300"
      >
        {isOpen ? (
          <FiChevronLeft className="text-gray-700 text-lg" />
        ) : (
          <FiChevronRight className="text-gray-700 text-lg" />
        )}
      </button>
    </div>
  );
}
