import React, { useEffect, useRef } from "react";
import { FiCheckCircle, FiEdit } from "react-icons/fi";
import { FaPhoneAlt, FaRupeeSign, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property, onRaiseQuery }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/properties/${property.id}`);
  };

return (
  <div
    style={{ fontFamily: "para_font" }}
    onClick={handleClick}
    className="min-w-[270px] max-w-[340px] group bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-600 flex-shrink-0 overflow-hidden relative transition-shadow duration-300 cursor-pointer shadow-md hover:shadow-lg"
  >
    {/* Image with Verified Badge */}
    {property.image?.length > 0 ? (
      <div className="relative h-48 w-full p-3 pt-3 pb-0 z-10">
        <div className="h-full w-full overflow-hidden rounded-xl">
          <img
            src={Array.isArray(property.image) ? property.image[0] : property.image}
            alt={property.title}
            className="h-full w-full object-cover group-hover:scale-105 group-hover:brightness-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {property.verified && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
            <FiCheckCircle className="text-[12px]" />
            Verified
          </span>
        )}
      </div>
    ) : (
      <div className="h-48 w-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-400 italic rounded-t-2xl z-10">
        No Media
      </div>
    )}

    {/* Card Body */}
    <div className="p-4 flex flex-col gap-2 z-10 relative">
      <h3 className="text-md font-semibold truncate max-w-full  transition-colors duration-300">
        {property.title}
      </h3>

      <p className="text-zinc-800 dark:text-gray-200 text-sm lg:text-base flex items-center gap-1 ">
        <FaRupeeSign className="text-xs lg:text-sm" /> {Number(property.price).toLocaleString()}/mo
      </p>

      <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm flex items-center gap-1 ">
        <FaMapMarkerAlt className="text-xs lg:text-sm" /> {property.location || "Unknown"}
      </p>

      <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm flex items-center gap-1 ">
        <FaBuilding className="text-xs lg:text-sm" /> {property.flat_status || "N/A"}
      </p>

      <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm flex items-center gap-1 ">
        Status: {property.status || "N/A"}
      </p>
    </div>

    {/* Footer Buttons */}
    <div
      className="px-4 py-3 flex gap-3 z-10 relative bg-transparent"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="flex-1 flex items-center justify-center gap-2 text-xs sm:text-sm px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
        onClick={onRaiseQuery}
      >
        <FiEdit /> Raise Query
      </button>

      <a
        href="tel:+919004463371"
        className="flex-1 flex items-center justify-center gap-2 text-xs sm:text-sm px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105"
      >
        <FaPhoneAlt /> Call
      </a>
    </div>
  </div>
);

};

export default PropertyCard;
