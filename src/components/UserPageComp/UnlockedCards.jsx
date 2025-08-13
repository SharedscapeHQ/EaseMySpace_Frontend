import React, { useEffect, useState } from "react";
import { getUnlockedProperties } from "../../api/userApi";
import { FiClock } from "react-icons/fi";

export default function UnlockedCards() {
  const [unlocked, setUnlocked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUnlockedProperties()
      .then((data) => setUnlocked(data))
      .catch((err) =>
        console.error("❌ Failed to fetch unlocked contacts:", err)
      )
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (property) => {
    const baseUrl = "https://your-backend-url.com/"; // Replace with your actual backend URL

    let imagePath = "";
    if (Array.isArray(property.image) && property.image.length > 0) {
      imagePath = property.image[0];
    } else if (typeof property.image === "string") {
      imagePath = property.image;
    }

    if (!imagePath) {
      return "https://via.placeholder.com/300x160?text=No+Image";
    }

    return imagePath.startsWith("http")
      ? imagePath
      : baseUrl + imagePath.replace(/^\/+/, "");
  };

  if (loading) return <div className="text-center text-gray-700 font-medium py-6">
        <FiClock className="inline mr-2 animate-spin" /> Loading Unlocked Contacts
      </div>

  if (unlocked.length === 0)
    return (
      <p className="text-center text-gray-600 mt-10">
        You haven't unlocked any contacts yet.
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {unlocked.map((p) => (
        <div
          key={p._id}
          className="bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 overflow-hidden border border-gray-100 relative"
        >
          {/* Top-left badge */}
          {p.looking_for && (
            <span className="absolute top-3 left-3 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm z-10">
              {p.looking_for}
            </span>
          )}

          {/* Image */}
          <img
            src={getImageUrl(p)}
            alt={p.title || "Property Image"}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/300x160?text=No+Image";
            }}
          />

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-1 mb-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {p.title || "Untitled Property"}
                </h3>
                {p.verified && (
                  <span className="text-green-600 bg-green-100 text-xs font-semibold px-2 py-1 rounded-full">
                    ✅ Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-1">
                📍 {p.location || "Unknown location"}
              </p>
              <p className="text-sm text-gray-800">
                💰 Rent:{" "}
                <strong>₹{Number(p.price || 0).toLocaleString()}</strong>
              </p>
            </div>

            {/* View Details Button */}
            <div className="pt-2">
              <button
                onClick={() => window.open(`/properties/${p.id}`, "_blank")}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition"
              >
                View Property Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
