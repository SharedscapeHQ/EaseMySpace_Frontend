import React from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function DeletedPropertyCard({ property, onRestore }) {
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

        <div className="flex flex-wrap gap-2">
          <span className="bg-yellow-400 text-zinc-900 font-semibold px-3 py-0.5 text-sm rounded-md">
            Owner: {property.owner_code}
          </span>
          <span className="bg-red-100 text-red-600 font-semibold px-3 py-0.5 text-sm rounded-md">
            Deleted by: {property.deleted_by_owner_code || "N/A"}
          </span>
        </div>

        <p className="text-indigo-900 font-semibold">₹{property.price}</p>

        <div className="mt-2 flex gap-2">
          <button
            onClick={() => window.open(`/owner-dashboard/deleted-property-details/${property.id}`, "_blank")}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition"
          >
            View Details
          </button>

          <button
            onClick={() => onRestore(property.id)}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  );
}
