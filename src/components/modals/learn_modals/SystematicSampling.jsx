import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import LearnModal from "../LearnModal";

export default function SystematicSamplingModal({ isOpen, onClose }) {
  const containerRef = useRef(null);
  const queueWrapperRef = useRef(null);
  const tlRef = useRef(null); // timeline reference
  
  // Single state machine
  const [simState, setSimState] = useState("idle"); // "idle" | "playing" | "done"

  // Sampling variables
  const [populationSize, setPopulationSize] = useState(30);
  const [sampleSize, setSampleSize] = useState(5);
  const step = Math.floor(populationSize / sampleSize); 
  const i_step = step - 1;
  const start = 3;
  const i_start = start - 1;

  // Logger ref
  const logRef = useRef(null);

  const log = (message) => {
    if (!logRef.current) return;
    const entry = document.createElement("div");
    entry.textContent = message;
    entry.className = "text-xs font-mono text-gray-800";
    logRef.current.appendChild(entry);
    logRef.current.scrollTop = logRef.current.scrollHeight; // auto-scroll
  };

  // Box refs
  const boxRefs = useRef([]);
  const MIN_GAP = 0;

  const playSimulation = () => {
    if (simState === "playing") return;
    setSimState("playing");

    // Clear previous logs
    if (logRef.current) logRef.current.innerHTML = "";

    const tl = gsap.timeline({
      defaults: { duration: 0.5 },
      onComplete: () => setSimState("done"),
    });
    tlRef.current = tl; // store reference

    const queueRect = queueWrapperRef.current.getBoundingClientRect();
    let rowOffset = 0;
    let prevTop = boxRefs.current[0]?.getBoundingClientRect().top || 0;

    // pick starting labels
    const iToKBoxLabels = [];
    for (let i = 0; i <= i_step; i++) {
      const box = boxRefs.current[i];
      if (!box) continue;
      const boxLabel = box.querySelector(".step-counter");
      iToKBoxLabels.push(boxLabel);
    }

    // Animate labels appearing 1 → k
    iToKBoxLabels.forEach((label, idx) => {
      if (!label) return;
      label.style.opacity = 0;
      label.textContent = idx === i_step ? 'k' : idx + 1;
      tl.to(label, { opacity: 1, duration: 0.5, ease: "power1.out" }, 0);
    });
    iToKBoxLabels.forEach((label, idx) => {
      if (!label) return;
      label.style.opacity = 0;
      tl.to(label, { opacity: 0, duration: 0.5, ease: "power1.out" }, 1);
    });

    // Simulate systematic sampling
    for (let i = i_start; i < populationSize; i++) {
      const box = boxRefs.current[i];
      if (!box) continue;

      const boxLabel = box.querySelector(".label");
      const boxStepCounter = box.querySelector(".step-counter");
      const boxRect = box.getBoundingClientRect();

      // Highlight animation
      tl.to(boxLabel, {
        backgroundColor: "#ffe066",
        scale: 1.1,
        onStart: () => {
          const value = ((i - i_start) % step === 0) ? 'pick' : (i - i_start) % step;
          boxStepCounter.textContent = value;
          boxStepCounter.style.opacity = "1";

          if ((i - i_start) % step === 0) {
            log(`Picked: ${i + 1}`);
          }
        },
        onComplete: () => boxStepCounter.style.opacity = "0",
      });
      tl.to(boxLabel, { backgroundColor: "#f472b6", scale: 1 });

      // Compute wrapping
      if (boxRect.top > prevTop) {
        rowOffset += boxRect.height + MIN_GAP;
        prevTop = boxRect.top;
      }
      const targetY = rowOffset;

      // Only animate selected boxes to queue
      if ((i - i_start) % step === 0) {
        tl.to(boxLabel, {
          x: 0,
          y: targetY - (boxRect.top - queueRect.top),
          onComplete: () => {
            const cloned = boxLabel.cloneNode(true);
            cloned.style.marginTop = "0.5rem";
            queueWrapperRef.current.appendChild(cloned);

            gsap.set(boxLabel, { x: 0, y: 0 });
            gsap.set(cloned, { x: 0, y: 0 });
            boxLabel.style.opacity = "0";
          },
        });
        tl.to({}, { duration: 1 });
      }
    }
  };

  const resetSimulation = () => {
    // Kill any running timeline
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    // Clear queue & logs
    if (queueWrapperRef.current) queueWrapperRef.current.innerHTML = "";
    if (logRef.current) logRef.current.innerHTML = "";

    // Reset boxes
    boxRefs.current.forEach((box) => {
      if (!box) return;
      const counter = box.querySelector(".step-counter");
      const label = box.querySelector(".label");
      counter.textContent = "-1";
      counter.style.opacity = "0";
      label.style.backgroundColor = "#ec4899";
      label.style.scale = "1";
      label.style.opacity = "1";
      gsap.set(label, { x: 0, y: 0, clearProps: "all" }); // reset transforms
    });

    setSimState("idle");
  };


  const handleClose = () => {
    resetSimulation(); // DOM still exists
    onClose?.();
  };
  

  return (
    <LearnModal isOpen={isOpen} onClose={handleClose} title="Systematic Sampling Simulation">
      <div className="flex h-full">

        {/* Left panel */}
        <div className="w-1/2 p-4 h-full flex flex-col">
          <p className="font-semibold text-2xl mb-4">Systematic Sampling</p>

          {/* Conditional: Overview or Logger */}
          {simState === "idle" ? (
            <div className="mb-4 p-3 bg-gray-100 border-l-4 border-pink-500 rounded-md text-gray-700">
              <p className="font-semibold mb-1 text-sm">Overview</p>
              <p className="mb-2 text-sm">
                A statistical method to select elements from a population at regular intervals, ensuring an evenly spaced sample.
              </p>
              <p className="font-semibold mb-1 text-sm">Use Case</p>
              <p className="mb-2 text-sm">
                Suitable for surveys, quality control, and studies requiring evenly distributed samples without full randomization.
              </p>
              <p className="font-semibold mb-1 text-sm">Procedure</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Define population size <strong>N</strong> and sample size <strong>k</strong>.</li>
                <li>Compute interval: <strong>step = floor(N / k)</strong>.</li>
                <li>Choose a random start <strong>r</strong>, 1 ≤ r ≤ step.</li>
                <li>Select elements at positions: <strong>r, r + step, ..., r + (k-1)·step</strong>.</li>
              </ol>
            </div>
          ) : (
            <div
              ref={logRef}
              className="mb-4 flex-1 bg-gray-200 text-green-400 p-2 rounded font-mono text-xs overflow-y-auto"
            />
          )}

          {/* Inputs + Play/Reset button */}
          <div className="mb-4 flex gap-4 flex-1">
            <div className="flex-1 space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">Population Size (max 30)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={populationSize}
                  onChange={(e) => {
                    const val = Math.min(30, Math.max(1, parseInt(e.target.value) || 1));
                    setPopulationSize(val);
                  }}
                  className="border px-2 py-1 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sample Size</label>
                <input
                  type="number"
                  min={0}
                  max={populationSize}
                  value={sampleSize}
                  onChange={(e) => setSampleSize(parseInt(e.target.value) || 0)}
                  className="border px-2 py-1 rounded w-full"
                />
              </div>

              <button
                onClick={simState === "done" ? resetSimulation : playSimulation}
                disabled={simState === "playing"}
                className={`px-4 py-2 rounded-md text-white ${
                  simState === "playing"
                    ? "bg-pink-300 cursor-not-allowed"
                    : simState === "done"
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-pink-500 hover:bg-pink-600"
                } mt-2`}
              >
                {simState === "playing" ? "Playing..." : simState === "done" ? "Reset" : "Play Simulation"}
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-1/2 p-4 h-full">
          <div ref={containerRef} className="flex flex-col w-full h-full bg-gray-100 overflow-hidden p-4 rounded-md">
            {/* Population boxes */}
            <div className="w-full flex flex-wrap">
              {Array.from({ length: populationSize }).map((_, i) => (
                <div
                  key={i}
                  ref={(el) => (boxRefs.current[i] = el)}
                  className="flex flex-col items-center"
                >
                  <div className="step-counter p-0 text-xs font-bold opacity-0">-1</div>
                  <div className="label w-10 h-10 m-2 bg-pink-500 text-white flex items-center justify-center rounded-md">{i + 1}</div>
                </div>
              ))}
            </div>

            {/* Queue wrapper */}
            <div
              ref={queueWrapperRef}
              className="flex flex-wrap w-full h-auto mt-auto min-h-[56px] border-2 border-dashed border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    </LearnModal>
  );
}
