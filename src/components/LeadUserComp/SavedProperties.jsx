import React, { useEffect, useState } from "react";
import PropertyCard from "../UserPageComp/PropertyCard";
import { FiHeart, FiClock } from "react-icons/fi";
import { fetchLeadSavedProperties } from "../../api/leadApi";

export default function GuestSavedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      // Get verified phone from localStorage
      const phone = localStorage.getItem("user_verified_mobile");
      if (!phone) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchLeadSavedProperties(phone);
        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Failed to fetch guest saved properties:", err);
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
