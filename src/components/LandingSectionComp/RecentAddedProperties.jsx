import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import axios from "axios";

const parseImages = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string" && raw.startsWith("{"))
    return raw
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^"|"$/g, ""))
      .filter(Boolean);
  return [];
};

export default function RecentAddedProperties() {
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchRecent() {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "https://api.easemyspace.in/api/properties/all"
        );
        const sorted = data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 7)
          .map((p) => ({ ...p, images: parseImages(p.image) }));

        setRecentProperties(sorted);
      } catch (err) {
        console.error("Error fetching recent properties", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className="my-16 md:px-10 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6">
          New Arrivals: Discover the Latest Properties
        </h2>
        <div className="grid gap-12 mt-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-4 animate-pulse flex flex-col"
            >
              <div className="h-48 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-5 bg-gray-300 rounded w-1/3 mt-auto" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (recentProperties.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10">
        No recently added properties found.
      </p>
    );

  return (
  <div className="bg-zinc-100 pb-20 ">
  <section className="md:px-10 px-6 bg-white rounded-2xl p-5 max-w-7xl mx-auto relative">
    {/* Heading + Arrows */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold text-blue-600">
        New Arrivals: Discover the Latest Properties
      </h2>
      <div className="flex gap-2">
        <button
          onClick={() => scroll("left")}
          className="bg-white/80 backdrop-blur-md shadow-lg p-3 rounded-full hover:bg-gray-100 border"
        >
          <FaChevronLeft className="text-xl text-blue-600" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="bg-white/80 backdrop-blur-md shadow-lg p-3 rounded-full hover:bg-gray-100 border"
        >
          <FaChevronRight className="text-xl text-blue-600" />
        </button>
      </div>
    </div>

    {/* Scrollable Cards */}
    <div className="relative">
      
      <div
        ref={scrollRef}
        className="flex gap-10 overflow-x-auto scroll-smooth pb-4 px-10 scrollbar-hide"
      >
        {recentProperties.map((p) => (
          <Link
            to={`/properties/${p.id}`}
            key={p.id}
            className="min-w-[260px] max-w-[260px] bg-zinc-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex-shrink-0"
          >
            {p.images && p.images.length > 0 ? (
              <div className="h-48 w-full rounded-t-2xl overflow-hidden">
                {p.images.map((url, idx) => {
                  const isImage = /\.(jpe?g|png|webp)$/i.test(url);
                  const isVideo = /\.(mp4|mov|webm)$/i.test(url);
                  return isImage ? (
                    <img
                      key={idx}
                      src={url}
                      alt={`Image ${idx + 1}`}
                      className="h-48 w-full object-cover"
                    />
                  ) : isVideo ? (
                    <video
                      key={idx}
                      src={url}
                      controls
                      className="h-48 w-full object-cover"
                    />
                  ) : null;
                })}
              </div>
            ) : (
              <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400 italic rounded-t-2xl">
                No Media
              </div>
            )}

            <div className="p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-indigo-800 truncate">
                  {p.title}
                </h3>
                {p.verified && (
                  <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <FiCheckCircle className="text-sm" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-1">{p.location}</p>
              <p className="text-indigo-600 font-bold mt-auto">
                ₹ {Number(p.price).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
</div>


  );
}
