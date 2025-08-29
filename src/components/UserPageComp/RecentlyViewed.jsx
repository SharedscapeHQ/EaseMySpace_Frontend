import React from "react";
import dayjs from "dayjs";
import { FiCheckCircle } from "react-icons/fi";


export default function RecentlyViewed({ property }) {
  return (
<div
  key={property.id}
  onClick={() => window.open(`/properties/${property.id}`, "_blank")}
  className="group min-w-[270px] lg:max-w-[300px] bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden relative transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
>
  {/* Hover Blue Overlay */}
  <div className="hidden lg:block absolute inset-x-0 bottom-0 bg-blue-500 h-0 group-hover:h-full transition-all duration-300 ease-in-out z-0 rounded-2xl"></div>

  {/* Image */}
  <div className="relative h-48 w-full p-3 pt-3 pb-0 z-10">
    <div className="h-full w-full overflow-hidden rounded-xl">
      <img
        src={
          Array.isArray(property.image)
            ? property.image[0]
            : property.image || "https://via.placeholder.com/300x160?text=No+Image"
        }
        alt={property.title}
        className="h-full w-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-transform duration-300"
        loading="lazy"
      />
    </div>

    {/* Viewed timestamp - top-right corner */}
    {property.viewed_at && (
      <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full select-none z-10">
        Viewed {dayjs(property.viewed_at).format("DD/MM/YY hh:mm A")}
      </div>
    )}
  </div>

  {/* Content */}
  <div className="p-4 flex flex-col gap-1 z-10 relative">
    <h3 className="font-semibold text-md truncate max-w-[160px] lg:group-hover:text-white transition-colors duration-300">
      {property.title}
    </h3>

    <p className="text-gray-600 text-xs lg:group-hover:text-white transition-colors duration-300 flex items-center gap-1">
      📍 {property.location || "Unknown location"}
    </p>

    <p className="text-zinc-800 font-bold text-xs lg:text-base whitespace-nowrap lg:group-hover:text-white transition-colors duration-300 flex items-center gap-1">
      💰 ₹{Number(property.price || 0).toLocaleString()}
    </p>
  </div>
</div>



  );
}
