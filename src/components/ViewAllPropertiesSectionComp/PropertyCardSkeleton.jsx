import React from "react";

export default function PropertyCardSkeleton({ count = 8 }) {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10 overflow-x-auto lg:overflow-x-visible scrollbar-hide px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-80 lg:w-56 text-left animate-pulse"
        >
          <div className="relative w-80 h-80 lg:w-56 lg:h-56 rounded-3xl bg-zinc-200 dark:bg-zinc-600 mx-auto lg:mx-0">
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-300 dark:bg-zinc-500" />

            <div className="absolute top-2 left-2 w-14 h-4 rounded-full bg-zinc-300 dark:bg-zinc-500" />
          </div>

          <div className="mt-2 h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-600 mx-auto lg:mx-0" />

          <div className="mt-1 h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-600 mx-auto lg:mx-0" />

          <div className="mt-1 h-3 w-40 rounded bg-zinc-200 dark:bg-zinc-600 mx-auto lg:mx-0" />
        </div>
      ))}
    </div>
  );
}
