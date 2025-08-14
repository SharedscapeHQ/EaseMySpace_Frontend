import React from "react";
import dayjs from "dayjs";

export default function RecentlyViewed({ property }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200 flex flex-col relative">
      {/* Badge for timestamp */}
      {property.viewed_at && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full select-none z-10">
          Viewed {dayjs(property.viewed_at).format("DD/MM/YY hh:mm A")}
        </div>
      )}

      {/* Rest of your card */}
      <div className="w-full h-48 overflow-hidden rounded-t-2xl">
        <img
          src={
            Array.isArray(property.image)
              ? property.image[0]
              : property.image || "https://via.placeholder.com/300x160?text=No+Image"
          }
          alt={property.title}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {property.title}
          </h3>
          {property.verified && (
            <span className="text-green-700 bg-green-100 text-xs font-semibold px-2 py-1 rounded-full select-none">
              ✅ Verified
            </span>
          )}
        </div>

        <div className="text-sm text-gray-600 space-y-1 flex-grow">
          <p>
            <strong>Rent:</strong>{" "}
            <span className="text-gray-900 font-medium">
              ₹{Number(property.price).toLocaleString()}
            </span>
          </p>
          <p>
            <strong>Location:</strong> {property.location}
          </p>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
        <button
          className="text-sm px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/dashboard/my-properties/${property.id}`;
          }}
          aria-label={`View details of ${property.title}`}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
