import React from "react";
import { FaTag } from "react-icons/fa";

function BottomTitle({ property }) {
  if (!property) return null;

  const lookingFor =
    property.looking_for?.toLowerCase() === "pg"
      ? "PG"
      : property.looking_for;

  return (
    <div className="w-full flex items-start justify-between gap-4">

      {/* LEFT CONTENT */}
      <div className="flex flex-col gap-1">

        {/* TITLE */}
        <h2
          style={{ fontFamily: "para_font" }}
          className="text-sm lg:text-lg text-gray-900 font-medium"
        >
          Available{" "}
          <span className="font-semibold">
            {lookingFor}
          </span>{" "}
          in{" "}
          <span className="font-semibold capitalize">
            {property.display_location}
          </span>
        </h2>

        {/* INFO LINE */}
        <div className="text-xs lg:text-sm text-gray-600 flex items-center flex-wrap gap-1">

          <span className="font-medium text-gray-800">
            {property.bhk_type}
          </span>

          <span className="text-gray-400">•</span>

          <span>
            {property.bathrooms} Bathroom
          </span>

          <span className="text-gray-400">•</span>

          <span className="text-blue-600 font-medium">
            For {property.gender} (Gender)
          </span>

        </div>

      </div>

      {/* RIGHT SIDE URGENCY */}
      <div className="flex items-center">
        <div
          className="
            flex items-center gap-2
            bg-white
            border border-gray-200
            px-4 py-2
            rounded-lg
            text-[10px] lg:text-sm
            font-medium
            text-gray-700
            shadow-md
          "
        >
          <FaTag className="text-green-500 lg:text-[15px]" />
          <span>Zero Brokerage</span>
        </div>
      </div>

    </div>
  );
}

export default BottomTitle;