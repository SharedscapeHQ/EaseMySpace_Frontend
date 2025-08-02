import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

export default function NewlyListedCard({
  property,
  markNewlyListed,
  fetchProperties,
  allProperties, // ✅ new prop to get the full list
}) {
  const [showInput, setShowInput] = useState(false);
  const [position, setPosition] = useState("");

  const handleRemove = async () => {
    try {
      await markNewlyListed(property.id, false, null);
      toast.success("Removed from newly listed");
      fetchProperties();
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  const handleMark = async () => {
    const enteredPosition = Number(position);

    if (!enteredPosition || isNaN(enteredPosition) || enteredPosition <= 0) {
      return toast.error("Please enter a valid positive number");
    }

    // ✅ Check for conflicts with same position
    const usedPositions = allProperties
      .filter((p) => p.is_newly_listed && p.id !== property.id)
      .map((p) => Number(p.newly_listed_position));

    if (usedPositions.includes(enteredPosition)) {
      const proceed = window.confirm(
        `Position ${enteredPosition} is already assigned to another property.\nDo you still want to proceed?`
      );
      if (!proceed) return;
    }

    try {
      await markNewlyListed(property.id, true, enteredPosition);
      toast.success("Marked as newly listed");
      fetchProperties();
      setShowInput(false);
      setPosition("");
    } catch (err) {
      toast.error("Failed to mark");
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl border hover:shadow-lg transition duration-300 overflow-hidden group relative">
      {/* Media */}
      <div className="relative">
        <img
          src={
            Array.isArray(property.image) ? property.image[0] : property.image
          }
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        {property.is_newly_listed && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <FiCheckCircle className="text-sm" />
            Newly Listed
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-indigo-800 truncate">
            {property.title}
          </h3>
          {property.verified && (
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
  <FiCheckCircle className="text-sm" />
  Verified
</span>
          )}
        </div>

        <p className="text-gray-600 text-sm">{property.location}</p>
        <p className="text-indigo-700 font-bold text-base">
          ₹ {Number(property.price).toLocaleString()}
        </p>

        {property.is_newly_listed ? (
          <>
            <div className="text-sm text-green-700 mt-2 flex items-center gap-2">
              Position:{" "}
              <span className="bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded">
                {property.newly_listed_position ?? "-"}
              </span>
            </div>
            <button
              onClick={handleRemove}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <FiXCircle /> Remove from Newly Listed
            </button>
            <button
  onClick={() => window.open(`/properties/${property.id}`, "_blank")}
  className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
>
  View Details
</button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowInput(!showInput)}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
            >
              <FiEdit3 />
              {showInput ? "Cancel" : "Mark as Newly Listed"}
              {showInput ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            <button
  onClick={() => window.open(`/properties/${property.id}`, "_blank")}
  className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
>
  View Details
</button>

            {/* Smooth Expand Input */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                showInput ? "max-h-20 opacity-100 mt-3" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Enter position"
                  className="border w-full border-gray-300 rounded px-3 py-1 "
                />
                <button
                  onClick={handleMark}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}