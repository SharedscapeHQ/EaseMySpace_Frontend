import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react"; // ✅ for modern check icons
import SalesPerson from "/TeamImg/Dharmendra.png";
import ConnectPopup from "./ConnectPopup";

export default function SalesPersonCard({ className = "" }) {
  const name = "Dharmendra Mishra";
  const phone = "+91 8090200513";
  const role = "EMS Consultant";
  const bullets = [
    "Helps you discover the best listings",
    "Matches you with verified flatmates",
    "Provides personal guidance throughout",
    "Assists listers in getting quality responses",
    "Helps listers showcase their property better",
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [showRealPhone, setShowRealPhone] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("showRealPhone") === "true") setShowRealPhone(true);
  }, []);

  const maskPhone = (num) => {
    const clean = num.replace("+91 ", "");
    return !clean || clean.length < 10
      ? num
      : `+91 ${clean.slice(0, 2)}xxxxxx${clean.slice(-2)}`;
  };

  return (
    <div
      style={{ fontFamily: "para_font" }}
      className={`bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-8 ${className}`}
    >
      {/* Heading */}
      <h2
        style={{ fontFamily: "heading_font" }}
        className="text-2xl font-extrabold text-gray-900 text-center lg:text-left"
      >
        Meet Our Expert
      </h2>

      {/* Grid */}
      <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
        {/* Left side */}
        <div className="flex flex-col items-center lg:items-start w-full lg:w-1/3">
          <div className="lg:w-48 w-60 h-60 border-2 border-zinc-300 rounded-xl overflow-hidden shadow-md mb-4">
            <img
              src={SalesPerson}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="font-bold text-gray-900 text-lg text-center lg:text-left">
            {name}
          </h3>
          <p className="text-gray-500 text-base text-center lg:text-left">
            {showRealPhone ? phone : maskPhone(phone)}
          </p>
          <p className="text-blue-600 text-base font-semibold text-center lg:text-left">
            {role}
          </p>
        </div>

        {/* Right side */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-xl text-gray-900 mb-5">
              Find Your Best Listings with Expert Guidance
            </h4>

            <ul className="space-y-3">
              {bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700 text-base">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button aligned bottom */}
          <div className="mt-8">
            <button
              onClick={() => setIsOpen(true)}
              className="w-full sm:w-56 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl lg:ml-7 shadow-md transition"
            >
              Connect with us
            </button>
          </div>
        </div>
      </div>

      {isOpen && <ConnectPopup name={name} setIsOpen={setIsOpen} />}
    </div>
  );
}
