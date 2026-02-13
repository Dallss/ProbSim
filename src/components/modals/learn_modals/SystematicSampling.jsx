import { useEffect, useRef } from "react";
import LearnModal from "../LearnModal";
import { SystematicSamplingScene } from "../manim/SystematicSamplingScene"; // your Manim scene
import { Renderer } from "manimjs"; // Manim.js Renderer

export default function SystematicSamplingModal({ isOpen, onClose, populationSize = 20, sampleSize = 5 }) {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);

    useEffect(() => {
        if (isOpen && containerRef.current) {
            // Initialize Manim renderer only when modal opens
            rendererRef.current = new Renderer({
                container: containerRef.current,
                width: 800,
                height: 400,
                backgroundColor: "#ffffff",
            });

            const scene = new SystematicSamplingScene({ populationSize, sampleSize });
            rendererRef.current.render(scene);
        }

        // Clean up when modal closes
        return () => {
            if (rendererRef.current) {
                rendererRef.current.destroy();
                rendererRef.current = null;
            }
        };
    }, [isOpen, populationSize, sampleSize]);

    return (
        <LearnModal isOpen={isOpen} onClose={onClose} title="Systematic Sampling Simulation">
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "400px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f5f5f5",
                }}
            />
        </LearnModal>
    );
}
