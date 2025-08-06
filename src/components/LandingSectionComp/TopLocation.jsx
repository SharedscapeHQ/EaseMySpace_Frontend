import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLocations } from "../../api/adminApi";

function TopLocation() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

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
      style={{ fontFamily: "para_font" }}
      className="w-full lg:pb-10 bg-zinc-50"
    >
      <div className="max-w-7xl lg:px-10 px-3 mx-auto">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-lg sm:text-3xl mb-5 text-left"
        >
          Top Locations
        </h2>

        <div className="flex overflow-x-auto gap-5 scrollbar-hide">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="group w-[170px] h-[170px] sm:min-w-0 flex-shrink-0 bg-zinc-200 animate-pulse rounded-xl"
                />
              ))
            : locations.map((loc, i) => (
                <div
                  key={i}
                  onClick={() => handleLocationClick(loc.name)}
                  className="group w-[140px] h-[140px] sm:min-w-0 flex-shrink-0 bg-gradient-to-br from-white to-blue-100 rounded-xl p-3 transition-all flex flex-col items-center justify-center text-center cursor-pointer border border-zinc-200"
                >
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className="w-32 h-32 object-cover rounded-lg transition-transform duration-300"
                  />
                  <p className=" pb-4 text-[13px] capitalize text-zinc-800 font-medium lg:group-hover:scale-125 transition-all duration-200">
                    {loc.name}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export default TopLocation;
