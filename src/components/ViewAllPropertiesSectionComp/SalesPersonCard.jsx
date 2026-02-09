import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import SalesPersonImg from "/testimonial/placeholder.jpg";
import ConnectPopup from "./ConnectPopup";

export default function SalesPersonCardMini({ className = "" }) {
  const name = "EMS Sales Team";
  const phone = "+91 9004463371";
  const role = "Consultant";
  const bullets = [
    "Best listings",
    "Verified flatmates",
    "Personal guidance",
    "Quality responses",
    "Showcase property",
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [showRealPhone, setShowRealPhone] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("showRealPhone") === "true") {
      setShowRealPhone(true);
    }
  }, []);

  const maskPhone = (num) => {
    const clean = num.replace("+91 ", "");
    return !clean || clean.length < 10
      ? num
      : `+91 ${clean.slice(0, 2)}xxxxxx${clean.slice(-2)}`;
  };

  return (
    <>
      <div
        className={`lg:w-56 w-80 bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition transform hover:-translate-y-1 ${className}`}
        style={{ fontFamily: "universal_font" }}
      >
        {/* Top Banner */}
        <div className="flex flex-col items-center justify-center px-2 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 h-28 rounded-t-2xl">
          <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-md">
            <img
              src={SalesPersonImg}
              alt={name}
              className=" object-contain"
            />
          </div>
          <h2 style={{ fontFamily: "para_font" }} className="mt-1 text-sm font-semibold text-white text-center truncate w-full">{name}</h2>
          <p className="text-[10px] text-white">{showRealPhone ? phone : maskPhone(phone)}</p>
          <p className="text-[10px] font-medium text-white">{role}</p>
        </div>

        {/* Bullets */}
        <div className="flex-1 px-2 py-1 overflow-y-auto">
          <ul className="space-y-1">
            {bullets.map((b, idx) => (
              <li key={idx} className="flex items-center gap-1 text-gray-700 text-[10px] leading-snug">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Connect Button */}
        <div className="px-2 pb-2">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-blue-600 text-white py-1.5 rounded-md text-lg hover:bg-blue-700 transition"
          >
            Connect
          </button>
        </div>
      </div>

      {/* Popup */}
      {isOpen && <ConnectPopup name={name} setIsOpen={setIsOpen} />}
    </>
  );
}
