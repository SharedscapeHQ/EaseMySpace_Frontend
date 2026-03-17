import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const parseImages = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string" && raw.startsWith("{"))
    return raw
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^"|"$/g, ""))
      .filter(Boolean);
  return [];
};

function RelatedPropertyCard({ property }) {
 const formattedLocation = property.display_location || "Mumbai, Maharashtra";

  const getFirstImage = () => {
    return property.images?.[0] || property.bedroom_images?.[0] || property.hall_images?.[0] || null;
  };

  return (
    <Link
      key={property.id}
      to={`/properties/${property.id}`}
      className="flex flex-col sm:flex-row justify-center items-center bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-transform transform hover:scale-[1.02] w-full"
    >
      {/* Image */}
      <div className="w-full sm:w-56 h-48 sm:h-56 flex-shrink-0 relative p-2">
        <div className="w-full h-full overflow-hidden rounded-xl relative">
          {getFirstImage() ? (
            <img
              src={getFirstImage()}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {property.verified && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
              <FiCheckCircle className="text-[12px]" /> Verified
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between w-full">
        <div>
          <h3 className="text-gray-900  text-base sm:text-lg lg:text-xl mb-1 truncate">
            {property.title}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">
            {property.bhk_type} | {property.gender} | {property.looking_for}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mb-2 truncate">{formattedLocation}</p>
          {property.description && (
            <p className="text-gray-700 text-xs sm:text-sm lg:text-base mb-2 line-clamp-3">
              {property.description}
            </p>
          )}
        </div>
        <p className="text-indigo-600 text-base sm:text-lg lg:text-xl mt-auto">
  {property.price ? `₹${property.price.toLocaleString()}/mo` : "N/A"}
</p>
      </div>
    </Link>
  );
}

function RelatedProperties({ currentProperty }) {
  const [allProperties, setAllProperties] = useState([]);
  const [relatedProperties, setRelatedProperties] = useState([]);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await axios.get("https://api.easemyspace.in/api/properties/all", {
          withCredentials: true,
        });
        const data = res.data.map((p) => ({ ...p, images: parseImages(p.image) }));
        setAllProperties(data);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      }
    }
    fetchProperties();
  }, []);

  useEffect(() => {
    if (!currentProperty || allProperties.length === 0) return;

    const related = allProperties.filter(
      (p) =>
        p.id !== currentProperty.id &&
        p.gender === currentProperty.gender &&
        p.bhk_type === currentProperty.bhk_type &&
        p.looking_for === currentProperty.looking_for
    );

    setRelatedProperties(related.slice(0, 6));
  }, [currentProperty, allProperties]);

  if (relatedProperties.length === 0) return null;

  return (
    <div className="mt-8 p-5 rounded-2xl gap-5 max-w-6xl mx-auto">
      <h2
        style={{ fontFamily: "para_font" }}
        className="text-[16px] lg:text-2xl  text-gray-900 mb-6"
      >
        You Might Also Like
      </h2>

      <div className="flex flex-col gap-6">
        {relatedProperties.map((p) => (
          <RelatedPropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}

export default RelatedProperties;
