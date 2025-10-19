"use client";
import React from "react";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data: { success: boolean; message?: string } = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Logout failed");
      }

      // ریدایرکت به لندینگ بعد از خروج
      window.location.href = "/landing";
    } catch (err) {
      if (err instanceof Error) {
        console.error("Logout error:", err.message);
      } else {
        console.error("Logout error: اتفاقی رخ داد");
      }
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} priority />
          <span className="text-xl font-semibold text-gray-800">MyApp</span>
        </div>

        {/* Middle: Links */}
        <div className="hidden md:flex items-center gap-6 text-gray-600">
          <a href="#features" className="hover:text-gray-900 transition">
            ویژگی‌ها
          </a>
          <a href="#pricing" className="hover:text-gray-900 transition">
            قیمت‌ها
          </a>
          <a href="#faq" className="hover:text-gray-900 transition">
            سؤالات متداول
          </a>
          <a href="#contact" className="hover:text-gray-900 transition">
            تماس
          </a>
        </div>

        {/* Right: Profile */}
        <ProfileDropdown onLogout={handleLogout} />
      </div>
    </nav>
  );
}
