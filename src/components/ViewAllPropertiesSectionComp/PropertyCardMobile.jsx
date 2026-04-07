import { useState, useEffect } from "react";
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
  ? p.occupancies.length === 1
    ? p.occupancies[0].occupancy
    : "Multiple"
  : "-";

 const lockinText = (() => {
  if (!p.occupancies?.length) return "Optional";

  const periods = [
    ...new Set(
      p.occupancies.flatMap(o =>
        (o.locking_options || []).map(opt => opt.period)
      )
    )
  ];

  if (periods.length === 0) return "Optional";

  return periods
  .sort((a, b) => a - b)
  .map(p => `${p} month${p > 1 ? "s" : ""}`)
  .join(", ");
})();


return (
  <div className="bg-white rounded-[18px] overflow-hidden shadow-sm border border-zinc-100 
                  hover:shadow-md transition-shadow duration-300 
                  w-full max-w-[22rem] mx-2">

    {/* IMAGE SECTION */}
    <div 
      className="relative h-[200px] group overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rent Badge */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm py-1 px-2 rounded-md shadow z-20 flex items-baseline gap-0.5">
        <span className="font-bold text-zinc-900 text-sm">
          ₹{p.price?.toLocaleString()}
        </span>
        <span className="text-zinc-500 text-[10px]">/m</span>
      </div>

      {/* Verified */}
      {p.verified && (
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md py-1 px-2 rounded-full z-20 flex items-center gap-1 border border-white/20">
          <MdShield className="text-green-400 text-xs" />
          <span className="text-white text-[9px] font-semibold uppercase">
            Verified
          </span>
        </div>
      )}

      {/* Like */}
      <div className="absolute top-3 right-3 z-1 ">
        <LikeButton propertyId={p.id} initiallyLiked={p.liked} />
      </div>

      {/* Slider */}
      <Link to={`/properties/${p.id}`}>
        <div 
          className="flex h-full transition-transform duration-500 ease-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.length > 0 ? (
            images.map((img, idx) => (
              <img key={idx} src={img} className="w-full h-full object-cover flex-shrink-0" />
            ))
          ) : (
            <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 text-xs">
              No Image
            </div>
          )}
        </div>
      </Link>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button 
              onClick={() => setCurrentIndex(c => c - 1)}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow z-30"
            >
              <FaChevronLeft size={12} />
            </button>
          )}
          {currentIndex < images.length - 1 && (
            <button 
              onClick={() => setCurrentIndex(c => c + 1)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow z-30"
            >
              <FaChevronRight size={12} />
            </button>
          )}
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
        {images.slice(0, 5).map((_, i) => (
          <div 
            key={i}
            className={`h-1 rounded-full ${
              i === currentIndex ? "w-3 bg-white" : "w-1 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>

    {/* DETAILS */}
    <div className="p-3">
      <Link to={`/properties/${p.id}`}>
        
       {/* TITLE + ZERO BROKERAGE */}
<div className="flex items-start justify-between gap-2 mb-5">
  <h2 className="text-sm font-bold text-zinc-900 leading-tight capitalize flex-1">
    {displayLookingFor} in {p.display_location || "Location"}
  </h2>

  <div className="bg-green-50 border border-green-500 text-green-600 
                  text-[7px] font-semibold px-2 py-[2px] rounded-md whitespace-nowrap">
    Zero Brokerage
  </div>
</div>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <div className="bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
            <p className="text-[8px] text-zinc-400 font-semibold uppercase">Occupancy</p>
            <p className="text-[11px] font-semibold text-zinc-800 truncate">{occupancyText}</p>
          </div>

          <div className="bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
            <p className="text-[8px] text-zinc-400 font-semibold uppercase">Gender</p>
            <p className="text-[11px] font-semibold text-zinc-800 capitalize">{p.gender || "Any"}</p>
          </div>

          <div className="bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
            <p className="text-[8px] text-zinc-400 font-semibold uppercase">Meals</p>
            <p className="text-[11px] font-semibold text-zinc-800">
              {p.meals_included ? "Included" : "Not Included"}
            </p>
          </div>

         <div className="bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
  <p className="text-[8px] text-zinc-400 font-semibold uppercase">Lock-in</p>
  <p className="text-[11px] font-semibold text-zinc-800">
    {lockinText}
  </p>
</div>
        </div>

        {/* AMENITIES */}
        {p.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 border-b border-zinc-100 pb-2">
            {p.amenities.slice(0, 3).map((amenity, i) => (
              <div key={i} className="flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-600">
                <span className="text-[10px]">
                  {amenityIconMap[amenity.toLowerCase()] || <IoCheckmarkOutline />}
                </span>
                <span className="text-[10px] font-medium capitalize">{amenity}</span>
              </div>
            ))}
            {p.amenities.length > 3 && (
              <div className="bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-500 text-[10px] font-medium">
                +{p.amenities.length - 3}
              </div>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-zinc-900">{p.bhk_type}</span>
            <p className="text-[10px] text-zinc-500">
              ₹{p.deposit?.toLocaleString()}
            </p>
          </div>

          <span className="text-[10px] text-zinc-400">
            {timeAgo(p.created_at || new Date())}
          </span>
        </div>

      </Link>
    </div>
  </div>
);
};

export default PropertyCard;