import { useState, useRef, useEffect } from "react";
import LearnModal from "../LearnModal";

// Strata definitions for the worked example: a school of students grouped by grade level.
// counts/sample are scaled down for a clean visual, but keep the same proportions
// a real proportional-allocation calculation would produce.
const STRATA = [
  { id: "g9", label: "Grade 9", color: "bg-blue-400", ring: "ring-blue-600", count: 15, sample: 3 },
  { id: "g10", label: "Grade 10", color: "bg-emerald-400", ring: "ring-emerald-600", count: 14, sample: 3 },
  { id: "g11", label: "Grade 11", color: "bg-amber-400", ring: "ring-amber-600", count: 11, sample: 2 },
  { id: "g12", label: "Grade 12", color: "bg-pink-400", ring: "ring-pink-600", count: 10, sample: 2 },
];

const TOTAL_POPULATION = STRATA.reduce((sum, s) => sum + s.count, 0);
const TOTAL_SAMPLE = STRATA.reduce((sum, s) => sum + s.sample, 0);

function generateDots() {
  const dots = {};
  STRATA.forEach((s) => {
    dots[s.id] = Array.from({ length: s.count }, (_, i) => i);
  });
  return dots;
}

export default function StratifiedSamplingModal({ isOpen, onClose }) {
  const [phase, setPhase] = useState("intro"); // intro | mid | finish
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState({}); // { strataId: [dotIndex, ...] }

  const leftPanelRef = useRef(null);
  const [dots] = useState(generateDots());

  const sampleWithinStrata = () => {
    const result = {};
    STRATA.forEach((s) => {
      const shuffled = [...dots[s.id]].sort(() => 0.5 - Math.random());
      result[s.id] = shuffled.slice(0, s.sample);
    });
    setSelected(result);
  };

  const midStepsContent = [
    {
      title: "Population",
      text: `Suppose a school wants to survey ${TOTAL_POPULATION * 10}-ish students about new library hours, drawn from grades 9 through 12. If we just grabbed a simple random sample, we could easily end up with too many students from one grade and too few from another, skewing the results.`,
    },
    {
      title: "Strata",
      text: "To avoid that, the population is first divided into homogeneous, non-overlapping subgroups called strata — here, one stratum per grade level. Every student belongs to exactly one stratum.",
    },
    {
      title: "Proportional Allocation",
      text: "Next, we decide how many students to sample from each stratum. With proportional allocation, larger strata contribute proportionally more to the sample, so each grade's share of the final sample matches its share of the population.",
    },
    {
      title: "Random Selection",
      text: "Finally, within each stratum, students are selected using simple random sampling. Combining the per-stratum samples gives a final sample that is representative of every grade level.",
    },
  ];

  const finishSlide = {
    title: "Final Sample",
    text: `The combined sample includes students from every grade in proportion to their share of the school, giving a much more representative picture than an unstratified random sample could. In total, ${TOTAL_SAMPLE} of the ${TOTAL_POPULATION} visualized students were selected — proportionally split across all four strata.`,
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
    if (phase === "mid" && next === midStepsContent.length - 1) sampleWithinStrata(); // Random Selection step
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
        setSelected({});
      } else {
        setStep(step - 1);
      }
    }
  };

  const finish = () => {
    onClose();
    setPhase("intro");
    setStep(0);
    setSelected({});
  };

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      setPhase("intro");
      setStep(0);
      setSelected({});
    }
  }, [isOpen]);

  // Intro shows the fully-divided illustration as a preview; the "mid" walkthrough
  // starts from an undivided population (step 0) and reveals strata/counts/selection
  // as the learner steps through it.
  const showColors = phase !== "mid" || step >= 1;
  const showCounts = phase === "finish" || step >= 2;
  const showSelection = phase === "finish" || step >= 3;

  const renderStrataGrid = () => (
    <div className="grid grid-cols-2 gap-3 w-full">
      {STRATA.map((s) => (
        <div
          key={s.id}
          className={`rounded-lg border p-3 transition-colors duration-300 ${
            showColors ? "border-gray-300 bg-gray-50" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">{s.label}</span>
            {showCounts && (
              <span className="text-[10px] text-gray-500">
                n={s.count}{showSelection ? `, sample=${s.sample}` : ""}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {dots[s.id].map((idx) => {
              const isSelected = showSelection && selected[s.id]?.includes(idx);
              return (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    showColors ? s.color : "bg-gray-300"
                  } ${isSelected ? `ring-2 ring-offset-1 ${s.ring} scale-125` : ""}`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <LearnModal isOpen={isOpen} onClose={onClose} title="Stratified Sampling Simulation">
      <div className="flex h-full">
        {/* LEFT PANEL */}
        <div className="w-1/2 p-4 h-full flex flex-col">
          {phase === "intro" && (
            <>
              <p className="font-semibold text-2xl mb-4">Stratified Sampling</p>
              <div className="mb-4 p-3 bg-gray-100 border-l-4 border-blue-400 rounded-md text-gray-700">
                <p className="mb-2 text-sm">
                  Stratified sampling is a statistical method where the population is first
                  divided into distinct, non-overlapping subgroups called strata based on a
                  shared characteristic, and then a sample is drawn from each stratum —
                  ensuring every subgroup is represented.
                </p>
              </div>
              <p className="text-xl mb-2">Sample Problem</p>
              <p className="mb-4 text-sm text-gray-700">
                A school administrator wants to survey students about new library hours. The
                student body spans grades 9 through 12, and opinions may vary a lot by grade.
                To make sure every grade level is fairly represented in the results, the
                administrator uses Stratified Sampling: split the students by grade, then
                randomly sample within each grade in proportion to its size.
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
          {renderStrataGrid()}
        </div>
      </div>
    </LearnModal>
  );
}
