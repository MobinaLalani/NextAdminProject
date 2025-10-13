import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
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

        {/* Right: Buttons */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:block px-4 py-2 text-gray-700 hover:text-gray-900 transition">
            ورود
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            ثبت‌نام
          </button>
        </div>
      </div>
    </nav>
  );
}
