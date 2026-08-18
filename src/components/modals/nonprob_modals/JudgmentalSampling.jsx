import { useMemo, useState } from "react";
import LearnModal from "../LearnModal";

const POP_SIZE = 24;
// Realistic mix: most people are novices, only a few are true experts.
const STAR_WEIGHTS = [30, 25, 20, 15, 10]; // weights for 1..5 stars

function weightedStars() {
  const total = STAR_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < STAR_WEIGHTS.length; i++) {
    if (r < STAR_WEIGHTS[i]) return i + 1;
    r -= STAR_WEIGHTS[i];
  }
  return STAR_WEIGHTS.length;
}

function generatePopulation() {
  return Array.from({ length: POP_SIZE }, (_, i) => ({ id: i, stars: weightedStars() }));
}

function Stars({ n }) {
  return (
    <span className="text-xs leading-none">
      {"★".repeat(n)}
      <span className="text-gray-300">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export default function JudgmentalSamplingModal({ isOpen, onClose }) {
  const [population, setPopulation] = useState(generatePopulation);
  const [minStars, setMinStars] = useState(4);
  const [simulated, setSimulated] = useState(false);

  const selected = useMemo(
    () => (simulated ? population.filter((p) => p.stars >= minStars) : []),
    [population, minStars, simulated]
  );

  const reshuffle = () => {
    setPopulation(generatePopulation());
    setSimulated(false);
  };

  const handleClose = () => {
    setSimulated(false);
    onClose?.();
  };

  return (
    <LearnModal isOpen={isOpen} onClose={handleClose}>
      <div className="flex">
        <div className="w-1/2 p-4">
          <div className="text-3xl font-semibold text-gray-800 mb-4">Judgmental (Purposive) Sampling</div>
          <p className="text-sm text-gray-700 mb-4 text-justify">
            Here the researcher uses their own expertise to hand-pick the people they believe are
            most useful for the study — for example, only interviewing recognized experts on a
            topic. Unlike random methods, the selection is entirely deliberate: everyone who
            doesn't meet the researcher's criteria is left out on purpose, no matter how the
            "dice" would have fallen.
          </p>

          <div className="mt-4">
            <label className="font-semibold block mb-2">
              Researcher's criteria: select people with at least {minStars} star{minStars > 1 ? "s" : ""} of expertise
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={minStars}
              onChange={(e) => {
                setMinStars(Number(e.target.value));
                setSimulated(false);
              }}
              className="w-full"
            />
          </div>

          {simulated && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-fade-in">
              <p className="text-amber-700 font-bold mb-1">
                {selected.length} of {POP_SIZE} chosen by judgment
              </p>
              <p className="text-sm text-gray-600">
                Nothing here is random — the same {selected.length} people would be picked every
                time, because the criteria (not chance) decides who's in the sample.
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button className="btn-primary" onClick={() => setSimulated(true)}>
              Apply Criteria
            </button>
            <button className="btn-secondary" onClick={reshuffle}>
              New Population
            </button>
          </div>
        </div>

        <div className="w-1/2 p-4">
          <div className="grid grid-cols-4 gap-2">
            {population.map((p) => {
              const isSelected = simulated && p.stars >= minStars;
              return (
                <div
                  key={p.id}
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded border transition-all duration-300 ${
                    simulated
                      ? isSelected
                        ? "bg-amber-100 border-amber-400 scale-105"
                        : "bg-gray-50 border-gray-200 opacity-50"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <span className="text-lg">🧑</span>
                  <Stars n={p.stars} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </LearnModal>
  );
}
