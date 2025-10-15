import React from "react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32} // معادل w-8
            height={32} // معادل h-8
            priority
          />
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
          <button className="hidden sm:block px-4 my-2 text-gray-700 hover:text-gray-900 transition">
            <Image
              src="/icons/ProfileIcon.svg"
              alt="Profile"
              className="border-4 border-white rounded-full transform transition-transform duration-300 hover:scale-110"
              width={50}
              height={50}
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
