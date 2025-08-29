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
    style={{fontFamily:"para_font"}}
      onClick={handleClick}
      className="min-w-[270px] max-w-[340px] group bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden relative transition-all duration-300 cursor-pointer"
    >
      {/* Hover Blue Overlay */}
      <div className="hidden lg:block absolute inset-x-0 bottom-0 bg-blue-500 h-0 group-hover:h-full transition-all duration-300 ease-in-out z-0 rounded-2xl"></div>

      {/* Image with Verified badge */}
      {property.image?.length > 0 ? (
        <div className="relative h-48 w-full p-3 pt-3 pb-0 z-10">
          <div className="h-full w-full overflow-hidden rounded-xl">
            <img
              src={
                Array.isArray(property.image)
                  ? property.image[0]
                  : property.image
              }
              alt={property.title}
              className="h-full w-full object-cover group-hover:scale-105 group-hover:brightness-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          {property.verified && (
            <span className="absolute top-4 left-4 bg-green-500 text-white text-[10px] px-2 py-1 rounded-lg flex items-center gap-1 shadow-md z-10">
              <FiCheckCircle className="text-[12px]" />
              Verified
            </span>
          )}
        </div>
      ) : (
        <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400 italic rounded-t-2xl z-10">
          No Media
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-1 z-10 relative">
        <h3 className=" text-md truncate max-w-[160px] lg:group-hover:text-white transition-colors duration-300">
          {property.title}
        </h3>

        <p className="text-zinc-800  text-xs lg:text-base whitespace-nowrap lg:group-hover:text-white transition-colors duration-300 flex items-center gap-1">
          <FaRupeeSign /> {Number(property.price).toLocaleString()}/mo
        </p>

        <p className="text-gray-600 text-xs lg:group-hover:text-white transition-colors duration-300 flex items-center gap-1">
          <FaMapMarkerAlt /> {property.location}
        </p>

        {/* Property Type */}
        <p className="text-gray-600 text-xs lg:group-hover:text-white transition-colors duration-300 flex items-center gap-1">
          <FaBuilding /> {property.flat_status || "N/A"}
        </p>

        {/* Listing Status */}
        <p className="text-gray-600 text-xs lg:group-hover:text-white transition-colors duration-300 flex items-center gap-1">
          Status: {property.status || "N/A"}
        </p>
      </div>

      {/* Footer Buttons */}
      <div
        className="px-4 py-3 flex gap-2 z-10 relative bg-transparent"
        onClick={(e) => e.stopPropagation()} // prevent navigation when clicking buttons
      >
        <button
          className="flex-1 text-xs px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hover:scale-105 flex items-center justify-center gap-1"
          onClick={onRaiseQuery}
        >
          <FiEdit /> Raise Query
        </button>

        <a
          href="tel:+919004463371"
          className="flex-1 flex items-center justify-center gap-1 text-xs px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition hover:scale-105"
        >
          <FaPhoneAlt /> Call
        </a>
      </div>
    </div>
  );
};

export default PropertyCard;
