import React from "react";

const PropertyCard = ({ property, onRaiseQuery, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
      {/* Make image + content clickable */}
      <div
        onClick={onViewDetails}
        className="cursor-pointer"
      >
        <img
          src={
            Array.isArray(property.image)
              ? property.image[0]
              : property.image || "https://via.placeholder.com/300x160?text=No+Image"
          }
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {property.title}
            </h3>
            {property.verified && (
              <span className="text-green-600 bg-green-100 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                Verified
              </span>
            )}
          </div>
          <p className="mt-2 text-gray-600 text-sm">
            <strong>Price:</strong> ₹{Number(property.price).toLocaleString()}
            <br />
            <strong>Location:</strong> {property.location}
            <br />
            <strong>Status:</strong> {property.flat_status}
          </p>
          {property.views && (
            <p className="mt-2 text-indigo-600 text-sm font-medium">
              👀 {property.views} views / ❤️ {property.interest_count || 0} interests
            </p>
          )}
        </div>
      </div>

      {/* Keep button outside so it doesn't trigger view modal */}
      <div className="px-5 pb-4">
        <button
          className="mt-2 text-sm text-blue-600 hover:underline"
          onClick={(e) => {
            e.stopPropagation(); // stop bubbling to card click
            onRaiseQuery();
          }}
        >
          Raise Edit Query
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
