import { useState, useRef, useEffect } from "react";
import LearnModal from "../LearnModal";

export default function ReefClusterSamplingModal({ isOpen, onClose }) {
  const [phase, setPhase] = useState("intro"); // intro | mid | finish
  const [step, setStep] = useState(0);
  const [selectedClusters, setSelectedClusters] = useState([]);

  const REEF_SIZE = { width: 400, height: 400 };
  const GRID_ROWS = 5;
  const GRID_COLS = 5;

  const leftPanelRef = useRef(null);

  const generateBoxes = () => {
    const boxes = [];
    const boxWidth = REEF_SIZE.width / GRID_COLS;
    const boxHeight = REEF_SIZE.height / GRID_ROWS;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        boxes.push({
          id: r * GRID_COLS + c,
          row: r,
          col: c,
          x: c * boxWidth,
          y: r * boxHeight,
          width: boxWidth,
          height: boxHeight,
        });
      }
    }
    return boxes;
  };
  const [boxes] = useState(generateBoxes());

  const sampleClusters = () => {
    const shuffled = [...boxes].sort(() => 0.5 - Math.random());
    setSelectedClusters(shuffled.slice(0, 4).map((b) => b.id));
  };

  const midStepsContent = [
    {
      title: "Reef",
      text: "We visualize Apo Reef as a single area. It is too large to survey entirely, so we divide it into smaller squares. Each square is a potential sampling cluster. This helps us organize the reef into manageable sections and ensures we don’t miss areas when studying biodiversity."
    },
    {
      title: "Clusters",
      text: "Each square in the grid represents a cluster. A cluster is a small section of the reef where the biologist can systematically count fish species, coral types, and other marine organisms. Clusters make data collection more structured and allow comparisons across the reef."
    },
    {
      title: "Random Selection",
      text: "Instead of studying all clusters, which would be time-consuming, a subset of clusters is randomly selected. Random selection ensures that every part of the reef has a chance to be included in the study, reducing bias and providing a representative sample."
    }
  ];

  const finishSlide = {
    title: "Study Sample",
    text: "Researchers will now dive into the selected clusters to record biodiversity data. By analyzing just these clusters, they can estimate the overall species richness and abundance for the entire reef. Cluster sampling makes large-scale ecological studies feasible without exhaustive surveying."
  };

  useEffect(() => {
    if (leftPanelRef.current) {
      leftPanelRef.current.scrollTo({
        top: leftPanelRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [step, phase]);

  const nextStep = () => {
    const next = step + 1;
    if (phase === "mid" && next === 2) sampleClusters(); // Random Selection triggers cluster sampling
    if (phase === "mid" && next >= midStepsContent.length) {
      setPhase("finish");
    } else {
      setStep(next);
    }
  };

  const prevStep = () => {
    if (phase === "finish") {
      setPhase("mid");
      setStep(midStepsContent.length - 1);
    } else if (phase === "mid") {
      if (step === 0) {
        setPhase("intro");
        setStep(0);
        setSelectedClusters([]);
      } else {
        setStep(step - 1);
      }
    } else if (phase === "intro") {
      // do nothing or close?
    }
  };

  const finish = () => {
    onClose();
    setPhase("intro");
    setStep(0);
    setSelectedClusters([]);
  };

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      setPhase("intro");
      setStep(0);
      setSelectedClusters([]);
    }
  }, [isOpen]);

  return (
    <LearnModal isOpen={isOpen} onClose={onClose} title="Cluster Sampling Simulation">
      <div className="flex h-full">
        {/* LEFT PANEL */}
        <div className="w-1/2 p-4 h-full flex flex-col">
          {phase === "intro" && (
            <>
              <p className="font-semibold text-2xl mb-4">Cluster Sampling</p>
              <div className="mb-4 p-3 bg-gray-100 border-l-4 border-blue-400 rounded-md text-gray-700">
                <p className="mb-2 text-sm">
                  Cluster sampling is a statistical method where the population
                  is divided into naturally occurring groups, or clusters—
                  such as locations, schools, or villages—and then entire
                  clusters are randomly selected for study.
                </p>
              </div>
              <p className="text-xl mb-2">Sample Problem</p>
              <p className="mb-4 text-sm text-gray-700">
                Suppose a marine biologist wants to study the overall biodiversity of Apo Reef in Mindoro—the largest contiguous reef in the Philippines. With over 34 square kilometers of underwater terrain, it is impossible for a dive team to examine every single square meter. To get an accurate estimate of the fish and coral species without spending years underwater, the biologist uses Cluster Sampling.
              </p>
              <button
                className="btn-primary w-fit self-end mt-auto"
                onClick={() => setPhase("mid")}
              >
                Try Example
              </button>
            </>
          )}

          {phase === "mid" && (
            <>
              <p className="font-semibold text-2xl mb-4">Sample Problem</p>
              <div
                className="flex-1 overflow-y-auto"
                ref={leftPanelRef}
              >
                {midStepsContent.slice(0, step + 1).map((s, idx) => (
                  <div key={idx} className="mb-6">
                    <p className="font-semibold text-xl mb-2">{s.title}</p>
                    <div className="p-3 bg-gray-100 border-l-4 border-green-400 rounded-md text-gray-700 text-sm">
                      {s.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn-secondary" onClick={prevStep}>Back</button>
                <button className="btn-primary" onClick={nextStep}>Next</button>
              </div>
            </>
          )}

         {phase === "finish" && (
         <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-fadeIn">
            <p className="text-3xl font-extrabold text-green-700 mb-4 animate-pulse">
               That's it!
            </p>
            <p className="font-semibold text-2xl mb-4">{finishSlide.title}</p>
            <div className="p-4 bg-green-50 rounded-xl shadow-md text-gray-700 text-base mb-6">
               {finishSlide.text}
            </div>
            <button
               className="btn-primary px-8 py-3 text-lg font-semibold"
               onClick={finish}
            >
               Finish
            </button>
         </div>
         )}
        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/2 p-4 flex justify-center items-center">
          {phase === "intro" && (
            <img
              src="/src/Assets/cluster_sampling_illustration.png"
              alt="Cluster Sampling"
              className="w-full h-full object-cover rounded-md border"
            />
          )}

          {(phase === "mid" || phase === "finish") && (
            <div
              className="relative border"
              style={{
                width: REEF_SIZE.width,
                height: REEF_SIZE.height,
                borderRadius: "0.25rem",
              }}
            >
              <img
                src="/src/Assets/apo_reef.png"
                alt="Apo Reef"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
              />

              {step >= 1 && boxes.map((b) => (
                <div
                  key={b.id}
                  style={{
                    position: "absolute",
                    left: b.x,
                    top: b.y,
                    width: b.width,
                    height: b.height,
                    border: "1px solid #94a3b8",
                    backgroundColor: (phase === "finish" || step >= 2) && selectedClusters.includes(b.id) ? "#22c55e80" : "transparent",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </LearnModal>
  );
}