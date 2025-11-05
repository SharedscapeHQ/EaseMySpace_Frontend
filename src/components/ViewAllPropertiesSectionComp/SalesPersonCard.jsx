import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import SalesPerson from "/TeamImg/Dharmendra.png";
import PlaceholderImg from "/testimonial/placeholder.jpg";
import ConnectPopup from "./ConnectPopup";

export default function SalesPersonCard({ className = "" }) {
  const name = "Ninad Jadhav";
  // const phone = "+91 8090200513"; dharmendra conatcat 
  const phone = "+91 7738794701";
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
  className={`w-full max-w-sm bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition transform hover:-translate-y-1 ${className}`}
  style={{ fontFamily: "para_font" }}
>
  {/* Top Banner with Image + Info side by side */}
  <div className="relative w-full h-40 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center px-6">
    {/* Image */}
    <div className="w-24 h-24 rounded-full border-3 border-white shadow-md overflow-hidden flex-shrink-0">
      <img
        src={PlaceholderImg}
        alt={name}
        className="w-full h-full object-cover scale-110"
      />
    </div>

    {/* Info on the right */}
    <div className="ml-4 text-white text-left">
      <h2
        style={{ fontFamily: "heading_font" }}
        className="text-lg font-semibold"
      >
        {name}
      </h2>
      <p className="text-xs">{showRealPhone ? phone : maskPhone(phone)}</p>
      <p className="text-sm font-medium">{role}</p>
    </div>
  </div>

  {/* Info + Bullets */}
  <div className="p-5 flex flex-col flex-1 mt-6">

    {/* Bullets with flex-1 (pushes button down) */}
    <div className="flex-1 text-left">
      <ul className="space-y-2">
        {bullets.map((b, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 text-gray-700 text-xs leading-snug"
          >
            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  </div>

  {/* CTA Section pinned bottom */}
  <div className="px-5 pb-5">
    <button
      onClick={() => setIsOpen(true)}
      className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md text-sm font-medium"
    >
      Connect with Us
    </button>
  </div>
</div>



      {/* Popup */}
      {isOpen && <ConnectPopup name={name} setIsOpen={setIsOpen} />}
    </>
  );
}
