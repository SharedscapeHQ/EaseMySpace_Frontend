import React, { useEffect, useState } from "react";
import { getSavedProperties } from "../../api/userApi";
import { IoChatboxEllipsesOutline, IoCall } from "react-icons/io5";

export default function SavedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const data = await getSavedProperties();
        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Failed to fetch saved properties:", err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSaved();
  }, []);

  if (loading) {
    return (
      <div className="text-gray-700 dark:text-gray-300 font-medium py-6 flex items-center gap-2">
        Loading saved properties...
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-zinc-700 text-center">
        <p className="text-gray-700 dark:text-gray-300 font-medium">No saved properties yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-6">
        {properties.map((property) => {
          // Determine which image to show
          const img =
            property.image?.[0] ||
            property.bedroom_images?.[0] ||
            property.hall_images?.[0] ||
            null;

          return (
            <div
              key={property.id}
              onClick={() => window.open(`/properties/${property.id}`, "_blank")}
              className="min-w-[300px] max-w-[300px] group bg-white dark:bg-zinc-700 rounded-2xl border border-zinc-200 dark:border-zinc-600 flex-shrink-0 overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative w-full h-44">
                {img ? (
                  <img
                    src={img}
                    alt={property.title || "Property image"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 italic">
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-4 flex flex-col gap-3">
                {/* Owner Info */}
                <p className="text-zinc-800 dark:text-zinc-200 text-sm">Owner's Contact</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-lg">
                      {property.title?.charAt(0) || "U"}
                    </div>
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                      {property.title}
                    </span>
                  </div>

                  <div className="flex gap-4 text-blue-500">
                    <IoChatboxEllipsesOutline className="text-2xl cursor-pointer" />
                    <IoCall className="text-2xl cursor-pointer" />
                  </div>
                </div>

                {/* Rent Info */}
                <div className="text-center">
                  <p className="font-bold text-black dark:text-white text-base">
                    ₹ {Number(property.price || 0).toLocaleString()}/month
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {property.bhk_type || "-"} in {property.location || "Unknown location"}
                  </p>
                </div>

                {/* Group Info */}
                {property.group_name && (
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Saved in: <span className="font-medium">{property.group_name}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
