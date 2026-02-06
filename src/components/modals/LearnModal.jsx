import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

export default function LearnModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  const canvasRef = useRef(null);

  const [wheelList, setWheelList] = useState(['Zoro', 'Luffy', 'Nami', 'Sanji', 'Usopp', 'Chopper', 'Robin', 'Franky', 'Brook']);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [textareaValue, setTextareaValue] = useState(wheelList.join(', '));
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

 // Utility: determine if a color is "light" or "dark" (for text contrast)
function isLightColor(h, s = 70, l = 60) {
  // Convert HSL to RGB
  const c = (1 - Math.abs(2 * l / 100 - 1)) * (s / 100);
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l / 100 - c / 2;
  let r1, g1, b1;
  if (h < 60)      [r1,g1,b1]=[c,x,0];
  else if (h < 120)[r1,g1,b1]=[x,c,0];
  else if (h < 180)[r1,g1,b1]=[0,c,x];
  else if (h < 240)[r1,g1,b1]=[0,x,c];
  else if (h < 300)[r1,g1,b1]=[x,0,c];
  else             [r1,g1,b1]=[c,0,x];
  const r = Math.round((r1+m)*255);
  const g = Math.round((g1+m)*255);
  const b = Math.round((b1+m)*255);

  // Perceived brightness formula
  const brightness = (r*299 + g*587 + b*114)/1000;
  return brightness > 150; // true = light color
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Draw the wheel
function drawWheel() {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const size = canvas.offsetWidth;
  canvas.width = size;
  canvas.height = size;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 10;

  ctx.clearRect(0, 0, size, size);

  const sliceAngle = (2 * Math.PI) / wheelList.length;

  // Generate colors evenly spaced around the hue wheel
  const colors = wheelList.map((_, i) => {
    const hue = (i * 360) / wheelList.length;
    return { h: hue, color: `hsl(${hue}, 70%, 60%)` };
  });

  wheelList.forEach((label, index) => {
    const startAngle = index * sliceAngle + rotation;
    const endAngle = startAngle + sliceAngle;

    // Slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    // Fill with selected slice override
    ctx.fillStyle = selectedSlice === index ? "#34d399" : colors[index].color;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    // Text
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = "right";

    // Automatically pick readable text color
    ctx.fillStyle = selectedSlice === index 
      ? "#111" // selected slice text contrast
      : (isLightColor(colors[index].h) ? "#111" : "#FFF");
    
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(label, radius - 15, 5);
    ctx.restore();
  });

  // Pointer
  ctx.beginPath();
  ctx.moveTo(centerX, 25);       // tip pointing down
  ctx.lineTo(centerX - 10, 5);   // left corner
  ctx.lineTo(centerX + 10, 5);   // right corner
  ctx.closePath();
  ctx.fillStyle = "black";
  ctx.fill();
}

  useEffect(() => {
    if (isOpen) drawWheel();
  }, [isOpen, wheelList, rotation, selectedSlice]);

  // Updates Chosen Samples field while simulating
  useEffect(() => {
    if (selectedSlice !== null) {
      setChosenSamples(prev => [...prev, wheelList[selectedSlice]]);
    }
  }, [selectedSlice]);
  
  // Update textarea based on the chosenSamples array
  useEffect(() => {
    setChosenValuesTextAreaValue(chosenSamples.join(", "));
  }, [chosenSamples]);

  // Easing function (easeOutCubic)
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // Spin the wheel
  const spinWheel = async (replacement, iterations) => {
    if (isSpinning) return;
    setIsSpinning(true);
    const originalWheel = [...wheelList]; // keep original for restoration
  
    for (let i = 0; i < iterations; i++) {
      setSelectedSlice(null);
  
      const sliceAngle = (2 * Math.PI) / wheelList.length;
      const randomSlice = Math.floor(Math.random() * wheelList.length);
      const randomOffset = Math.random() * sliceAngle; // randomness within slice
      const spins = 0; // number of full rotations
      const finalRotation = spins * 2 * Math.PI + randomSlice * sliceAngle + randomOffset;
  
      const duration = 3000;
      let startTime = null;
  
      const animate = (timestamp) => {

        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(t);
  
        setRotation(finalRotation * eased);
  
        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          const sliceCount = wheelList.length;
        const sliceAngle = (2 * Math.PI) / sliceCount;

        // Wrap rotation into [0, 2π)
        const normalizedRotation = finalRotation % (2 * Math.PI);

        // Pointer points at 12 o'clock, which is -π/2 relative to 0
        const pointerAngle = (3 * Math.PI / 2 - normalizedRotation + 2 * Math.PI) % (2 * Math.PI);

        // Add half a slice so we pick the slice that the pointer is closest to
        const selectedIndex = Math.floor((pointerAngle + sliceAngle / 2) / sliceAngle) % sliceCount;

        console.log("Selected index:", wheelList[selectedIndex]);

  
          setSelectedSlice(selectedIndex);
  
          if (!replacement) {
            wheelList.splice(selectedIndex, 1);
            // Update temporary state so wheel redraws correctly
            setWheelList([...wheelList]);
          }
        }
      };
  
      requestAnimationFrame(animate);
      await sleep(4000);
    }
  
    // Restore the original wheel after simulation ends
    setWheelList(originalWheel);
    setIsSpinning(false);
  };

  const handleButton = async () => {
    if (isSimulating) {
      setChosenSamples([]);
      setIsSimulating(false);
    } 
    else { 
      await simulateSampling(); 
    } 
  }

  const simulateSampling = async () => {

    setIsSimulating(true);
    let iterations;
  
    // Handle percentage
    if (typeof sampleSizeValue === "string" && sampleSizeValue.endsWith("%")) {
      const percent = parseFloat(sampleSizeValue);
      iterations = Math.round((percent / 100) * wheelList.length);
    } 
    // Handle number
    else {
      iterations = Number(sampleSizeValue);
    }
  
    if (!iterations || iterations <= 0) return;
      
    await spinWheel(withReplacement, iterations);
    
  };
  
  useEffect(() => {
    console.log("chosenSamples changed:", chosenSamples);
  }, [chosenSamples]);
  
  // Handle textarea change
  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setTextareaValue(value);

    // Convert comma-separated text into array
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    if (items.length > 0) {
      setWheelList(items);
    }
  };

  const handleSampleSizeChange = (e) => {
    const value = e.target.value;

    // Handle empty input
    if (value === "") {
      setSampleSize("");
      setSampleSizeError("Sample Size Empty");
      return;
    }

    // Number (e.g. 50, 12.5)
    const isNumber = /^\d+(\.\d+)?$/.test(value);

    // Percent (e.g. 25%, 12.5%)
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

    // Extra rule: percentage ≤ 100
    if (isPercent && parseFloat(value) > 100) {
      setSampleSizeError("Percentage cannot exceed 100%");
      setSampleSize(value);
      return;
    }

    // Valid
    setSampleSizeError("");
    setSampleSize(value);
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-4/5 h-4/5 rounded-lg relative p-6 overflow-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex">
          {/* Left panel */}
          <div className="w-1/2 p-4">
            <div className="text-3xl font-semibold text-gray-800 mb-4">
              {learnData.title}
            </div>

            {!isSimulating && <div className="text-600 text-[14px] text-justify">
              {learnData.description.split("\n").map((line, idx) => {
                const trimmed = line.trim();
                return trimmed ? (
                  <p key={idx} className="mb-4">{line}</p>
                ) : null;
              })}
            </div>}

            {/* Textarea for wheel data */}
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
            {/* Replacement option */}
            {!isSimulating && <div className="mt-4">
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
            </div>}

            {/* Sample Size */}
            {!isSimulating &&<div>
              <label className="font-semibold">Sample Size</label>
              <input type="text" value={sampleSizeValue} onChange={handleSampleSizeChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <div className="text-red-500 text-sm">{sampleSizeError}</div>  
            </div>}
            
            {chosenSamples.length > 0 && isSimulating && <div className="flex flex-col gap-2 mt-4">
              <label className="font-semibold">Chosen Samples</label>
              <textarea
                value={chosenValuesTextAreaValue}
                disabled={isSimulating}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>}

            {/* Spin button */}
            <button
              onClick={handleButton}
              disabled={ isSpinning || wheelList.length === 0}
              className={`mt-4 px-4 py-2 rounded text-white ${
                isSpinning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isSimulating 
                ? (isSpinning ? 'Simulating...' : 'End Simulation') 
                : 'Simulate'}

            </button>
          </div>

          {/* Right panel */}
          <div className="w-1/2 p-4">
            <canvas ref={canvasRef} className="w-full aspect-square border-2" />
          </div>
        </div>

        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
