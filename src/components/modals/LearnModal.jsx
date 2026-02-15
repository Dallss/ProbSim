import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function LearnModal({ isOpen: parentOpen = false, children }) {
  const [isOpen, setIsOpen] = useState(parentOpen);

  // Sync with parent open state
  useEffect(() => {
    if (parentOpen) setIsOpen(true);
  }, [parentOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setIsOpen(false)} // backdrop closes modal
    >
      <div
        className="bg-white w-4/5 h-4/5 rounded-lg relative p-6 overflow-auto shadow-lg"
        onClick={(e) => e.stopPropagation()} // clicks inside modal do NOT close
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl font-bold"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
