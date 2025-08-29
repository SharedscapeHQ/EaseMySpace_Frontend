import React, { useEffect, useState } from "react";
import { getUnlockedProperties } from "../../api/userApi";
import { FiClock, FiCheckCircle } from "react-icons/fi";


export default function UnlockedCards() {
  const [unlocked, setUnlocked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUnlockedProperties()
      .then((data) => {console.log(data);setUnlocked(data)})
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
      onClick={() => window.open(`/properties/${p.id}`, "_blank")} // ✅ open in new tab
      className="group min-w-[270px] lg:max-w-[300px] bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden relative transition-all duration-300 cursor-pointer"
    >
      {/* Hover Blue Overlay */}
      <div className="hidden lg:block absolute inset-x-0 bottom-0 bg-blue-500 h-0 group-hover:h-full transition-all duration-300 ease-in-out z-0 rounded-2xl"></div>

      

      {/* Image */}
      <div className="relative h-48 w-full p-3 pt-3 pb-0 z-10">
        <div className="h-full w-full overflow-hidden rounded-xl">
          <img
            src={getImageUrl(p)}
            alt={p.title || "Property Image"}
            className="h-full w-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/300x160?text=No+Image";
            }}
          />
        </div>

        {/* Top-left badge */}
      {p.looking_for && (
        <span className="absolute top-3 left-3 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm z-10">
          {p.looking_for}
        </span>
      )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1 z-10 relative">
        <h3 className="font-semibold text-md truncate max-w-[160px] lg:group-hover:text-white transition-colors duration-300">
          {p.title || "Untitled Property"}
        </h3>

        <p className="text-gray-600 text-xs lg:group-hover:text-white transition-colors duration-300 flex items-center gap-1">
          📍 {p.location || "Unknown location"}
        </p>

        <p className="text-zinc-800 font-bold text-xs lg:text-base whitespace-nowrap lg:group-hover:text-white transition-colors duration-300 flex items-center gap-1">
          💰 ₹{Number(p.price || 0).toLocaleString()}
        </p>
      </div>
    </div>
  ))}
</div>



  );
}
