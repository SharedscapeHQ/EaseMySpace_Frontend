import React, { useState } from "react";
import { FaLinkedin } from "react-icons/fa";

export default function TeamCard({ name, role, description, imageSrc, linkedin }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMobileFlip = () => {
    if (window.innerWidth < 768) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div
      className="md:w-[280px] w-[350px] h-[420px] perspective cursor-pointer group"
      onClick={handleMobileFlip}
    >
      <div
        className={`relative w-full h-full preserve-3d transition-transform duration-700 ${
          isFlipped ? "rotate-y-180" : ""
        } md:group-hover:rotate-y-180`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full bg-gradient-to-tr from-[#191b1f] to-[#1C1D20] text-white border border-blue-500/20 rounded-3xl  p-6 flex flex-col items-center justify-between backface-hidden">
          {/* Profile Image with Animations */}
          <div className="relative flex items-center justify-center w-48 h-48 mx-auto">
            {/* Outer Pulse Animations */}
            <div className="absolute w-full h-full rounded-full border-2 border-blue-500/20 animate-ping" />
            <div className="absolute w-full h-full rounded-full border border-blue-500/10 animate-pulse delay-500" />
            {/* Profile Image */}
            <div className="relative w-full h-full rounded-full overflow-hidden border border-blue-500/20 backdrop-blur-lg bg-gradient-to-br from-black/80 to-zinc-800/60 shadow-xl transform transition-transform duration-500 group-hover:scale-110">
              <img
                src={imageSrc}
                alt={`${name} photo`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name & Role */}
          <div className="text-center mt-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent animate-pulse">
              {name}
            </h3>
            <p className="text-zinc-400 text-sm font-semibold">{role}</p>
          </div>

          {/* LinkedIn */}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition mt-4"
            >
              <FaLinkedin />
              Connect
            </a>
          )}
          <p className="md:hidden text-xs text-zinc-400 mt-2 animate-pulse">
  Tap to flip
</p>

          {/* Bouncing Dots */}
          <div className="flex space-x-2 mt-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full bg-gradient-to-br from-[#111214] to-[#1F2125] text-zinc-300 border border-blue-500/30 rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center text-sm leading-relaxed text-center rotate-y-180 backface-hidden">
          <div className="mb-3">
            <h4 className="text-white font-semibold text-lg">About {name}</h4>
          </div>

          <p className="whitespace-pre-line">{description}</p>

          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition"
            >
              <FaLinkedin />
              Connect
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
