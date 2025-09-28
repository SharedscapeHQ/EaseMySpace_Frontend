import React, { useEffect, useState } from "react";
import { getSavedProperties } from "../../api/userApi";
import PropertyCard from "./PropertyCard";
import { FiHeart, FiClock } from "react-icons/fi";

export default function SavedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const data = await getSavedProperties(); // data is already an array
        console.log("✅ Saved properties from API:", data);
        setProperties(Array.isArray(data) ? data : []); // ensure it's always an array
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
      <div className="text-gray-700 font-medium py-6 flex items-center gap-2">
        <FiClock className="animate-spin text-xl" /> Loading saved properties...
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 text-center">
        <FiHeart className="text-red-500 text-3xl mx-auto mb-4" />
        <p className="text-gray-700 font-medium">No saved properties yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-wrap gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={{
              ...property,
              // Safe check: only use images array if valid
              image: Array.isArray(property.image) && property.image.length > 0
                ? property.image
                : property.cover
                ? [property.cover]
                : [],
            }}
            onRaiseQuery={() => alert(`Raise query for ${property.title || "Untitled"}`)}
          />
        ))}
      </div>
    </div>
  );
}
