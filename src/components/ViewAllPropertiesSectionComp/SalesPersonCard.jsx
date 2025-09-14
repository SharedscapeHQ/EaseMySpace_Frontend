import React, { useState, useEffect } from "react";
import SalesPerson from "/TeamImg/Dharmendra.png";
import ConnectPopup from "./ConnectPopup";

export default function SalesPersonCard({ className = "" }) {
  const name = "Dharmendra Mishra";
  const phone = "+91 8090200513";
  const role = "EMS consultant";
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
      className={`bg-white shadow-md rounded-lg p-6 flex flex-col gap-6 ${className}`}
    >
      {/* Full-width heading */}
      <h2
        style={{ fontFamily: "heading_font" }}
        className="text-lg font-bold text-gray-900"
      >
        Meet Our Expert
      </h2>

      {/* Content grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side */}
        <div className="flex flex-col items-start w-full lg:w-1/3">
          <div className="w-44 h-52 border border-blue-500 rounded-md overflow-hidden mb-3">
            <img
              src={SalesPerson}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="font-bold text-gray-900 text-base">{name}</h3>
          <p className="text-gray-500 text-sm">
            {showRealPhone ? phone : maskPhone(phone)}
          </p>
          <p className="text-gray-800 text-sm font-semibold">{role}</p>
        </div>

        {/* Right side */}
        <div className="flex-1 flex flex-col justify-between">
          <h4 className="font-bold text-gray-900 mb-2">
            Find Your Best Listings with Expert Guidance
          </h4>

          <ul className="list-disc list-outside pl-5 text-gray-700 text-sm space-y-1 mb-4">
  {bullets.map((b, idx) => (
    <li key={idx}>{b}</li>
  ))}
</ul>


          <button
            onClick={() => setIsOpen(true)}
            className="w-40 py-2 -mt-10 -mr-10 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
          >
            Connect with us
          </button>
        </div>
      </div>

      {isOpen && <ConnectPopup name={name} setIsOpen={setIsOpen} />}
    </div>
  );
}
