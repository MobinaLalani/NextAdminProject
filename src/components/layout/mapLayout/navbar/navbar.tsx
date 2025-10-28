"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";
import SearchModal from "./SearchModal";

export default function Navbar() {
  return (
    <>
      <div className="flex items-center justify-between p-4 bg-[#F9F2F2] shadow-md px-[50px]">
        <div className="text-xl font-bold">My App</div>

        {/* دکمه سرچ */}
        <SearchModal>
          <button className="text-gray-700 hover:text-gray-900 text-2xl">
            <FiSearch />
          </button>
        </SearchModal>
      </div>
    </>
  );
}
