import React from "react";

const PropertyCard = ({ property, onRaiseQuery, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden border border-gray-100">
      {/* Clickable section */}
      <div onClick={onViewDetails} className="cursor-pointer">
        <img
          src={
            Array.isArray(property.image)
              ? property.image[0]
              : property.image || "https://via.placeholder.com/300x160?text=No+Image"
          }
          alt={property.title}
          className="w-full h-48 object-cover"
        />

        <div className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {property.title}
            </h3> <button
  onClick={() => window.open(`/properties/${property.id}`, "_blank")}
  className="  flex items-center text-white px-3 py-1 rounded justify-center gap-2 bg-indigo-600 hover:bg-indigo-700  transition"
>
  View Details
</button>
            {property.verified && (
              <span className="text-green-600 bg-green-100 text-xs font-semibold px-2 py-1 rounded-full">
                ✅ Verified
              </span>
            )}
          </div>

          <div className="text-sm text-gray-600 space-y-0.5">
            <p>
              <strong>Rent:</strong> ₹{Number(property.price).toLocaleString()}
            </p>
            <p>
              <strong>Location:</strong> {property.location}
            </p>
            <p>
              <strong>Status:</strong> {property.flat_status}
            </p>
            <p>
              <strong>Listing Status:</strong> {property.status}
            </p>
          </div>

          {property.views && (
            <div className="text-indigo-600 text-sm font-medium pt-1">
              👀 {property.views} views &nbsp;|&nbsp; ❤️ {property.interest_count || 0} interests
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={(e) => {
              e.stopPropagation();
              onRaiseQuery();
            }}
          >
            ✏️ Raise Edit Query
          </button>

          <a
            href="tel:+919004463371"
            onClick={(e) => e.stopPropagation()}
            className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            📞 Call Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
