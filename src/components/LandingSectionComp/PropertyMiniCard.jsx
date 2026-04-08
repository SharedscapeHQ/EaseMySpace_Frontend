import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";

export default function PropertyMiniCard({ property }) {

  console.log("Property object:", property);

  
  const img = property.bedroom_image || null;
  const displayLocation = property.display_location || "Mumbai, Maharashtra";

const lookingForLabel =
  property.looking_for?.toLowerCase() === "pg"
    ? "PG"
    : property.looking_for?.toLowerCase() === "flatmate"
    ? "Shared room" 
    : property.looking_for
    ? property.looking_for.charAt(0).toUpperCase() + property.looking_for.slice(1)
    : "-";

    const genderLabel =
  property.gender?.toLowerCase() === "male"
    ? "Male"
    : property.gender?.toLowerCase() === "female"
    ? "Female"
    : property.gender
    ? property.gender.charAt(0).toUpperCase() + property.gender.slice(1)
    : "-";

    console.log("Gender label:", genderLabel);

  return (
    <div
      className="flex-shrink-0 text-left relative w-44"
      style={{ fontFamily: "universal_font" }}
    >
      <div className="relative w-44 h-44 rounded-3xl overflow-hidden">
        {/* Like Button */}
        <div className="absolute top-2 right-2">
          <LikeButton
            propertyId={property.id}
            initiallyLiked={property.liked}
          />
        </div>

        {/* Image */}
        <Link
          to={`/properties/${property.id}`}
          className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden z-0"
        >
          {img ? (
            <img
              src={img}
              alt={property.title || "Property image"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs">
              No Image
            </div>
          )}

          {/* Verified badge */}
          {property.verified && (
            <span
              className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-md"
              style={{ fontFamily: "universal_font" }}
            >
              Verified
            </span>
          )}
        </Link>
      </div>

      {/* Info */}
      <Link to={`/properties/${property.id}`}>
        {/* Location */}
        <div
          className="mt-2 text-[12px] text-zinc-900 dark:text-white line-clamp-2"
          style={{ fontFamily: "universal_font" }}
        >
          {displayLocation}
        </div>

        {/* BHK | Looking For */}
        <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
         {property.bhk_type || "-"} | {lookingForLabel} | {genderLabel}
        </div>

        {/* Rent | Deposit */}
        <div className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-300">
          Rent – ₹{property.price?.toLocaleString() || "-"} | Deposit ₹
          {property.deposit?.toLocaleString() || "-"}
        </div>
      </Link>
    </div>
  );
}