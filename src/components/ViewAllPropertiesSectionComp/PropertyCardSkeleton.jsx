import React from "react";

export default function PropertyCardSkeleton({ count = 8 }) {
  return (
    <div className="flex gap-10 overflow-x-auto scrollbar-hide">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-40 text-left animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="relative w-44 h-44 rounded-3xl bg-zinc-200 dark:bg-zinc-600">
            {/* Like button placeholder */}
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-300 dark:bg-zinc-500" />

            {/* Verified badge placeholder */}
            <div className="absolute top-2 left-2 w-14 h-4 rounded-full bg-zinc-300 dark:bg-zinc-500" />
          </div>

          {/* Location */}
          <div className="mt-2 h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-600" />

          {/* BHK | Looking For */}
          <div className="mt-1 h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-600" />

          {/* Rent | Deposit */}
          <div className="mt-1 h-3 w-36 rounded bg-zinc-200 dark:bg-zinc-600" />
        </div>
      ))}
    </div>
  );
}
