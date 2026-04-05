import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaBed, FaTv, FaCar, FaRegSnowflake } from "react-icons/fa";
import { IoSnowOutline, IoWaterOutline, IoWifiOutline, IoCheckmarkOutline } from "react-icons/io5";
import { MdShield } from "react-icons/md";
import LikeButton from "../LandingSectionComp/LikeButton";

const PropertyCard = ({ p }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const images = [
    ...(p.images || []),
    ...(p.bedroom_images || []),
    ...(p.hall_images || []),
    ...(p.kitchen_images || []),
    ...(p.bathroom_images || []),
    ...(p.additional_images || []),
  ].filter(Boolean);

  const amenityIconMap = {
    wifi: <IoWifiOutline />,
    refrigerator: <IoSnowOutline />,
    "washing machine": <IoWaterOutline />,
    parking: <FaCar />,
    security: <MdShield />,
    "air conditioning": <FaRegSnowflake />,
    tv: <FaTv />,
    bed: <FaBed />,
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (d < 1) return "Today";
    if (d < 7) return `${d}d ago`;
    return `${Math.floor(d / 7)}w ago`;
  };

  const displayLookingFor = (() => {
    const type = p.looking_for?.toLowerCase().trim();
    if (type === "pg") return "PG";
    if (type === "vacant") return "Vacant Flat";
    if (type === "flatmate") return "Shared Room";
    return p.looking_for || "";
  })();

  const occupancyText = p.occupancies?.length > 0 
    ? p.occupancies[0].occupancy 
    : "-";

  return (
    <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-zinc-100 hover:shadow-md transition-shadow duration-300 w-full max-w-sm">
      {/* IMAGE SECTION */}
      <div 
        className="relative h-[270px] group overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Rent Badge */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm py-1.5 px-3 rounded-lg shadow-lg z-20 flex items-baseline gap-0.5">
          <span className="font-bold text-zinc-900 text-lg">₹{p.price?.toLocaleString()}</span>
          <span className="text-zinc-500 text-xs font-medium">/m</span>
        </div>

        {/* Verified Badge */}
        {p.verified && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md py-1.5 px-3 rounded-full z-20 flex items-center gap-1.5 border border-white/20">
            <MdShield className="text-green-400 text-sm" />
            <span className="text-white text-[10px] font-semibold tracking-wide uppercase">Verified</span>
          </div>
        )}

        {/* Like Button */}
        <div className="absolute top-4 right-4 z-20">
          <LikeButton propertyId={p.id} initiallyLiked={p.liked} />
        </div>

        {/* Image Slider */}
        <Link to={`/properties/${p.id}`}>
          <div 
            className="flex h-full transition-transform duration-500 ease-out" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.length > 0 ? (
              images.map((img, idx) => (
                <img key={idx} src={img} className="w-full h-full object-cover flex-shrink-0" alt="property" />
              ))
            ) : (
              <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">No Image</div>
            )}
          </div>
        </Link>

        {/* Arrows (Desktop Only) */}
        {hovered && images.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button 
                onClick={() => setCurrentIndex(c => c - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-30"
              >
                <FaChevronLeft size={14} />
              </button>
            )}
            {currentIndex < images.length - 1 && (
              <button 
                onClick={() => setCurrentIndex(c => c + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-30"
              >
                <FaChevronRight size={14} />
              </button>
            )}
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.slice(0, 5).map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="p-5">
        <Link to={`/properties/${p.id}`}>
          <h2 className="text-xl font-bold text-zinc-900 leading-tight mb-4 capitalize">
            {displayLookingFor} in {p.display_location || "Location"}
          </h2>

          {/* INFO GRID */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Occupancy</p>
              <p className="text-sm font-semibold text-zinc-800 truncate">{occupancyText}</p>
            </div>
            <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Gender Preference</p>
              <p className="text-sm font-semibold text-zinc-800 capitalize">{p.gender || "Any"}</p>
            </div>
            <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Meals</p>
              <p className="text-sm font-semibold text-zinc-800">{p.meals_included ? "Included" : "Not Included"}</p>
            </div>
            <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Availability</p>
              <p className="text-sm font-semibold text-green-600">Available</p>
            </div>
          </div>

          {/* AMENITIES */}
          {p.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 border-b border-zinc-100 pb-4">
              {p.amenities.slice(0, 3).map((amenity, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-zinc-100 px-2.5 py-1 rounded-full text-zinc-600">
                  <span className="text-xs">{amenityIconMap[amenity.toLowerCase()] || <IoCheckmarkOutline />}</span>
                  <span className="text-[11px] font-medium capitalize">{amenity}</span>
                </div>
              ))}
              {p.amenities.length > 3 && (
                <div className="bg-zinc-100 px-2.5 py-1 rounded-full text-zinc-500 text-[11px] font-medium">
                  +{p.amenities.length - 3} more
                </div>
              )}
            </div>
          )}

          {/* FOOTER */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-900">{p.bhk_type}</span>
              <span className="text-[11px] text-zinc-500">Deposit ₹{p.deposit?.toLocaleString()}</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">
              Listed {timeAgo(p.created_at || new Date())}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;