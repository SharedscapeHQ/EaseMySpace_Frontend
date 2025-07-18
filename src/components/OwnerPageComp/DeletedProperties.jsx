import React from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function DeletedPropertyCard({ property }) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <img
        src={Array.isArray(property.image) ? property.image[0] : property.image}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-indigo-700">{property.title}</h3>
          {property.verified && (
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <FiCheckCircle className="text-sm" />
              Verified
            </span>
          )}
        </div>
        <p className="text-gray-600">{property.location}</p>
        <span className="bg-yellow-400 text-zinc-900 font-semibold px-3 py-0.5 text-sm rounded-md">
          {property.owner_code}
        </span>
        <p className="text-indigo-900 font-semibold">₹{property.price}</p>

        <div className="mt-2">
          <button
            onClick={() => window.open(`/properties/${property.id}`, "_blank")}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
