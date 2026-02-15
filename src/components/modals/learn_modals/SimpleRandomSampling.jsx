import { useEffect, useRef, useState } from "react";
import LearnModal from "../LearnModal";

export default function SimpleRandomSampling({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const rotationRef = useRef(0);
  const animationFrameRef = useRef(null);

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

  // Utility: light or dark text color
  function isLightColor(h, s = 70, l = 60) {
    const c = (1 - Math.abs(2 * l / 100 - 1)) * (s / 100);
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l / 100 - c / 2;
    let r1, g1, b1;
    if (h < 60) [r1, g1, b1] = [c, x, 0];
    else if (h < 120) [r1, g1, b1] = [x, c, 0];
    else if (h < 180) [r1, g1, b1] = [0, c, x];
    else if (h < 240) [r1, g1, b1] = [0, x, c];
    else if (h < 300) [r1, g1, b1] = [x, 0, c];
    else [r1, g1, b1] = [c, 0, x];
    const r = Math.round((r1 + m) * 255);
    const g = Math.round((g1 + m) * 255);
    const b = Math.round((b1 + m) * 255);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 150;
  }

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // Draw the wheel
  function drawWheel(rotation = rotationRef.current) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.offsetWidth || 300;
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;
    const sliceAngle = (2 * Math.PI) / wheelList.length;

    const colors = wheelList.map((_, i) => {
      const hue = (i * 360) / wheelList.length;
      return { h: hue, color: `hsl(${hue}, 70%, 60%)` };
    });

    wheelList.forEach((label, index) => {
      const startAngle = index * sliceAngle + rotation;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = selectedSlice === index ? "#34d399" : colors[index].color;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle =
        selectedSlice === index ? "#111" : isLightColor(colors[index].h) ? "#111" : "#FFF";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(label, radius - 15, 5);
      ctx.restore();
    });

    // Pointer
    ctx.beginPath();
    ctx.moveTo(centerX, 25);
    ctx.lineTo(centerX - 10, 5);
    ctx.lineTo(centerX + 10, 5);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
  }

  // Redraw wheel whenever modal opens
  useEffect(() => {
    if (isOpen) setTimeout(drawWheel, 50);
  }, [isOpen, wheelList, selectedSlice]);

  // Update chosenSamples textarea
  useEffect(() => {
    setChosenValuesTextAreaValue(chosenSamples.join(", "));
  }, [chosenSamples]);

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // Spin logic
  const spinWheel = async (replacement, iterations) => {
    if (isSpinning) return;
    setIsSpinning(true);
    const originalWheel = [...wheelList];

    for (let i = 0; i < iterations; i++) {
      setSelectedSlice(null);

      const sliceAngle = (2 * Math.PI) / wheelList.length;
      const randomSlice = Math.floor(Math.random() * wheelList.length);
      const randomOffset = Math.random() * sliceAngle;
      const spins = 3; // full rotations
      const finalRotation = spins * 2 * Math.PI + randomSlice * sliceAngle + randomOffset;

      const duration = 3000;
      let startTime = null;

      await new Promise((resolve) => {
        const animate = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const t = Math.min(elapsed / duration, 1);
          const eased = easeOutCubic(t);

          rotationRef.current = finalRotation * eased;
          drawWheel(rotationRef.current);

          if (t < 1) {
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            const normalizedRotation = rotationRef.current % (2 * Math.PI);
            const pointerAngle = (3 * Math.PI / 2 - normalizedRotation + 2 * Math.PI) % (2 * Math.PI);
            const selectedIndex = Math.floor((pointerAngle + sliceAngle / 2) / sliceAngle) % wheelList.length;

            setSelectedSlice(selectedIndex);
            setChosenSamples((prev) => [...prev, wheelList[selectedIndex]]);

            if (!replacement) {
              wheelList.splice(selectedIndex, 1);
              setWheelList([...wheelList]);
            }

            resolve();
          }
        };
        animationFrameRef.current = requestAnimationFrame(animate);
      });

      await sleep(500); // small pause between spins
    }
    setWheelList(originalWheel);
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

  // Fully cancelable reset
  const resetWheel = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setIsSpinning(false);
    setIsSimulating(false);
    rotationRef.current = 0;
    setSelectedSlice(null);
    setChosenSamples([]);
    setChosenValuesTextAreaValue("");
    const items = textareaValue.split(",").map((x) => x.trim()).filter(Boolean);
    setWheelList(items);
    drawWheel(0);
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
          <canvas ref={canvasRef} className="w-full aspect-square border-2 bg-gray-100" />
        </div>
      </div>
    </LearnModal>
  );
}
