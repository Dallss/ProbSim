import React from "react";

export default function UnderDevOverlay({ children, message = "Under Development" }) {
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 pointer-events-none">
        <span className="text-yellow-400 font-bold text-lg uppercase tracking-wider">
          {message}
        </span>
      </div>
    </div>
  );
}
