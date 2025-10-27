"use client";
import Modal from "@/components/ui/Modal";
import { useModal } from "@/hooks/useModal";
import { useState } from "react";
import { MapStore } from "@/store/mapStore";

export default function SearchModal() {
  const { isOpen, content, openModal, closeModal } = useModal();
  const [input, setInput] = useState("");
  const setSearchText = MapStore((state) => state.setSearchText);

  const handleOpen = () => {
    openModal(
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold mb-2">Search Modal</h2>
        <input
          type="text"
          placeholder="Lat, Lng"
          className="border rounded px-3 py-2 w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSearchText(input); // ذخیره تو store
              closeModal();
            }}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            جستجو
          </button>
          <button
            onClick={closeModal}
            className="mt-3 bg-gray-300 px-4 py-2 rounded"
          >
            لغو
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-10">
      <button
        onClick={handleOpen}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        باز کردن مودال
      </button>

      <Modal open={isOpen} onClose={closeModal}>
        {content}
      </Modal>
    </div>
  );
}