import { useEffect, useRef, useState } from "react";
import { Wheel } from "spin-wheel";
import LearnModal from "../LearnModal";

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function getWheelItems(labels) {
  return labels.map((label, i) => ({
    label,
    backgroundColor: `hsl(${(i * 360) / labels.length}, 70%, 60%)`,
    labelColor: "#111",
  }));
}

export default function SimpleRandomSampling({ isOpen, onClose }) {
  const wheelContainerRef = useRef(null);
  const wheelRef = useRef(null);
  const abortRef = useRef(false);

  const [wheelList, setWheelList] = useState([
    "Zoro",
    "Luffy",
    "Nami",
    "Sanji",
    "Usopp",
    "Chopper",
    "Robin",
    "Franky",
    "Brook",
  ]);
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [textareaValue, setTextareaValue] = useState(wheelList.join(", "));
  const [chosenValuesTextAreaValue, setChosenValuesTextAreaValue] = useState("");
  const [withReplacement, setWithReplacement] = useState(false);
  const [sampleSizeValue, setSampleSize] = useState(3);
  const [sampleSizeError, setSampleSizeError] = useState("");
  const [chosenSamples, setChosenSamples] = useState([]);

  const learnData = {
    title: "Simple Random Sampling",
    description: `
Simple Random Sampling is a method of choosing a sample from a population so that every individual has an equal chance of being selected. Imagine everyone in the population is placed on a giant spin wheel. When the wheel spins, whoever it lands on is chosen for the sample. This randomness ensures that the selected group fairly represents the larger population, making your results reliable and unbiased.
`,
  };

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // Create/destroy wheel when modal opens/closes
  useEffect(() => {
    if (!isOpen || !wheelContainerRef.current) return;

    const wheel = new Wheel(wheelContainerRef.current, {
      items: getWheelItems(wheelList),
      isInteractive: false,
      lineColor: "#fff",
      lineWidth: 2,
      itemLabelFontSizeMax: 24,
    });
    wheelRef.current = wheel;

    return () => {
      wheel.remove();
      wheelRef.current = null;
    };
  }, [isOpen]);

  // Update wheel items when wheelList changes (and not simulating)
  useEffect(() => {
    if (wheelRef.current && isOpen && !isSimulating) {
      wheelRef.current.items = getWheelItems(wheelList);
    }
  }, [wheelList, isOpen, isSimulating]);

  // Update chosenSamples textarea
  useEffect(() => {
    setChosenValuesTextAreaValue(chosenSamples.join(", "));
  }, [chosenSamples]);

  const spinToItemAsync = (targetIndex) =>
    new Promise((resolve) => {
      const wheel = wheelRef.current;
      if (!wheel) return resolve(null);
      wheel.onRest = (event) => resolve(event);
      wheel.spinToItem(targetIndex, 3000, true, 3, 1, easeOutCubic);
    });

  const spinWheel = async (replacement, iterations) => {
    if (isSpinning) return;
    setIsSpinning(true);
    abortRef.current = false;
    const originalWheel = [...wheelList];
    let currentList = [...wheelList];

    for (let i = 0; i < iterations; i++) {
      if (abortRef.current) break;
      setSelectedSlice(null);

      const wheel = wheelRef.current;
      if (!wheel || currentList.length === 0) break;

      const randomIndex = Math.floor(Math.random() * currentList.length);

      wheel.items = getWheelItems(currentList);
      await spinToItemAsync(randomIndex);

      if (abortRef.current) break;

      const selectedLabel = currentList[randomIndex];
      setSelectedSlice(randomIndex);
      setChosenSamples((prev) => [...prev, selectedLabel]);

      if (!replacement) {
        currentList = currentList.filter((_, idx) => idx !== randomIndex);
      }

      await sleep(500);
    }

    setWheelList(originalWheel);
    if (wheelRef.current) {
      wheelRef.current.items = getWheelItems(originalWheel);
    }
    setIsSpinning(false);
  };

  // Simulate button
  const simulateSampling = async () => {
    setIsSimulating(true);
    let iterations = Number(sampleSizeValue);
    if (!iterations || iterations <= 0) return;
    await spinWheel(withReplacement, iterations);
  };

  const handleButton = async () => {
    if (isSimulating) {
      resetWheel();
    } else {
      await simulateSampling();
    }
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setTextareaValue(value);
    const items = value.split(",").map((x) => x.trim()).filter(Boolean);
    if (items.length) setWheelList(items);
  };

  const handleSampleSizeChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setSampleSize("");
      setSampleSizeError("Sample Size Empty");
      return;
    }
    const isNumber = /^\d+(\.\d+)?$/.test(value);
    const isPercent = /^\d+(\.\d+)?%$/.test(value);
    if (!isNumber && !isPercent) {
      setSampleSizeError("Enter a number or a percentage (e.g. 50 or 25%)");
      setSampleSize(value);
      return;
    }
    if (isNumber && parseFloat(value) > wheelList.length) {
      setSampleSizeError("Sample Size cannot exceed the number of items in the wheel");
      setSampleSize(value);
      return;
    }
    if (isPercent && parseFloat(value) > 100) {
      setSampleSizeError("Percentage cannot exceed 100%");
      setSampleSize(value);
      return;
    }
    setSampleSizeError("");
    setSampleSize(value);
  };

  const resetWheel = () => {
    abortRef.current = true;
    const wheel = wheelRef.current;
    if (wheel) wheel.stop();
    setIsSpinning(false);
    setIsSimulating(false);
    setSelectedSlice(null);
    setChosenSamples([]);
    setChosenValuesTextAreaValue("");
    const items = textareaValue.split(",").map((x) => x.trim()).filter(Boolean);
    setWheelList(items.length ? items : wheelList);
    if (wheel && items.length) {
      wheel.items = getWheelItems(items);
    }
  };

  const handelClose = () => {
    resetWheel()
    onClose?.()
  }

  return (
    <LearnModal isOpen={isOpen} onClose={handelClose}>
      <div className="flex">
        {/* Left panel */}
        <div className="w-1/2 p-4">
          <div className="text-3xl font-semibold text-gray-800 mb-4">{learnData.title}</div>
          {!isSimulating && (
            <div className="text-600 text-[14px] text-justify">
              {learnData.description.split("\n").map((line, idx) => {
                const trimmed = line.trim();
                return trimmed ? <p key={idx} className="mb-4">{line}</p> : null;
              })}
            </div>
          )}

          <div className="flex flex-col gap-2 mt-4">
            <label className="font-semibold">Population</label>
            <textarea
              value={textareaValue}
              disabled={isSimulating}
              onChange={handleTextareaChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {!isSimulating && (
            <div className="mt-4">
              <label className="font-semibold block mb-2">Sampling Method</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="replacement"
                    checked={!withReplacement}
                    onChange={() => setWithReplacement(false)}
                  />
                  <span>Without replacement</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="replacement"
                    checked={withReplacement}
                    onChange={() => setWithReplacement(true)}
                  />
                  <span>With replacement</span>
                </label>
              </div>
            </div>
          )}

          {!isSimulating && (
            <div>
              <label className="font-semibold">Sample Size</label>
              <input
                type="text"
                value={sampleSizeValue}
                onChange={handleSampleSizeChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-red-500 text-sm">{sampleSizeError}</div>
            </div>
          )}

          {chosenSamples.length > 0 && isSimulating && (
            <div className="flex flex-col gap-2 mt-4">
              <label className="font-semibold">Chosen Samples</label>
              <textarea
                value={chosenValuesTextAreaValue}
                disabled
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleButton}
              disabled={isSpinning || wheelList.length === 0}
              className={`px-4 py-2 rounded text-white ${
                isSpinning ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSimulating ? (isSpinning ? "Simulating..." : "End Simulation") : "Simulate"}
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-1/2 p-4">
          <div className="relative w-full aspect-square border-2 border-gray-300 rounded bg-gray-100 overflow-hidden">
            <div ref={wheelContainerRef} className="w-full h-full min-h-[200px]" />
            {/* Pointer overlay at top */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 w-0 h-0"
              style={{
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "20px solid #1f2937",
              }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </LearnModal>
  );
}
