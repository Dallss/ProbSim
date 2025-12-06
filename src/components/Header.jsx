// src/components/Header.jsx
import React, { useEffect, useRef } from "react";
import "./floating.css";

const Header = () => {
  const containerRef = useRef(null);

  const base = import.meta.env.BASE_URL; // handles dev vs production paths

  const icons = [
    `${base}floating_icons/icon1.png`,
    `${base}floating_icons/icon2.png`,
    `${base}floating_icons/icon3.png`,
    `${base}floating_icons/icon4.png`,
    `${base}floating_icons/icon5.png`,
    `${base}floating_icons/icon6.png`,
    `${base}floating_icons/icon7.png`,
  ];

  useEffect(() => {
    const stage = containerRef.current;
    const n = 7; // total number of floating icons
    if (!stage || icons.length === 0) return;

    stage.innerHTML = "";
    const stageRect = stage.getBoundingClientRect();

    const minSize = 30;
    const maxSize = 160;
    const minDur = 6;
    const maxDur = 24;

    // Horizontal partitions
    const reservedLeft = stageRect.width * 0.4;
    const reservedRight = stageRect.width * 0.6;
    const leftPartition = { min: 0, max: reservedLeft };
    const rightPartition = { min: reservedRight, max: stageRect.width };

    for (let i = 0; i < n; i++) {
      const img = document.createElement("img");
      img.className = "float";
      img.src = icons[i % icons.length];
      img.draggable = false;

      const size = Math.round(minSize + Math.random() * (maxSize - minSize));
      img.style.width = size + "px";

      // Vertical: anywhere
      const top = Math.random() * (stageRect.height - size);
      img.style.top = top + "px";

      // Horizontal: split left/right evenly
      const partition = i % 2 === 0 ? leftPartition : rightPartition;
      const left = partition.min + Math.random() * (partition.max - partition.min - size);
      img.style.left = left + "px";

      // Drift & rotation
      const dx = Math.random() * stageRect.width * 0.3 - stageRect.width * 0.15;
      const dy = Math.random() * stageRect.height * 0.3 - stageRect.height * 0.15;
      const startRot = Math.round(Math.random() * 360) + "deg";
      const rotDelta = Math.round(Math.random() * 60 - 30) + "deg";
      const op = 0.4 + Math.random() * 0.6;
      const dur = (minDur + Math.random() * (maxDur - minDur)).toFixed(2) + "s";
      const delay = (-Math.random() * parseFloat(dur)).toFixed(2) + "s";

      img.style.setProperty("--dx", dx + "px");
      img.style.setProperty("--dy", dy + "px");
      img.style.setProperty("--start-rot", startRot);
      img.style.setProperty("--rotDelta", rotDelta);
      img.style.setProperty("--op", op);

      img.style.animation = `float ${dur} linear infinite`;
      img.style.animationDelay = delay;

      stage.appendChild(img);
    }
  }, [icons]);

  return (
    <div className="floating-stage relative">
      <div ref={containerRef} className="absolute inset-0"></div>
      <div className="floating-title text-center relative z-10">
        <h1 className="text-5xl font-bold py-3">ProbSim</h1>
        <p className="text-lg text-gray-700 font-medium">
          Probabilistic Sampling Methods Simulator
        </p>
      </div>
    </div>
  );
};

export default Header;
