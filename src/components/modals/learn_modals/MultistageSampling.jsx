import { useState, useRef, useEffect } from "react";
import LearnModal from "../LearnModal";

// Worked example: a province made of villages (stage 1 clusters), each containing
// households (stage 2 sampling units). Counts are scaled down for a clean visual.
const VILLAGES = [
  { id: "v1", label: "Village A", color: "bg-blue-400", ring: "ring-blue-600", row: 0, col: 0 },
  { id: "v2", label: "Village B", color: "bg-emerald-400", ring: "ring-emerald-600", row: 0, col: 1 },
  { id: "v3", label: "Village C", color: "bg-amber-400", ring: "ring-amber-600", row: 0, col: 2 },
  { id: "v4", label: "Village D", color: "bg-pink-400", ring: "ring-pink-600", row: 1, col: 0 },
  { id: "v5", label: "Village E", color: "bg-purple-400", ring: "ring-purple-600", row: 1, col: 1 },
  { id: "v6", label: "Village F", color: "bg-cyan-400", ring: "ring-cyan-600", row: 1, col: 2 },
];

const HOUSEHOLDS_PER_VILLAGE = 8;
const CLUSTERS_TO_SELECT = 3;
const SAMPLE_PER_CLUSTER = 3;

const TOTAL_POPULATION = VILLAGES.length * HOUSEHOLDS_PER_VILLAGE;
const TOTAL_SAMPLE = CLUSTERS_TO_SELECT * SAMPLE_PER_CLUSTER;

function generateHouseholds() {
  const households = {};
  VILLAGES.forEach((v) => {
    households[v.id] = Array.from({ length: HOUSEHOLDS_PER_VILLAGE }, (_, i) => i);
  });
  return households;
}

export default function MultistageSamplingModal({ isOpen, onClose }) {
  const [phase, setPhase] = useState("intro"); // intro | mid | finish
  const [step, setStep] = useState(0);
  const [selectedClusters, setSelectedClusters] = useState([]); // village ids chosen in stage 1
  const [selectedHouseholds, setSelectedHouseholds] = useState({}); // { villageId: [householdIdx, ...] }

  const leftPanelRef = useRef(null);
  const [households] = useState(generateHouseholds());

  const selectClusters = () => {
    const shuffled = [...VILLAGES].sort(() => 0.5 - Math.random());
    setSelectedClusters(shuffled.slice(0, CLUSTERS_TO_SELECT).map((v) => v.id));
  };

  const sampleWithinClusters = (clusters) => {
    const result = {};
    clusters.forEach((id) => {
      const shuffled = [...households[id]].sort(() => 0.5 - Math.random());
      result[id] = shuffled.slice(0, SAMPLE_PER_CLUSTER);
    });
    setSelectedHouseholds(result);
  };

  const midStepsContent = [
    {
      title: "Population",
      text: `A province is made up of several villages, and every village has many households. Surveying every household in every village would take far too long, so a public health researcher uses Multistage Sampling — combining more than one sampling method across stages.`,
    },
    {
      title: "Stage 1: Select Clusters",
      text: `First, the villages act as clusters. Instead of visiting all ${VILLAGES.length} villages, the researcher randomly selects ${CLUSTERS_TO_SELECT} of them — just like Cluster Sampling. Every village has an equal chance of being chosen.`,
    },
    {
      title: "Stage 2: Sample Within Clusters",
      text: `Rather than surveying every household in the selected villages, the researcher now takes a Simple Random Sample of ${SAMPLE_PER_CLUSTER} households from each selected village. Combining stages like this reduces travel and cost while still covering different parts of the province.`,
    },
  ];

  const finishSlide = {
    title: "Final Sample",
    text: `${CLUSTERS_TO_SELECT} of ${VILLAGES.length} villages were randomly selected as clusters, then ${SAMPLE_PER_CLUSTER} households were randomly sampled from each — giving a final sample of ${TOTAL_SAMPLE} households out of ${TOTAL_POPULATION} visualized. Multistage sampling lets each stage use whichever method fits best, making large surveys practical.`,
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
    if (phase === "mid" && next === 1) selectClusters(); // entering "Stage 1" triggers cluster selection
    if (phase === "mid" && next === 2) {
      // entering "Stage 2" triggers within-cluster sampling, using whichever
      // clusters were just chosen (state may not have flushed yet)
      setSelectedClusters((current) => {
        sampleWithinClusters(current);
        return current;
      });
    }
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
        setSelectedHouseholds({});
      } else {
        if (step === 2) setSelectedHouseholds({});
        if (step === 1) setSelectedClusters([]);
        setStep(step - 1);
      }
    }
  };

  const finish = () => {
    onClose();
    setPhase("intro");
    setStep(0);
    setSelectedClusters([]);
    setSelectedHouseholds({});
  };

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      setPhase("intro");
      setStep(0);
      setSelectedClusters([]);
      setSelectedHouseholds({});
    }
  }, [isOpen]);

  const showClusterHighlight = phase === "finish" || step >= 1;
  const showHouseholdSelection = phase === "finish" || step >= 2;

  const renderVillageGrid = () => (
    <div className="grid grid-cols-3 gap-3 w-full">
      {VILLAGES.map((v) => {
        const isCluster = selectedClusters.includes(v.id);
        return (
          <div
            key={v.id}
            className={`rounded-lg border p-3 transition-colors duration-300 ${
              showClusterHighlight && isCluster
                ? `border-2 ${v.ring} bg-gray-50`
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">{v.label}</span>
              {showClusterHighlight && isCluster && (
                <span className="text-[10px] text-gray-500">
                  {showHouseholdSelection ? `sample=${SAMPLE_PER_CLUSTER}` : "selected"}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {households[v.id].map((idx) => {
                const isSelectedHousehold =
                  showHouseholdSelection && isCluster && selectedHouseholds[v.id]?.includes(idx);
                const dimmed = showClusterHighlight && !isCluster;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                      dimmed ? "bg-gray-200" : v.color
                    } ${isSelectedHousehold ? `ring-2 ring-offset-1 ${v.ring} scale-125` : ""}`}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <LearnModal isOpen={isOpen} onClose={onClose} title="Multistage Sampling Simulation">
      <div className="flex h-full">
        {/* LEFT PANEL */}
        <div className="w-1/2 p-4 h-full flex flex-col">
          {phase === "intro" && (
            <>
              <p className="font-semibold text-2xl mb-4">Multistage Sampling</p>
              <div className="mb-4 p-3 bg-gray-100 border-l-4 border-blue-400 rounded-md text-gray-700">
                <p className="mb-2 text-sm">
                  Multistage sampling selects a sample in two or more stages, often
                  combining different sampling methods along the way — for example,
                  randomly selecting clusters first, then randomly sampling individuals
                  within just the selected clusters.
                </p>
              </div>
              <p className="text-xl mb-2">Sample Problem</p>
              <p className="mb-4 text-sm text-gray-700">
                A public health researcher wants to estimate vaccination rates across a
                province with many villages, each containing many households. Visiting
                every household in every village isn't feasible. Using Multistage
                Sampling, the researcher first randomly selects a handful of villages
                (Stage 1: cluster sampling), then randomly samples households within
                just those villages (Stage 2: simple random sampling).
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
              <div className="flex-1 overflow-y-auto" ref={leftPanelRef}>
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
          {renderVillageGrid()}
        </div>
      </div>
    </LearnModal>
  );
}
