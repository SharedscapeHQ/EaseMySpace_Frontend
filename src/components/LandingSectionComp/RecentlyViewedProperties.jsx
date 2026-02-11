import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { getRecentlyViewedProperties } from "../../api/userApi";
import PropertyMiniCard from "./PropertyMiniCard";

export default function RecentlyViewedProperties() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchRecentlyViewed() {
      const CACHE_KEY = "recently_viewed_properties";
      const CACHE_TIME_KEY = "recently_viewed_properties_time";
      const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

      const cachedData = sessionStorage.getItem(CACHE_KEY);
      const cachedTime = sessionStorage.getItem(CACHE_TIME_KEY);

      if (cachedData && cachedTime && Date.now() - cachedTime < CACHE_DURATION) {
        setRecentlyViewed(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await getRecentlyViewedProperties();

        if (!res || res.length === 0) {
          setRecentlyViewed([]);
          return;
        }

        // API already sends only one image, no need to parse
        const filtered = res.filter((p) => p.status === "approved");

        setRecentlyViewed(filtered);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
        sessionStorage.setItem(CACHE_TIME_KEY, Date.now());
      } catch (err) {
        if (err.response?.status === 401) {
          setAuthorized(false);
          sessionStorage.removeItem(CACHE_KEY);
          sessionStorage.removeItem(CACHE_TIME_KEY);
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
        <h2 className="flex items-center gap-2 text-[16px] lg:text-xl text-black dark:text-white">
          Recently Viewed
          <Link
            to="/view-properties"
            className="ml-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <FiArrowRight className="text-black w-4 h-4" />
          </Link>
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

  if (!authorized || recentlyViewed.length === 0) return null;

  return (
    <div className="dark:bg-zinc-900 transition-colors">
      <section className="lg:py-10 pt-10 lg:px-10 px-3 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex items-center gap-2 text-[16px] lg:text-xl text-black dark:text-white">
            Recently Viewed
            <Link
              to="/view-properties"
              className="ml-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <FiArrowRight className="text-black w-4 h-4" />
            </Link>
          </h2>
          <Link
            to="/view-properties"
            className="text-blue-600 text-[13px] lg:text-base font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Property Cards */}
        <div ref={scrollRef} className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
          {recentlyViewed.map((property) => (
            <PropertyMiniCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </div>
  );
}
