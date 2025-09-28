import React, { useEffect, useState } from "react";
import { getUnlockedProperties } from "../../api/userApi";
import { FiClock } from "react-icons/fi";
import { IoChatboxEllipsesOutline, IoCall } from "react-icons/io5";

export default function UnlockedCards() {
  const [unlocked, setUnlocked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUnlockedProperties()
      .then((data) => {
        setUnlocked(data);
      })
      .catch((err) =>
        console.error("❌ Failed to fetch unlocked contacts:", err)
      )
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (property) => {
    const baseUrl = "https://your-backend-url.com/";

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

  if (loading)
    return (
      <div className="text-center text-gray-700 font-medium py-6">
        <FiClock className="inline mr-2 animate-spin" /> Loading Unlocked
        Contacts
      </div>
    );

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
          onClick={() => window.open(`/properties/${p.id}`, "_blank")}
          className="min-w-[300px] max-w-[300px] group bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden shadow-md cursor-pointer hover:shadow-lg"
        >
          {/* Image Section */}
          <div className="relative w-full h-44">
            <img
              src={getImageUrl(p)}
              alt={p.title || "Property Image"}
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/300x160?text=No+Image";
              }}
            />

            {/* Top-left badge */}
            {p.looking_for && (
              <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full shadow-md">
                {p.looking_for}
              </span>
            )}
          </div>

          {/* Details Section */}
          <div className="p-4 flex flex-col gap-3">
            {/* Owner Info */}
            <p className="text-zinc-800 text-sm">Owner's Contact</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                  {p.title?.charAt(0) || "U"}
                </div>
                <span className="font-medium text-sm text-gray-700">
                  {p.title}
                </span>
              </div>

              <div className="flex gap-4 text-blue-500">
                <IoChatboxEllipsesOutline className="text-2xl cursor-pointer" />
                <IoCall className="text-2xl cursor-pointer" />
              </div>
            </div>

            {/* Book Now Button */}
            <button
              style={{ fontFamily: "heading_font" }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-md mt-2"
            >
              Book Now
            </button>

            {/* Rent Info */}
            <div className="text-center">
              <p className="font-bold text-black text-base">
                ₹ {Number(p.price || 0).toLocaleString()}/month
              </p>
              <p className="text-gray-600 text-sm">
                {p.bhk_type} in {p.location || "Unknown location"}
              </p>
            </div>

            {/* Payment Options */}
              <div className="flex items-center justify-center text-xs text-gray-500 mt-1 gap-2">
            <span>Pay with</span>
            <div className="flex items-center gap-2">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google Pay"
                className="h-4 object-contain"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png"
                alt="Paytm"
                className="h-4 object-contain"
              />
            </div>
          </div>
          </div>
        </div>
      ))}
    </div>
  );
}
