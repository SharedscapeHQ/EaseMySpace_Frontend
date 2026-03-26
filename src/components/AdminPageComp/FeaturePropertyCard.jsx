import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

export default function FeaturePropertyCard({
  property,
  markFn,
  fetchProperties,
  allProperties,
  type = "newly_listed",
}) {
  const [showInput, setShowInput] = useState(false);
  const [position, setPosition] = useState("");

  // 🔥 Dynamic config
  const CONFIG = {
    newly_listed: {
      flag: "is_newly_listed",
      position: "newly_listed_position",
      label: "Featured",
    },
    top_pg: {
      flag: "is_top_pg",
      position: "top_pg_position",
      label: "Top PG",
    },
  };

  const { flag, position: positionKey, label } = CONFIG[type];

  // Helper to get price safely
  const getFirstPrice = () => {
    if (property.pricing?.length > 0 && property.pricing[0].price != null) {
      return Number(property.pricing[0].price).toLocaleString();
    }
    return null;
  };

  const handleRemove = async () => {
    try {
      await markFn(property.id, false, null);
      toast.success(`${label} removed`);
      fetchProperties();
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  const handleMark = async () => {
    const enteredPosition = Number(position);

    if (!enteredPosition || enteredPosition <= 0) {
      return toast.error("Enter valid position");
    }

    const usedPositions = allProperties
      .filter((p) => p[flag] && p.id !== property.id)
      .map((p) => Number(p[positionKey]));

    if (usedPositions.includes(enteredPosition)) {
      const proceed = window.confirm(
        `Position ${enteredPosition} already used. Continue?`
      );
      if (!proceed) return;
    }

    try {
      await markFn(property.id, true, enteredPosition);
      toast.success(`${label} updated`);
      fetchProperties();
      setShowInput(false);
      setPosition("");
    } catch {
      toast.error("Failed to update");
    }
  };

  const firstPrice = getFirstPrice();

  return (
    <div className="bg-white rounded-xl border hover:shadow-lg transition overflow-hidden group">
      {/* Image */}
      <div className="relative h-44 md:h-48">
        <img
          src={
            Array.isArray(property.bedroom_images) &&
            property.bedroom_images.length > 0
              ? `${property.bedroom_images[0]}?tr=w-400,h-300,c_fill,q_auto,f_auto`
              : "/default-property.jpg"
          }
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />

        {property[flag] && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <FiCheckCircle className="text-[10px]" /> {label}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-zinc-800 text-xs md:text-base truncate">
            {property.title}
          </h3>

          {property.verified && (
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
              <FiCheckCircle className="text-[10px]" /> Verified
            </span>
          )}
        </div>

        <p className="text-zinc-800 text-xs md:text-base">
          {firstPrice ? `₹ ${firstPrice}/mo` : "Price not available"}
        </p>

        <p className="text-gray-600 text-sm">{property.location}</p>

        {/* Actions */}
        {property[flag] ? (
          <>
            <div className="text-sm text-green-700 mt-1 flex items-center gap-2">
              Position:
              <span className="bg-green-100 px-2 py-0.5 rounded">
                {property[positionKey] ?? "-"}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRemove}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <FiXCircle /> Remove
              </button>

              <button
                onClick={() =>
                  window.open(`/properties/${property.id}`, "_blank")
                }
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
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
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                {showInput ? "Cancel" : `Mark ${label}`}
                {showInput ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              <button
                onClick={() =>
                  window.open(`/properties/${property.id}`, "_blank")
                }
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                View
              </button>
            </div>

            {showInput && (
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  min="1"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Enter position"
                  className="border w-full rounded px-3 py-1 text-sm"
                />
                <button
                  onClick={handleMark}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Submit
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}