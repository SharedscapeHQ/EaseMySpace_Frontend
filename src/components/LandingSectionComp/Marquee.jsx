import React from "react";

const locations = ["Andheri", "Goregaon", "Powai", "Dadar", "Bandra", "Juhu", "Chembur", "Vikhroli"];

export default function FuturisticMarquee() {
  return (
    <div className="relative w-full overflow-hidden py-6 bg-white">
      {/* Top Layer */}
      <div className="absolute top-0 left-0 w-full flex gap-8 animate-marquee-fast">
        {locations.concat(locations).map((loc, i) => (
          <div
            key={i}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-gray-800 font-semibold text-lg shadow-md transform transition-transform hover:scale-105"
          >
            {loc}
          </div>
        ))}
      </div>

      {/* Bottom Layer (slower, slightly offset) */}
      <div className="absolute top-12 left-0 w-full flex gap-8 animate-marquee-slow">
        {locations.concat(locations).map((loc, i) => (
          <div
            key={i}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 text-gray-800 font-semibold text-lg shadow-md transform transition-transform hover:scale-105"
          >
            {loc}
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes marqueeFast {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marqueeSlow {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-fast {
            animation: marqueeFast 18s linear infinite;
          }
          .animate-marquee-slow {
            animation: marqueeSlow 25s linear infinite;
          }
        `}
      </style>
    </div>
  );
}
