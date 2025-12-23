import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LikeButton from "../LandingSectionComp/LikeButton";

const PropertyCard = ({ p }) => {
  const images = [
    ...(p.images || []),
    ...(p.hall_images || []),
    ...(p.bedroom_images || []),
    ...(p.kitchen_images || []),
    ...(p.bathroom_images || []),
    ...(p.additional_images || []),
  ].filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));
  };

  // Dots logic
  const maxDots = 5;
  const totalDots = images.length;
  let startDot = 0;
  if (currentIndex > 2 && totalDots > maxDots) startDot = currentIndex - 2;
  if (startDot + maxDots > totalDots) startDot = totalDots - maxDots;
  if (startDot < 0) startDot = 0;
  const visibleDots = images.slice(startDot, startDot + maxDots);

  return (
    <div
      className="text-left relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Wrapper */}
      <div className="relative lg:w-56 lg:h-56 w-80 h-80 rounded-3xl overflow-hidden">
        {/* Like Button */}
        <div className="absolute top-2 right-2">
          <LikeButton propertyId={p.id} initiallyLiked={p.liked}  />
        </div>

        {/* Sliding Images */}
        {images.length > 0 ? (
          <div className="w-full h-full overflow-hidden relative">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={p.title || "Property image"}
                  className="w-full h-full object-cover flex-shrink-0"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs">
            No Image
          </div>
        )}

        {/* Arrows */}
        {hovered && images.length > 1 && currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md z-10"
          >
            <FaChevronLeft size={16} />
          </button>
        )}
        {hovered && images.length > 1 && currentIndex < images.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md z-10"
          >
            <FaChevronRight size={16} />
          </button>
        )}

        {/* Clickable overlay Link */}
        <Link to={`/properties/${p.id}`} className="absolute inset-0 w-full h-full" />

        {/* Verified Badge */}
        {p.verified && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-md z-0">
            Verified
          </span>
        )}

        {/* Dots */}
       {images.length > 1 && (
  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
    {visibleDots.map((_, idx) => {
      const realIndex = startDot + idx;
      const isActive = realIndex === currentIndex;
      return (
       <span
  key={idx}
  className={`w-1 h-1 rounded-full transition-transform duration-300 ${
    isActive ? "bg-white" : "bg-gray-200"
  }`}
  style={{ transform: isActive ? "scale(1.5)" : "scale(1)" }}
/>

      );
    })}
  </div>
)}

      </div>

      {/* Info */}
      <Link to={`/properties/${p.id}`}>
        <div className="mt-2 text-[12px] font-semibold text-zinc-900 dark:text-white">
          {p.location ? p.location.split(" ").slice(-2).join(" ") : "Unknown"}
        </div>
        <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          {p.bhk_type || "-"} | {p.looking_for || "-"}
        </div>
        <div className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-300">
          Rent – ₹{p.price?.toLocaleString() || "-"} | Deposit ₹{p.deposit?.toLocaleString() || "-"}
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
