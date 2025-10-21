"use client";
import React, { useState, useRef, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
interface ProfileDropdownProps {
  onLogout?: () => void;
}

export default function ProfileDropdown({ onLogout }: ProfileDropdownProps) {
  const { clearUser } = useUserStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative " ref={dropdownRef} >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="focus:outline-none"
      >
        <Image
          src="/icons/ProfileIcon.svg"
          alt="Profile"
          className="border-4 border-white rounded-full transform transition-transform duration-300 hover:scale-110"
          width={50}
          height={50}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-12 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <a
                href="/dashboard/profile"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                پروفایل من
              </a>
            </li>
            <li>
              <button
                onClick={() => {
                  onLogout?.();
                  clearUser();
                  setOpen(false);
                }}
                className="w-full text-right px-4 py-2 hover:bg-gray-100"
              >
                خروج
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
