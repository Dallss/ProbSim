import { useState } from "react";
import LearnModal from "../LearnModal";

const OPINIONS = [-2, -1, 0, 1, 2];
const OPINION_LABELS = {
  "-2": "Strongly against",
  "-1": "Against",
  "0": "Neutral",
  "1": "For",
  "2": "Strongly for",
};
// Weighted so most of the population feels moderate, like a real crowd.
const WEIGHTS = [1, 3, 5, 3, 1];
const POP_SIZE = 120;

function weightedOpinion() {
  const total = WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < WEIGHTS.length; i++) {
    if (r < WEIGHTS[i]) return OPINIONS[i];
    r -= WEIGHTS[i];
  }
  return OPINIONS[OPINIONS.length - 1];
}

function generatePopulation() {
  return Array.from({ length: POP_SIZE }, (_, i) => ({ id: i, opinion: weightedOpinion() }));
}

// People with strong opinions are far more likely to volunteer a response.
function responseProbability(opinion) {
  return 0.12 + 0.22 * Math.abs(opinion);
}

export default function VoluntaryResponseSamplingModal({ isOpen, onClose }) {
  const [population, setPopulation] = useState(generatePopulation);
  const [responders, setResponders] = useState(null);

  const simulate = () => {
    const ids = new Set();
    population.forEach((p) => {
      if (Math.random() < responseProbability(p.opinion)) ids.add(p.id);
    });
    setResponders(ids);
  };

  const reshuffle = () => {
    setPopulation(generatePopulation());
    setResponders(null);
  };

  const handleClose = () => {
    setResponders(null);
    onClose?.();
  };

  const countsFor = (ids) => {
    const counts = Object.fromEntries(OPINIONS.map((o) => [o, 0]));
    (ids ? population.filter((p) => ids.has(p.id)) : population).forEach((p) => {
      counts[p.opinion]++;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return OPINIONS.map((o) => ({ opinion: o, pct: (counts[o] / total) * 100 }));
  };

  const popDist = countsFor(null);
  const respDist = responders ? countsFor(responders) : null;

  return (
    <LearnModal isOpen={isOpen} onClose={handleClose}>
      <div className="flex">
        <div className="w-1/2 p-4">
          <div className="text-3xl font-semibold text-gray-800 mb-4">Voluntary Response Sampling</div>
          <p className="text-sm text-gray-700 mb-4 text-justify">
            In voluntary response sampling, people choose for themselves whether to be in the
            sample — think of an online poll or a call-in survey. The catch: people with strong
            opinions are much more motivated to respond than people who feel lukewarm. That means
            the sample tends to over-represent the extremes, even if the underlying population is
            fairly balanced.
          </p>

          {responders && (
            <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-fade-in">
              <p className="text-amber-700 font-bold mb-1">{responders.size} of {POP_SIZE} people volunteered</p>
              <p className="text-sm text-gray-600">
                Compare the two bars below for each opinion — responders skew toward "strongly
                against" and "strongly for" compared to the true population.
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button className="btn-primary" onClick={simulate}>
              Open the Poll
            </button>
            <button className="btn-secondary" onClick={reshuffle}>
              New Population
            </button>
          </div>
        </div>

        <div className="w-1/2 p-4 flex flex-col justify-center">
          <div className="flex justify-center gap-3 mb-2 text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block" /> Population</span>
            {responders && (
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> Responders</span>
            )}
          </div>
          <div className="flex items-end justify-center gap-4 h-48 border-b border-gray-300 px-2">
            {popDist.map((d, idx) => (
              <div key={d.opinion} className="flex items-end gap-1 h-full">
                <div
                  className="w-6 bg-blue-400 rounded-t transition-all duration-500"
                  style={{ height: `${d.pct}%` }}
                  title={`${d.pct.toFixed(0)}%`}
                />
                {respDist && (
                  <div
                    className="w-6 bg-amber-500 rounded-t transition-all duration-500"
                    style={{ height: `${respDist[idx].pct}%` }}
                    title={`${respDist[idx].pct.toFixed(0)}%`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-2 px-2">
            {OPINIONS.map((o) => (
              <div key={o} className="text-[10px] text-gray-500 text-center" style={{ width: respDist ? 56 : 24 }}>
                {OPINION_LABELS[o]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LearnModal>
  );
}
