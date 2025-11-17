"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft } from "react-icons/fi";

interface DrawerProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export default function Sidebar({
  title,
  open,
  onClose,
  children,
  footer,
  width = "380px",
}: DrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="rounded-2xl fixed right-0 top-0 bottom-0 bg-white shadow-2xl z-50 border-l border-gray-200 flex flex-col"
            style={{
              width,
              right: "32px",
              top: "24px",
              bottom: "24px",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              {title && <h2 className="font-semibold text-lg">{title}</h2>}
            </div>

            <div
              className="flex-1 overflow-y-auto p-4"
              style={{ maxHeight: "calc(100vh - 150px)" }}
            >
              {children}
            </div>

            {footer && (
              <div className="p-4 border-t rounded-2xl border-gray-200 bg-white">
                {footer}
              </div>
            )}

            <button
              onClick={onClose}
              className="absolute top-6 -left-5 bg-white border border-gray-300 shadow-lg rounded-full p-2 hover:bg-gray-100 transition"
            >
              <FiChevronLeft className="text-gray-700 text-lg rotate-180" />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
