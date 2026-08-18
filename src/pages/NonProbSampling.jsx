import { useState } from "react";
import LearnItem from "../components/LearnItem";
import ConvenienceSamplingModal from "../components/modals/nonprob_modals/ConvenienceSampling";
import VoluntaryResponseSamplingModal from "../components/modals/nonprob_modals/VoluntaryResponseSampling";
import JudgmentalSamplingModal from "../components/modals/nonprob_modals/JudgmentalSampling";
import QuotaSamplingModal from "../components/modals/nonprob_modals/QuotaSampling";
import SnowballSamplingModal from "../components/modals/nonprob_modals/SnowballSampling";

const nonprob_item_props = [
  {
    title: "Convenience Sampling",
    description:
      "Sample whoever is easiest to reach, rather than choosing at random — fast and cheap, but often badly skewed.",
    modal: "convenience",
  },
  {
    title: "Voluntary Response Sampling",
    description:
      "Individuals choose for themselves whether to participate, like an online poll — people with strong opinions tend to respond more.",
    modal: "voluntary",
  },
  {
    title: "Judgmental (Purposive) Sampling",
    description:
      "The researcher deliberately hand-picks people they believe are most useful for the study, based on their own judgment.",
    modal: "judgmental",
  },
  {
    title: "Quota Sampling",
    description:
      "The population is split into subgroups with a target count each, but within each subgroup people are picked non-randomly, whoever is first available.",
    modal: "quota",
  },
  {
    title: "Snowball Sampling",
    description:
      "Used for hard-to-reach populations — a few seed subjects refer more subjects, growing the sample through a referral chain.",
    modal: "snowball",
  },
];

export default function NonProbSampling() {
  const [openModal, setOpenModal] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center container mx-auto px-4 py-12">
        <div className="w-full max-w-2xl mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">Non-Probability Sampling Methods</h2>
          <p className="text-sm text-gray-500 mt-1">
            Unlike probabilistic methods, these don't give every member of the population a known
            chance of being selected — they're often quicker but more prone to bias. Tap a method
            to see how it works.
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-4">
          {nonprob_item_props.map((item, idx) => (
            <LearnItem
              key={idx}
              title={item.title}
              description={item.description}
              onClick={() => setOpenModal(item.modal)}
            />
          ))}
        </div>
      </div>

      <ConvenienceSamplingModal
        isOpen={openModal === "convenience"}
        onClose={() => setOpenModal(null)}
      />

      <VoluntaryResponseSamplingModal
        isOpen={openModal === "voluntary"}
        onClose={() => setOpenModal(null)}
      />

      <JudgmentalSamplingModal
        isOpen={openModal === "judgmental"}
        onClose={() => setOpenModal(null)}
      />

      <QuotaSamplingModal
        isOpen={openModal === "quota"}
        onClose={() => setOpenModal(null)}
      />

      <SnowballSamplingModal
        isOpen={openModal === "snowball"}
        onClose={() => setOpenModal(null)}
      />
    </div>
  );
}
