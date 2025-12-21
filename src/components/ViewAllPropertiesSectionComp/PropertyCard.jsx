import React from "react";
import { Link } from "react-router-dom";
import LikeButton from "../LandingSectionComp/LikeButton";

const PropertyCard = ({ p }) => {
  const img =
    p.image?.[0] ||
    p.bedroom_images?.[0] ||
    p.hall_images?.[0] ||
    p.images?.[0] ||
    null;

  return (
    <div className="text-left  relative">
      {/* Image Wrapper */}
    <div className="relative lg:w-56 lg:h-56 w-80 h-80 rounded-3xl overflow-hidden">
  {/* Like Button */}
  <div className="absolute top-2 right-2 ">
    <LikeButton propertyId={p.id} initiallyLiked={p.liked} />
  </div>

  {/* Image */}
  {img ? (
    <img
      src={img}
      alt={p.title || "Property image"}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs">
      No Image
    </div>
  )}

  {/* Clickable overlay Link */}
  <Link
    to={`/properties/${p.id}`}
    className="absolute inset-0 w-full h-full -z-10"
  >
    {/* Empty: just overlay for click */}
  </Link>

  {/* Verified Badge */}
  {p.verified && (
    <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-md ">
      Verified
    </span>
  )}
</div>


      {/* Info */}
      <Link to={`/properties/${p.id}`}>
        {/* Location */}
        <div className="mt-2 text-[12px] font-semibold text-zinc-900 dark:text-white">
          {p.location
            ? p.location.split(" ").slice(-2).join(" ")
            : "Unknown"}
        </div>

        {/* BHK | Looking For */}
        <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          {p.bhk_type || "-"} | {p.looking_for || "-"}
        </div>

        {/* Rent | Deposit */}
        <div className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-300">
          Rent – ₹{p.price?.toLocaleString() || "-"} | Deposit ₹
          {p.deposit?.toLocaleString() || "-"}
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
