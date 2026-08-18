import { useState } from "react";
import LearnModal from "../LearnModal";

const BOX = { width: 320, height: 220 };
const POP_SIZE = 30;
const SAMPLE_SIZE = 8;

function generatePopulation() {
  return Array.from({ length: POP_SIZE }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * (BOX.width - 20),
    y: 10 + Math.random() * (BOX.height - 20),
  }));
}

export default function ConvenienceSamplingModal({ isOpen, onClose }) {
  const [population, setPopulation] = useState(generatePopulation);
  const [sampledIds, setSampledIds] = useState(null);

  const doorY = BOX.height / 2;

  const simulate = () => {
    const withDist = population.map((p) => ({
      ...p,
      dist: Math.hypot(p.x - 0, p.y - doorY),
    }));
    withDist.sort((a, b) => a.dist - b.dist);
    setSampledIds(new Set(withDist.slice(0, SAMPLE_SIZE).map((p) => p.id)));
  };

  const reshuffle = () => {
    setPopulation(generatePopulation());
    setSampledIds(null);
  };

  const handleClose = () => {
    setSampledIds(null);
    onClose?.();
  };

  return (
    <LearnModal isOpen={isOpen} onClose={handleClose}>
      <div className="flex">
        <div className="w-1/2 p-4">
          <div className="text-3xl font-semibold text-gray-800 mb-4">Convenience Sampling</div>
          <p className="text-sm text-gray-700 mb-4 text-justify">
            Convenience sampling selects whoever is easiest to reach, rather than choosing at
            random. Picture a researcher standing at the door of a room, surveying only the
            people who happen to walk closest by. It's fast and cheap, but the sample can be
            badly skewed toward whoever is conveniently located — everyone else, no matter how
            relevant, never gets a chance to be picked.
          </p>

          {sampledIds && (
            <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-fade-in">
              <p className="text-amber-700 font-bold mb-1">Sampled the {SAMPLE_SIZE} closest to the door</p>
              <p className="text-sm text-gray-600">
                Notice these people aren't random at all — they're just whoever was nearest the
                entrance. People at the far side of the room had zero chance of being included.
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button className="btn-primary" onClick={simulate}>
              Simulate
            </button>
            <button className="btn-secondary" onClick={reshuffle}>
              New Population
            </button>
          </div>
        </div>

        <div className="w-1/2 p-4 flex items-center justify-center">
          <div
            className="relative border-2 border-gray-300 rounded bg-gray-50"
            style={{ width: BOX.width, height: BOX.height }}
          >
            {/* Door marker */}
            <div
              className="absolute -left-3 flex flex-col items-center"
              style={{ top: doorY - 14 }}
            >
              <div className="w-3 h-7 bg-gray-700 rounded-sm" />
              <span className="text-[10px] text-gray-600 mt-1">door</span>
            </div>

            {population.map((p) => {
              const isSampled = sampledIds?.has(p.id);
              return (
                <div
                  key={p.id}
                  className={`absolute w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    sampledIds
                      ? isSampled
                        ? "bg-amber-500 ring-2 ring-amber-300"
                        : "bg-gray-300"
                      : "bg-blue-500"
                  }`}
                  style={{
                    left: p.x,
                    top: p.y,
                    transform: `translate(-50%, -50%) scale(${isSampled ? 1.4 : 1})`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </LearnModal>
  );
}
