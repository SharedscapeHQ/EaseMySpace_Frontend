import React from "react";

export default function PropertyCardSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border rounded-lg shadow-sm overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="w-full h-40 bg-gray-200"></div>

          {/* Content */}
          <div className="p-3 space-y-3">
            {/* Title + price */}
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>

            {/* Location */}
            <div className="h-3 w-2/3 bg-gray-200 rounded"></div>

            {/* Features (icons/text rows) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>

            {/* CTA button placeholder */}
            <div className="h-8 w-full bg-gray-200 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
