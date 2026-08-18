import { useState } from "react";
import LearnModal from "../LearnModal";

const CENTER = { x: 200, y: 200 };
const RADIUS_STEP = 55;
const MAX_ROUNDS = 4;
const MAX_NODES = 30;

function seedNode() {
  return [{ id: "seed", round: 0, parentId: null, x: CENTER.x, y: CENTER.y }];
}

export default function SnowballSamplingModal({ isOpen, onClose }) {
  const [nodes, setNodes] = useState(seedNode);
  const [round, setRound] = useState(0);

  const growNetwork = () => {
    if (round >= MAX_ROUNDS || nodes.length >= MAX_NODES) return;

    const parents = nodes.filter((n) => n.round === round);
    const children = [];
    parents.forEach((parent) => {
      const refCount = 1 + Math.floor(Math.random() * 2); // each person refers 1-2 more
      for (let i = 0; i < refCount; i++) {
        if (nodes.length + children.length >= MAX_NODES) break;
        children.push({
          id: `${parent.id}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          round: round + 1,
          parentId: parent.id,
        });
      }
    });

    const nextRound = round + 1;
    const radius = RADIUS_STEP * nextRound;
    const angleOffset = nextRound * 18 * (Math.PI / 180);
    const positioned = children.map((c, i) => {
      const angle = (2 * Math.PI * i) / children.length + angleOffset;
      return {
        ...c,
        x: CENTER.x + radius * Math.cos(angle),
        y: CENTER.y + radius * Math.sin(angle),
      };
    });

    setNodes((prev) => [...prev, ...positioned]);
    setRound(nextRound);
  };

  const reset = () => {
    setNodes(seedNode());
    setRound(0);
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const roundCounts = {};
  nodes.forEach((n) => (roundCounts[n.round] = (roundCounts[n.round] || 0) + 1));

  return (
    <LearnModal isOpen={isOpen} onClose={handleClose}>
      <div className="flex">
        <div className="w-1/2 p-4">
          <div className="text-3xl font-semibold text-gray-800 mb-4">Snowball Sampling</div>
          <p className="text-sm text-gray-700 mb-4 text-justify">
            Snowball sampling is used when the population is hard to reach or identify directly —
            for example, a hidden or niche community. Researchers start with a small number of
            seed subjects, then ask each one to refer other people who fit the study. The sample
            grows through a chain of referrals, like a snowball rolling downhill and picking up
            more snow.
          </p>

          <div className="mt-4 text-sm text-gray-700">
            {Object.keys(roundCounts).map((r) => (
              <div key={r}>
                {r === "0" ? "Seed" : `Round ${r}`}: {roundCounts[r]} {roundCounts[r] === 1 ? "person" : "people"}
              </div>
            ))}
            <div className="font-semibold mt-1">Total sampled: {nodes.length}</div>
          </div>

          {round >= MAX_ROUNDS && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-fade-in">
              <p className="text-amber-700 font-bold mb-1">Referral chain complete</p>
              <p className="text-sm text-gray-600">
                Every person in the sample was found only because someone before them referred
                them in — none were reached independently or at random.
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              className="btn-primary"
              onClick={growNetwork}
              disabled={round >= MAX_ROUNDS || nodes.length >= MAX_NODES}
            >
              {round === 0 ? "Recruit from Seed" : "Next Round of Referrals"}
            </button>
            <button className="btn-secondary" onClick={reset}>
              Reset
            </button>
          </div>
        </div>

        <div className="w-1/2 p-4 flex items-center justify-center">
          <svg viewBox="0 0 400 400" className="w-full h-full max-w-[380px]">
            {nodes
              .filter((n) => n.parentId)
              .map((n) => {
                const parent = nodeById[n.parentId];
                if (!parent) return null;
                return (
                  <line
                    key={`edge-${n.id}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={n.x}
                    y2={n.y}
                    stroke="#cbd5e1"
                    strokeWidth={1.5}
                  />
                );
              })}
            {nodes.map((n) => (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.round === 0 ? 12 : 8}
                  fill={n.round === 0 ? "#f59e0b" : "#3b82f6"}
                  stroke="#fff"
                  strokeWidth={2}
                  className="transition-all duration-500"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </LearnModal>
  );
}
