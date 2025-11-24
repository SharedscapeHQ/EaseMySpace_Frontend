import React from "react";
import dayjs from "dayjs";
import { IoChatboxEllipsesOutline, IoCall } from "react-icons/io5";

export default function RecentlyViewed({ property }) {
  return (
    <div
      key={property.id}
      onClick={() => window.open(`/properties/${property.id}`, "_blank")}
      className="min-w-[300px] max-w-[300px] group bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden shadow-md cursor-pointer hover:shadow-lg"
    >
      {/* Image Section */}
      <div className="relative w-full h-44">
        {property.image ? (
          <img
            src={
              Array.isArray(property.image)
                ? property.image[0]
                : property.image
            }
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 italic">
            No Image
          </div>
        )}

        {/* Viewed timestamp */}
        {property.viewed_at && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full select-none z-10">
            Viewed {dayjs(property.viewed_at).format("DD/MM/YY hh:mm A")}
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-4 flex flex-col gap-3">
        {/* Owner Info */}
        <p className="text-zinc-800 text-sm">Owner's Contact</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
              {property.title?.charAt(0) || "U"}
            </div>
            <span className="font-medium text-sm text-gray-700">
              {property.title}
            </span>
          </div>

          <div className="flex gap-4 text-blue-500">
            <IoChatboxEllipsesOutline className="text-2xl cursor-pointer" />
            <IoCall className="text-2xl cursor-pointer" />
          </div>
        </div>

        
        {/* Rent Info */}
        <div className="text-center">
          <p className="font-bold text-black text-base">
            ₹ {Number(property.price || 0).toLocaleString()}/month
          </p>
          <p className="text-gray-600 text-sm">
            {property.bhk_type} in {property.location || "Unknown location"}
          </p>
        </div>

       
      </div>
    </div>
  );
}
