import React from "react";
import { IoShieldCheckmark } from "react-icons/io5";
import { MdVerified } from "react-icons/md";

function EaseMySpaceProtection() {
  const points = [
    "Always pay rent and deposit via the platform, avoid outside deals.",
    "Refund protection on eligible disputes",
    "Instant receipt on every payment",
    "Digital eSigned rental agreement",
    "Owner KYC verified via DigiLocker",
  ];

  return (
    <div className="relative bg-white rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col gap-3">

      {/* Tag */}
      <div className="absolute -bottom-4 right-2 bg-red-50 text-red-600 text-[10px] px-2 py-1 rounded-md border border-red-200">
        Visits are always free. Never pay before visiting.
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 font-semibold text-gray-900">
        <IoShieldCheckmark className="text-blue-600" size={20} /> {/* bigger for visual weight */}
        EaseMySpace Protection
      </div>

      {/* Points */}
    <div className="flex flex-col gap-2 text-xs text-gray-600">
  {points.map((point, i) => (
  <div key={i} className="flex items-start gap-2"> 
    {/* Added flex-shrink-0 to prevent the icon from resizing */}
    <MdVerified className="text-green-600 flex-shrink-0" size={16} />
    <span>{point}</span>
  </div>
))}
</div>

    </div>
  );
}

export default EaseMySpaceProtection;