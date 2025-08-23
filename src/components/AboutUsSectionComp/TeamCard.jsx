import React, { useState } from "react";
import { FaEnvelope, FaLinkedin } from "react-icons/fa";

export default function TeamCard({
  name,
  role,
  imageSrc,
  description,
  linkedin,
  email,
}) {
  const [isMobileVisible, setIsMobileVisible] = useState(false);

  const handleMobileToggle = () => {
    if (window.innerWidth < 1024) {
      setIsMobileVisible((prev) => !prev);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsMobileVisible(false);
  };

  return (
    <div
      onClick={handleMobileToggle}
      className="relative lg:w-[280px] w-[325px] h-[400px] bg-gradient-to-br from-white to-blue-300 overflow-hidden rounded-2xl shadow-xl group cursor-pointer"
    >
      {/* Profile Image */}
      <img
        src={imageSrc}
        alt={name}
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />

      {/* Bottom Overlay for Name and Role */}
      <div className="absolute bottom-0 w-full bg-black/60 text-white px-4 py-3 z-10">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-300">{role}</p>
      </div>

      {/* Slide-Up Info */}
      <div
        className={`
          absolute inset-0 bg-blue-400/90 text-black px-4 py-6 flex flex-col justify-center items-center lg:items-start
          transform transition-transform duration-500 z-20
          ${isMobileVisible ? "translate-y-0" : "translate-y-full"}
          lg:group-hover:translate-y-0
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-black text-lg font-bold rounded-full md:hidden"
        >
          ✕
        </button>

        <div className="text-center lg:text-left">
          <h4 className="text-lg font-bold mb-2">{name}</h4>
          <p className="text-sm text-zinc-800 whitespace-pre-line">{description}</p>
        </div>

        {/* Social Icons */}
        <div className="mt-4 flex gap-4 justify-center lg:justify-start w-full">
  {/* Email */}
  {email && (
    <a
      href={`mailto:${email}`}
      style={{ clipPath: "url(#squircleClip)" }}
      className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 border-green-300/50 rounded-xl flex items-center justify-center shadow-lg border cursor-pointer transition hover:scale-110 hover:-translate-y-2"
    >
      <FaEnvelope className="text-white text-xl" />
    </a>
  )}

  {/* LinkedIn */}
  {linkedin && (
    <a
      href={linkedin}
      target="_blank"
      rel="noopener noreferrer"
      style={{ clipPath: "url(#squircleClip)" }}
      className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-500/50 rounded-xl flex items-center justify-center shadow-lg border cursor-pointer transition hover:scale-110 hover:-translate-y-2"
    >
      <FaLinkedin className="text-white text-xl" />
    </a>
  )}
</div>

      </div>
    </div>
  );
}
