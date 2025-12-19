import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentlyViewedProperties } from "../../api/userApi";
import PropertyMiniCard from "./PropertyMiniCard";

// Helper to parse images stored as strings/arrays
const parseImages = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;

  if (typeof raw === "string" && raw.startsWith("{"))
    return raw
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, ""))
      .filter(Boolean);

  return [];
};

export default function RecentlyViewedProperties() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true); 
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchRecentlyViewed() {
      setLoading(true);
      try {
        const res = await getRecentlyViewedProperties(); 

        if (!res || res.length === 0) {
          setRecentlyViewed([]);
          return;
        }

        const filtered = res
          .filter((p) => p.status === "approved")
          .map((p) => ({
            ...p,
            image: parseImages(p.image),
            bedroom_images: parseImages(p.bedroom_images),
            kitchen_images: parseImages(p.kitchen_images),
            bathroom_images: parseImages(p.bathroom_images),
            hall_images: parseImages(p.hall_images),
            additional_images: parseImages(p.additional_images),
          }));

        setRecentlyViewed(filtered);
      } catch (err) {
        if (err.response?.status === 401) {
          // Not logged in
          setAuthorized(false);
        } else {
          console.error("Error fetching recently viewed:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRecentlyViewed();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-10 lg:px-10 px-3 max-w-7xl mx-auto">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-lg lg:text-3xl mb-6 text-black"
        >
          Recently Viewed
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-44 h-56 rounded-3xl bg-zinc-200 animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </section>
    );
  }

  // Not authorized or no properties
  if (!authorized || recentlyViewed.length === 0) return null;

  return (
    <div className="dark:bg-zinc-900 transition-colors">
      <section
        className="lg:py-10 pt-10 lg:px-10 px-3 max-w-7xl mx-auto"
        style={{ fontFamily: "para_font" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2
            style={{ fontFamily: "heading_font" }}
            className="text-[16px] lg:text-3xl text-black dark:text-white"
          >
            Recently Viewed
          </h2>
          <Link
            to="/view-properties"
            className="text-blue-600 text-[13px] lg:text-base font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Property Cards */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide"
        >
          {recentlyViewed.map((property) => (
            <PropertyMiniCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </div>
  );
}
