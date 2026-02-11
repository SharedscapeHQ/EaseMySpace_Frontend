import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { newlyListedProperties } from "../../api/propertiesApi";
import PropertyMiniCard from "./PropertyMiniCard";

export default function NewlyListedProperties() {
  const [newlyListed, setNewlyListed] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchNewlyListed() {
      const CACHE_KEY = "newly_listed_properties";
      const CACHE_TIME_KEY = "newly_listed_properties_time";
      const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

      const cachedData = sessionStorage.getItem(CACHE_KEY);
      const cachedTime = sessionStorage.getItem(CACHE_TIME_KEY);

      if (
        cachedData &&
        cachedTime &&
        Date.now() - Number(cachedTime) < CACHE_DURATION
      ) {
        setNewlyListed(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data } = await newlyListedProperties();

        setNewlyListed(data);

        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        sessionStorage.setItem(CACHE_TIME_KEY, Date.now());
      } catch (err) {
        console.error("Failed to fetch newly listed properties", err);
        setNewlyListed([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNewlyListed();
  }, []);

  /* ---------- Loading Skeleton ---------- */

  if (loading) {
    return (
      <section className="py-10 lg:px-10 px-3 max-w-7xl mx-auto">
        <h2
          style={{ fontFamily: "para_font" }}
          className="flex items-center gap-2 text-[16px] lg:text-xl text-black dark:text-white"
        >
          Top Sharing Rooms
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

  if (!newlyListed.length) {
    return (
      <p className="text-center text-zinc-500 mt-10">
        No newly listed properties found.
      </p>
    );
  }

  /* ---------- UI ---------- */

  return (
    <div className="dark:bg-zinc-900 transition-colors">
      <section
        className="lg:py-10 pt-10 lg:px-10 px-3 max-w-7xl mx-auto"
        style={{ fontFamily: "universal_font" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2
            style={{ fontFamily: "para_font" }}
            className="flex items-center gap-2 text-[16px] lg:text-xl text-black dark:text-white"
          >
            Top Sharing Rooms
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

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide"
        >
          {newlyListed.map((property) => (
            <PropertyMiniCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </div>
  );
}
