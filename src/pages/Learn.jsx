import { useState } from "react";
import LearnItem from "../components/LearnItem";
import SystematicSamplingModal from "../components/modals/learn_modals/SystematicSampling";
import SimpleRandomSampling from "../components/modals/learn_modals/SimpleRandomSampling";

const learn_item_props = [
  {
    title: "Simple Random Sampling (SRS)",
    description:
      "Every member of the population has an equal chance of being selected. Usually done using random numbers or random generators.",
    modal: "srs",
  },
  {
    title: "Systematic Sampling",
    description:
      "Pick a random starting point, then select every k-th member from the population list.",
    modal: "systematic",
  },
  {
    title: "Cluster Sampling",
    description:
      "Divide the population into clusters (groups), randomly select clusters, then include all members of the selected clusters.",
    modal: "cluster",
  },
  {
    title: "Stratified Sampling",
    description:
      "Divide the population into strata (subgroups based on characteristics), then randomly sample from each stratum.",
    modal: "stratified",
  },
  {
    title: "Multistage Sampling",
    description:
      "Sampling is done in multiple stages, combining methods (for example: select clusters, then do random sampling inside each cluster).",
    modal: "multistage",
  },
];

export default function Learn() {
  // Modal states
  const [openModal, setOpenModal] = useState(null);
  // values: null | "srs" | "systematic" | etc

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center container mx-auto px-4 py-12">
        <div className="w-full max-w-2xl space-y-4">
          {learn_item_props.map((item, idx) => (
            <LearnItem
              key={idx}
              title={item.title}
              description={item.description}
              onClick={() => setOpenModal(item.modal)}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <SystematicSamplingModal
        isOpen={openModal === "systematic"}
        onClose={() => setOpenModal(null)}
        populationSize={30}
        sampleSize={6}
      />

      <SimpleRandomSampling
        isOpen={openModal === "srs"}
        onClose={() => setOpenModal(null)}
      />
    </div>
  );
}
