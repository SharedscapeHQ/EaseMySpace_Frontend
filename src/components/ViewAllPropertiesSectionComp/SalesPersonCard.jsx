import React, { useState, useEffect } from "react";
import SalesPerson from "/TeamImg/Dharmendra.png";
// import { saveRequest } from "../../api/requestApi";
import ConnectPopup from "./ConnectPopup";

export default function SalesPersonCard() {
  const name = "Dharmendra Mishra";
  const phone = "+91 8090200513"; 
  const role = "EMS consultant";
  const bullets = [
    "Helps you discover the best listings",
    "Matches you with verified flatmates",
    "Provides personal guidance throughout",
    "Assists listers in getting quality responses",
    "Helps listers showcase their property better"
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [showRealPhone, setShowRealPhone] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("showRealPhone") === "true") setShowRealPhone(true);
  }, []);

  const maskPhone = (num) => {
    const clean = num.replace("+91 ", "");
    return (!clean || clean.length < 10) ? num : `+91 ${clean.slice(0,2)}xxxxxx${clean.slice(-2)}`;
  };

  return (
    <div style={{ fontFamily: "para_font" }} className="bg-white shadow-xl rounded-lg p-4 flex flex-col gap-4 relative lg:sticky lg:top-24 lg:z-30">
      <h2 style={{ fontFamily: "heading_font" }} className="text-xl text-zinc-900">Meet Our Expert</h2>

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 overflow-hidden flex-shrink-0">
          <img src={SalesPerson} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col">
          <h3 className="font-bold text-gray-900 text-base">{name}</h3>
          <p className="text-gray-500 text-xs mt-1">{showRealPhone ? phone : maskPhone(phone)}</p>
          <p className="text-blue-600 text-sm mt-1">{role}</p>
        </div>
      </div>

      <h4 className="text-gray-800 mt-2 lg:text-xs text-sm">Find Your Best Listings with Expert Guidance</h4>

      <ul className="list-disc list-inside text-gray-600 lg:text-xs text-sm space-y-1">
        {bullets.map((b, idx) => <li key={idx}>{b}</li>)}
      </ul>

      <button
        onClick={() => setIsOpen(true)}
        className="mt-3 w-full py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300"
      >
        Connect with us
      </button>

      {isOpen && <ConnectPopup name={name} setIsOpen={setIsOpen} />}
    </div>
  );
}
