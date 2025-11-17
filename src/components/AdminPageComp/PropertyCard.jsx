import React, { useState } from "react";
import { FiCheckCircle, FiX } from "react-icons/fi";

export default function PropertyCard({ property, onApprove, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  // Pick first image or fallback
  const imageUrl =
    Array.isArray(property.image) && property.image.length > 0
      ? property.image[0]
      : property.image || "/default-property.jpg";

  const hasPricing = property.pricing?.length > 0;
  const firstPrice = hasPricing ? Number(property.pricing[0].price).toLocaleString() : null;
  const multiplePricing = hasPricing && property.pricing.length > 1;

  const handleApproveClick = () => {
    setShowConfirm(true);
  };

  const confirmApprove = () => {
    onApprove(property.id);
    setShowConfirm(false);
  };

  return (
    <div
      style={{ fontFamily: "para_font" }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Property Image */}
      <div className="relative">
        <img src={imageUrl} alt={property.title} className="w-full h-48 object-cover" />
        {property.verified && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
            <FiCheckCircle className="text-sm" /> Verified
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
        <span
  className={`px-3 py-0.5 text-sm rounded-md text-white ${
    property.added_by_user_id === null
      ? "bg-blue-500" 
      : "bg-yellow-500" 
  }`}
>
  {property.added_by_user_id === null ? "Main Website" : "Subdomain"}
</span>
        </div>

        {/* Pricing */}
        {hasPricing ? (
          <p style={{ fontFamily: "heading_font" }} className="text-zinc-800 text-xs md:text-base">
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
              onClick={handleApproveClick}
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

      {/* Confirm Approval Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg relative">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Confirm Approval</h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to approve this property?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmApprove}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
