import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FiCheckCircle, FiXCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function NewlyListedCard({ property, markNewlyListed, fetchProperties, allProperties }) {
  const [showInput, setShowInput] = useState(false);
  const [position, setPosition] = useState("");

  // Helper to get price safely
  const getFirstPrice = () => {
    if (property.pricing?.length > 0 && property.pricing[0].price != null) {
      return Number(property.pricing[0].price).toLocaleString();
    }
    return null;
  };

  const handleRemove = async () => {
    try {
      await markNewlyListed(property.id, false, null);
      toast.success("Removed from newly listed");
      fetchProperties();
    } catch (err) {
      toast.error("Failed to remove");
      console.error(err);
    }
  };

  const handleMark = async () => {
    const enteredPosition = Number(position);
    if (!enteredPosition || isNaN(enteredPosition) || enteredPosition <= 0) {
      return toast.error("Please enter a valid positive number");
    }

    const usedPositions = allProperties
      .filter((p) => p.is_newly_listed && p.id !== property.id)
      .map((p) => Number(p.newly_listed_position));

    if (usedPositions.includes(enteredPosition)) {
      const proceed = window.confirm(
        `Position ${enteredPosition} is already assigned.\nDo you still want to proceed?`
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

  const firstPrice = getFirstPrice();

  return (
    <div style={{ fontFamily: "para_font" }} className="bg-white rounded-xl border hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-44 md:h-48">
        <img
          src={Array.isArray(property.image) ? property.image[0] : property.image || "/default-property.jpg"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        {property.is_newly_listed && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <FiCheckCircle className="text-[10px]" /> Marked
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 style={{ fontFamily: "heading_font" }} className="text-zinc-800 text-xs md:text-base truncate">
            {property.title}
          </h3>
          {property.verified && (
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <FiCheckCircle className="text-[10px]" /> Verified
            </span>
          )}
        </div>

        {/* Price */}
        <p style={{ fontFamily: "heading_font" }} className="text-zinc-800 text-xs md:text-base">
          {firstPrice ? `₹ ${firstPrice}/mo` : "Price not available"}
        </p>
        <p className="text-gray-600 text-sm">{property.location}</p>

        {/* Newly Listed Actions */}
        {property.is_newly_listed ? (
          <>
            <div className="text-sm text-green-700 mt-1 flex items-center gap-2">
              Position: 
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                {property.newly_listed_position ?? "-"}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRemove}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
              >
                <FiXCircle /> Remove
              </button>

              <button
                onClick={() => window.open(`/properties/${property.id}`, "_blank")}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
              >
                View
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowInput(!showInput)}
                className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
              >
                {showInput ? "Cancel" : "Mark Featured"}
                {showInput ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              <button
                onClick={() => window.open(`/properties/${property.id}`, "_blank")}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
              >
                View
              </button>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${showInput ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
            >
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Enter position"
                  className="border w-full border-gray-300 rounded px-3 py-1 text-sm"
                />
                <button
                  onClick={handleMark}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
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
