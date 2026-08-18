import { useState } from "react";
import LearnModal from "../LearnModal";

const GROUPS = [
  { key: "A", label: "Group A", size: 10, icon: "🧑" },
  { key: "B", label: "Group B", size: 10, icon: "🧑‍🦱" },
];
const DEFAULT_QUOTA = 4;

function generateQueue(size) {
  return Array.from({ length: size }, (_, i) => ({ id: i }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuotaSamplingModal({ isOpen, onClose }) {
  const [queues, setQueues] = useState(() =>
    Object.fromEntries(GROUPS.map((g) => [g.key, generateQueue(g.size)]))
  );
  const [quota, setQuota] = useState(DEFAULT_QUOTA);
  const [simulated, setSimulated] = useState(false);

  const reshuffleOrder = () => {
    setQueues((prev) =>
      Object.fromEntries(GROUPS.map((g) => [g.key, shuffle(prev[g.key])]))
    );
  };

  const reset = () => {
    setQueues(Object.fromEntries(GROUPS.map((g) => [g.key, generateQueue(g.size)])));
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
          <div className="text-3xl font-semibold text-gray-800 mb-4">Quota Sampling</div>
          <p className="text-sm text-gray-700 mb-4 text-justify">
            Quota sampling splits the population into subgroups and sets a target ("quota") for
            how many to interview from each — much like stratified sampling. The key difference:
            within each subgroup, the interviewer doesn't pick randomly. They simply take whoever
            they encounter first until the quota is filled, so the arrival order — not chance —
            decides who ends up in the sample.
          </p>

          <div className="mt-4">
            <label className="font-semibold block mb-2">Quota per group: {quota}</label>
            <input
              type="range"
              min={1}
              max={10}
              value={quota}
              onChange={(e) => {
                setQuota(Number(e.target.value));
                setSimulated(false);
              }}
              className="w-full"
            />
          </div>

          {simulated && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-fade-in">
              <p className="text-amber-700 font-bold mb-1">
                Filled with the first {quota} from each group
              </p>
              <p className="text-sm text-gray-600">
                Try "Reshuffle Arrival Order" — the sample changes not because of a controlled
                random draw, but simply because different people happened to show up first.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <button className="btn-primary" onClick={() => setSimulated(true)}>
              Fill Quotas
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                reshuffleOrder();
              }}
            >
              Reshuffle Arrival Order
            </button>
            <button className="btn-secondary" onClick={reset}>
              Reset
            </button>
          </div>
        </div>

        <div className="w-1/2 p-4 flex flex-col gap-6 justify-center">
          {GROUPS.map((g) => (
            <div key={g.key}>
              <div className="text-sm font-semibold text-gray-700 mb-2">
                {g.label} <span className="text-gray-400 font-normal">(arrival order →)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {queues[g.key].map((person, idx) => {
                  const isSelected = simulated && idx < quota;
                  return (
                    <div
                      key={person.id}
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-base border transition-all duration-300 ${
                        simulated
                          ? isSelected
                            ? "bg-amber-100 border-amber-400 scale-110"
                            : "bg-gray-50 border-gray-200 opacity-40"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {g.icon}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </LearnModal>
  );
}
