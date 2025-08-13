import React from "react";

function formatDateTime12h(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // convert 0 to 12 for 12 AM

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

export default function RecentlyViewed({ property }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200 flex flex-col relative">
      {/* Badge for timestamp */}
      {property.viewed_at && (
        <div className="absolute top-2 right-2 bg-zinc-700 text-white text-xs px-2 py-1 rounded-full select-none z-10">
          Viewed {formatDateTime12h(property.viewed_at)}
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
