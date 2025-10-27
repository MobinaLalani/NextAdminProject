"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";


interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  // بستن مودال با کلید ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"></div>

      {/* Content */}
      <div
        className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 z-10 animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن با کلیک داخل مودال
      >
        {/* Header */}
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
        )}

        {/* Body */}
        <div>{children}</div>

        {/* Footer */}
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
