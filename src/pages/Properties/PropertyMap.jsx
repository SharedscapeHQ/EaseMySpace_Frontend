import React, { useState } from "react";
import Reviews from "./Reviews";

export default function PropertyMap({ property }) {
  const displayLocation = property?.display_location || "Mumbai, Maharashtra";
  const [hasReviews, setHasReviews] = useState(false);

  return (
    <section className="w-full flex flex-col lg:flex-row gap-5">
      {/* Map */}
      <div
        className={`border rounded-xl lg:p-6 p-2 shadow-md bg-white border-gray-200 flex flex-col flex-1 ${
          hasReviews ? "lg:w-2/3" : "w-full"
        }`}
        style={{ minHeight: "450px" }}
      >
        <h2
          style={{ fontFamily: "para_font" }}
          className="flex items-center text-[16px] lg:text-xl mb-3"
        >
          <span style={{ fontFamily: "para_font" }}>Location</span>
          <span
            style={{ fontFamily: "universal_font" }}
            className="text-xs lg:text-sm text-gray-600 ml-2 truncate"
          >
            {displayLocation}
          </span>
        </h2>

        <div className="w-full rounded-lg overflow-hidden flex-1">
          <iframe
            className="w-full h-full"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              displayLocation
            )}&output=embed`}
          ></iframe>
        </div>
      </div>

      {/* Reviews */}
      <div
        className={`lg:w-1/3 w-full flex-shrink-0 flex flex-col ${
          hasReviews ? "block" : "hidden"
        }`}
        style={{ height: "450px" }}
      >
        <div className="overflow-y-auto flex-1">
          <Reviews property={property} setHasReviews={setHasReviews} />
        </div>
      </div>
    </section>
  );
}