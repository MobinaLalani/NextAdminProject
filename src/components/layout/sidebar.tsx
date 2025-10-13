import React from "react";
import { Home, Package, Users, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <span className="text-xl font-semibold text-gray-800">MyApp</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          <Home size={18} />
          <span>داشبورد</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          <Package size={18} />
          <span>سفارش‌ها</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          <Users size={18} />
          <span>مشتریان</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          <Settings size={18} />
          <span>تنظیمات</span>
        </a>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition w-full">
          <LogOut size={18} />
          <span>خروج</span>
        </button>
      </div>
    </aside>
  );
}
