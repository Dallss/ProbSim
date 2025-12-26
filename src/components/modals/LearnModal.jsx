import { createPortal } from "react-dom";

export default function LearnModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-4/5 h-4/5 rounded-lg relative p-6 overflow-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
