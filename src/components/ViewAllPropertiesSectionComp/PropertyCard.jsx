import React from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { IoChatboxEllipsesOutline, IoCall } from "react-icons/io5";

const PropertyCard = ({ p }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/properties/${p.id}`, { state: { property: p } });
  };

  const thumbs = p.images.filter((img) => img !== p.cover).slice(0, 3);
  const extra = p.images.length - 1 - thumbs.length;

  return (
    <div
      onClick={handleClick}
      className="w-full max-w-sm bg-white dark:bg-zinc-700 rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition flex flex-col"
    >
      {/* Main Image */}
      <div className="relative w-full h-40">
        {p.cover ? (
          <img
            src={p.cover}
            alt={p.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center italic text-gray-400">
            No Image
          </div>
        )}
        {p.verified && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
            Verified
          </span>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 p-3">
        {thumbs.map((t, i) => (
          <div key={i} className="relative h-16 flex-1">
            <img src={t} alt="" className="h-full w-full object-cover rounded-lg" />
            {i === thumbs.length - 1 && extra > 0 && (
              <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm rounded-lg">
                +{extra}
              </span>
            )}
          </div>
        ))}
        {Array.from({ length: 3 - thumbs.length }).map((_, i) => (
          <div
            key={i}
            className="h-16 flex-1 bg-gray-100 border border-dashed border-gray-300 rounded-lg"
          />
        ))}
      </div>

      {/* Location + Looking For */}
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center text-gray-600 dark:text-gray-100 text-sm gap-1">
          <FiMapPin className="text-gray-500" />
          {p.location ? p.location.split(" ").slice(-2).join(" ") : "Unknown"}
        </div>
        {p.looking_for && (
          <span className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
            {p.looking_for === "flatmate"
              ? "Flatmate"
              : p.looking_for === "pg"
              ? "PG"
              : "Vacant Flat"}
          </span>
        )}
      </div>

      {/* Rent | Deposit | BHK */}
      <div className="flex items-stretch text-sm font-medium text-gray-700 dark:text-gray-100 py-2">
        <div className="flex-1 text-center py-3">
          <div className="text-gray-900 dark:text-white">₹{p.price?.toLocaleString() || "N/A"}</div>
          <div className="text-xs text-gray-500 dark:text-gray-100">Rent</div>
        </div>
        <div className="w-[2px] bg-gray-300 mx-2"></div>
        <div className="flex-1 text-center py-3">
          <div className="text-gray-900 dark:text-white">₹{p.deposit?.toLocaleString() || "-"}</div>
          <div className="text-xs text-gray-500 dark:text-gray-100">Deposit</div>
        </div>
        <div className="w-[2px] bg-gray-300 mx-2"></div>
        <div className="flex-1 text-center py-3">
          <div className="text-gray-900 dark:text-white">{p.bhk_type || "-"}</div>
          <div className="text-xs text-gray-500 dark:text-gray-100">BHK</div>
        </div>
      </div>

      {/* Profile + Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
            {p.title?.charAt(0) || "U"}
          </div>
          <span className="font-medium text-sm text-gray-700 dark:text-white">{p.title || "Owner"}</span>
          {(() => {
  if (!p.created_at) return null;
  const created = new Date(p.created_at);
  const now = new Date();
  const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

  if (diffDays > 10) return null; 

  let displayText = "";
  if (diffDays === 0) displayText = "Today";
  else if (diffDays === 1) displayText = "1d ago";
  else displayText = "a week ago"; 

  return (
    <span className="text-blue-500 border-2 rounded-full border-blue-300 text-[9px] px-1 py-[0.5px]">
      Listed {displayText}
    </span>
  );
})()}

        </div>
        <div className="flex items-center gap-4 text-blue-600 dark:text-blue-400 text-xl">
          <IoChatboxEllipsesOutline className="cursor-pointer" />
          <IoCall className="cursor-pointer" />
        </div>
      </div>

      {/* Book button */}
      <div className="px-3 mb-3">
        <button
          onClick={handleClick}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
        >
          Book Visit Now
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
