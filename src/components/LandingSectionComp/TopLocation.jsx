import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLocations } from "../../api/adminApi";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import locationVid from "/location-vid.mp4";

function TopLocation() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await getAllLocations();
        setLocations(res.data.locations || []);
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLocations();
  }, []);

  const handleLocationClick = (location) => {
    navigate(`/view-properties?location=${encodeURIComponent(location)}`);
  };

  if (!loading && locations.length === 0) return null;

  return (
    <section
      className="w-full py-5 bg-blue-100 relative lg:rounded-none rounded-3xl"
      aria-label="Top locations to find PGs, flats, and flatmates"
    >
      <div className="max-w-7xl mx-auto lg:px-10 px-3 relative z-10">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-lg lg:text-3xl text-black leading-tight lg:text-left"
        >
          Explore Top Locations
        </h2>

        {/* ----- MOBILE VIEW ----- */}
        <div className="relative lg:hidden mt-6 flex justify-center">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide"
          >
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-40 h-52 bg-gray-700 rounded-2xl flex-shrink-0"
                  />
                ))
              : locations.map((loc, i) => (
                  <motion.div
                    key={i}
                    onClick={() => handleLocationClick(loc.name)}
                    className="relative w-40 h-52 flex-shrink-0 cursor-pointer rounded-2xl bg-zinc-100 overflow-hidden shadow-lg"
                  >
                    <div className="w-full h-40 bg-gradient-to-br from-gray-100 via-blue-400 to-blue-700 flex items-center justify-center">
                      <img
                        src={loc.image}
                        alt={`View properties in ${loc.name}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="text-zinc-800 font-semibold text-sm text-center">
                        {loc.name}
                      </h3>
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>

        {/* ----- DESKTOP/LAPTOP VIEW ----- */}
        <div className="hidden lg:flex gap-12 items-center relative">
          {/* Left: Video */}
          <div className="w-1/2 relative -my-16 rounded-xl overflow-hidden">
            <video
              src={locationVid}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[420px] object-cover"
              aria-label="Video showcasing top property locations"
            />
          </div>

          {/* Right: Cards grid */}
          <div className="w-1/2 relative">
            {locations.length > 4 && (
              <>
                <button
                  className="absolute left-[-2rem] top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-105 transition"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="absolute right-[-2rem] top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-105 transition"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="grid grid-cols-2 gap-6">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-72 bg-gray-700 animate-pulse rounded-2xl"
                    />
                  ))
                : locations.slice(0, 4).map((loc, i) => (
                    <motion.div
                      key={i}
                      onClick={() => handleLocationClick(loc.name)}
                      whileHover={{ scale: 1.02 }}
                      className="relative group cursor-pointer rounded-2xl bg-gradient-to-br from-gray-100 via-blue-400 to-blue-700 overflow-hidden"
                      aria-label={`Explore properties in ${loc.name}`}
                    >
                      <div className="w-full h-48 bg-blue-300 flex items-center justify-center">
                        <img
                          src={loc.image}
                          alt={`Top location: ${loc.name}`}
                          className="max-h-full max-w-full object-cover scale-125"
                        />
                      </div>
                      <div className="p-3 relative">
                        <h3 className="text-white text-center font-semibold text-lg">
                          {loc.name}
                        </h3>
                      </div>
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-zinc-700 text-white text-xs px-3 py-1 rounded-lg shadow-lg whitespace-nowrap">
                          Explore Properties in {loc.name}
                        </span>
                      </div>
                    </motion.div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TopLocation;
