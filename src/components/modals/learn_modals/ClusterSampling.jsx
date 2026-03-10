import { useRef, useState, useEffect } from "react";
import LearnModal from "../LearnModal";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function SystematicSamplingModal({ isOpen, onClose }) {
  
  const handleClose = () => {
    onClose?.();
  };
  

  return (
    <LearnModal isOpen={isOpen} onClose={handleClose} title="Systematic Sampling Simulation">
      <div className="flex h-full">

        {/* Left panel */}
        <div className="w-1/2 p-4 h-full flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
            <p className="font-semibold text-2xl mb-4">Cluster Sampling</p>

            <div className="mb-4 p-3 bg-gray-100 border-l-4 border-pink-500 rounded-md text-gray-700">
            <p className="mb-2 text-sm">
               Cluster sampling is a statistical method where the population is divided into naturally occurring groups, or clusters—such as locations, schools, or villages—and then entire clusters are randomly selected for study. This method is particularly useful for large or widely spread populations, because it allows researchers to collect representative data efficiently without having to survey every individual.
            </p>
            </div>

   
               <p className=" text-xl mb-2">Sample Problem</p>
               <p className="mb-2 text-sm mb-4 text-gray-700">
                  The Philippines has thousands of coral reefs spread across its islands. A marine biologist wants to study the overall coral population but cannot examine every coral. She uses cluster sampling, randomly selecting a few reefs and surveying all corals within them to get a representative sample.
               </p>
               <p className=" mb-2 text-sm">Why Cluster Sampling is Needed?</p>
               <p className="mb-2 text-sm">
                  Corals are widely scattered, making full surveys costly and time-consuming. Cluster sampling lets researchers efficiently study a subset of reefs while capturing differences between sites, making it a practical and convenient approach.   
               </p>



        </div>

       

         {/* Right panel */}
         <div className="w-1/2 p-4 h-full">
         <MapContainer
            center={[12.8797, 121.7740]} // Center of the Philippines
            zoom={5}
            style={{ height: "100%", width: "100%" }}
         >
            <TileLayer
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               attribution="&copy; OpenStreetMap contributors"
            />

            {/* Example markers */}
            <Marker position={[11.9674, 121.9245]}>
               <Popup>Boracay</Popup>
            </Marker>
            <Marker position={[11.2027, 119.3910]}>
               <Popup>El Nido</Popup>
            </Marker>
            <Marker position={[9.8487, 126.0481]}>
               <Popup>Siargao</Popup>
            </Marker>
         </MapContainer>
         </div>
      </div>
    </LearnModal>
  );
}
