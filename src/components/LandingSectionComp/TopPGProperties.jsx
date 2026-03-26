import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { topPGProperties } from "../../api/propertiesApi";
import PropertyMiniCard from "./PropertyMiniCard";

export default function TopPGProperties() {
  const [topPG, setTopPG] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

useEffect(() => {
  async function fetchTopPG() {
    try {
      setLoading(true);

      const { data } = await topPGProperties();

      setTopPG(data);
    } catch (err) {
      console.error("Failed to fetch top PG properties", err);
      setTopPG([]);
    } finally {
      setLoading(false);
    }
  }

  fetchTopPG();
}, []);

  /* ---------- Loading Skeleton ---------- */

  if (loading) {
    return (
      <section className="py-10 lg:px-10 px-3 max-w-7xl mx-auto">
        <h2 className="flex items-center gap-2 text-[16px] lg:text-xl">
          Top PGs
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

  if (!topPG.length) {
    return 
  }

  /* ---------- UI ---------- */

  return (
    <div className="dark:bg-zinc-900 transition-colors">
      <section className="lg:py-10 pt-10 lg:px-10 px-3 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex items-center gap-2 text-[16px] lg:text-xl">
            Top PGs
            <Link
              to="/view-properties"
              className="ml-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <FiArrowRight className="w-4 h-4" />
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
          {topPG.map((property) => (
            <PropertyMiniCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </div>
  );
}