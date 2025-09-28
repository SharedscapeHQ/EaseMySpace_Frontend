import React from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function PropertyCard({ property, onApprove, onEdit, onDelete }) {
  // Pick first image or fallback
  const imageUrl =
    Array.isArray(property.image) && property.image.length > 0
      ? property.image[0]
      : property.image || "/default-property.jpg";

  // Pricing logic
  const hasPricing = property.pricing?.length > 0;
  const firstPrice = hasPricing ? Number(property.pricing[0].price).toLocaleString() : null;
  const multiplePricing = hasPricing && property.pricing.length > 1;

  return (
    <div
      style={{ fontFamily: "para_font" }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Property Image */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        {property.verified && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
            <FiCheckCircle className="text-sm" />
            Verified
          </span>
        )}
      </div>

      {/* Property Details */}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3
            style={{ fontFamily: "heading_font" }}
            className="text-zinc-800 text-xs md:text-base truncate"
          >
            {property.title}
          </h3>
          <span className="bg-yellow-400 text-zinc-900 px-3 py-0.5 text-sm rounded-md">
            {property.owner_code}
          </span>
        </div>

        {/* Pricing */}
        {hasPricing ? (
          <p
            style={{ fontFamily: "heading_font" }}
            className="text-zinc-800 text-xs md:text-base"
          >
            ₹ {firstPrice}/mo {multiplePricing && <span className="text-gray-500 text-xs">(multiple options)</span>}
          </p>
        ) : (
          <p className="text-gray-500 text-xs md:text-base">No Rent available</p>
        )}

        <p className="text-gray-600 text-sm">{property.location}</p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          {onApprove && property.status === "pending" && (
            <button
              onClick={() => onApprove(property.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Approve
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(property)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(property.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Delete
            </button>
          )}

          <button
            onClick={() => window.open(`/properties/${property.id}`, "_blank")}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
