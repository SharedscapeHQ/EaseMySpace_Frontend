import React from "react";

export default function PropertyCardSkeleton() {
  return (
    <div className="relative z-0 w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 w-full overflow-x-hidden flex flex-col md:flex-row p-4 gap-4 animate-pulse">
        
        {/* Main Image Skeleton */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="w-full h-48 bg-gray-200 rounded-lg"></div>

          {/* Thumbnails Skeleton */}
          <div className="flex gap-2 mt-2">
            <div className="h-20 w-1/3 bg-gray-200 rounded-lg"></div>
            <div className="h-20 w-1/3 bg-gray-200 rounded-lg"></div>
            <div className="h-20 w-1/3 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Property Info Skeleton */}
        <div className="flex flex-col justify-start flex-1 gap-3">
          <div className="flex items-start justify-between flex-wrap gap-y-1">
            <div>
              <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
          </div>

          <div className="h-5 w-20 bg-gray-200 rounded"></div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-3 text-center text-xs gap-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>

          {/* Features Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
