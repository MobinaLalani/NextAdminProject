"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/ui/Modal";

export default function Navbar() {
  const { isOpen, content, openModal, closeModal } = useModal();

  const handleOpenSearch = () => {
    openModal(
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">جستجوی نقشه</h2>
        <input
          type="text"
          placeholder="Lat, Lng"
          className="border rounded px-3 py-2 w-full"
        />
        <button
          onClick={closeModal}
          className="bg-blue-600 text-white px-4 py-2 rounded self-end"
        >
          جستجو
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-[#F9F2F2]shadow-md px-[50px]">
        {/* آیکون جستجو سمت چپ */}

        <div className="text-xl font-bold">My App</div>
        <button
          onClick={handleOpenSearch}
          className="text-gray-700 hover:text-gray-900 text-2xl"
        >
          <FiSearch />
        </button>
      </div>

      {/* مودال */}
      <Modal open={isOpen} onClose={closeModal}>
        {content}
      </Modal>
    </>
  );
}
