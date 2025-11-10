// components/ui/Drawer.tsx
"use client";

import React from "react";

interface DrawerProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string; // مثلا "380px"
}

export default function Drawer({
  title,
  open,
  onClose,
  children,
  footer,
  width = "380px",
}: DrawerProps) {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-white border-r shadow-xl z-50 transition-transform duration-300`}
      style={{ width }}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="font-semibold">{title}</h2>
        <button className="text-xl" onClick={onClose}>
          ×
        </button>
      </div>

      {/* محتوای اصلی */}
      <div
        className="p-4 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 100px)" }}
      >
        {children}
      </div>

      {footer && <div className="p-4 border-t flex gap-2">{footer}</div>}
    </div>
  );
}
