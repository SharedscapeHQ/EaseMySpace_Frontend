import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";

export default function PropertyMiniCard({ property }) {
  const img =
    property.image?.[0] ||
    property.bedroom_images?.[0] ||
    property.hall_images?.[0] ||
    null;

  return (
    <div className="flex-shrink-0 text-left relative">
      <div className="relative w-44 h-44 rounded-3xl overflow-hidden">
        {/* Like Button positioned above the image */}
        <div className="absolute top-2 right-2 ">
          <LikeButton propertyId={property.id} initiallyLiked={property.liked} />
        </div>

        {/* Image + verified badge */}
        <Link
          to={`/properties/${property.id}`}
          className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden -z-10"
        >
          {img ? (
            <img
              src={img}
              alt={property.title || "Property image"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs">
              No Image
            </div>
          )}

          {/* Verified */}
          {property.verified && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-md">
              Verified
            </span>
          )}
        </Link>
      </div>

      {/* Info with link */}
    <Link to={`/properties/${property.id}`}>
  {/* Location */}
  <div className="mt-2 text-[12px] font-semibold text-zinc-900 dark:text-white">
    {property.location
      ? property.location.split(" ").slice(-2).join(" ")
      : "Unknown"}
  </div>

  {/* BHK | Looking For */}
  <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
    {property.bhk_type || "-"} | {property.looking_for || "-"}
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
