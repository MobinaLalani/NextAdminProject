"use client";
import React from "react";
import { LogOut } from "lucide-react";
import { menuItems } from "./menuItem";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";

export default function Sidebar() {
  const { user, clearUser } = useUserStore();
  if (!user) return null;


  return (
    <aside className="w-64 bg-blue-200 border-r border-gray-200 h-screen flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <span className="text-xl font-semibold text-gray-800">MyApp</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
      </nav>

      {/* <div className="border-t border-gray-200 p-4">
        <button
          onClick={clearUser}
          className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition w-full"
        >
          <LogOut size={18} />
          <span>خروج</span>
        </button>
      </div> */}
    </aside>
  );
}
