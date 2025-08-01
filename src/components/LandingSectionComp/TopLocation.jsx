import React from "react";
import { useNavigate } from "react-router-dom";

function TopLocation() {
  const navigate = useNavigate();

  const handleLocationClick = (location) => {
    navigate(`/view-properties?location=${encodeURIComponent(location)}`);
  };

  const locations = [
    { name: "Powai", img: "/images/mumbai.svg" },
    { name: "Goregaon", img: "/images/delhi.svg" },
    { name: "Andheri", img: "/images/goa.svg" },
    { name: "Lokhandwala", img: "/images/bangalore.svg" },
    { name: "Versova", img: "/images/jaipur.svg" },
  ];

  return (
    <section style={{ fontFamily: "para_font" }} className="w-full py-10 lg:px-20 px-4 bg-zinc-50 ">
      <div className="max-w-7xl mx-auto">
        <h2 style={{ fontFamily: "heading_font" }} className="text-lg sm:text-3xl mb-5 text-left">
          Top Locations
        </h2>

        <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 scrollbar-hide">
          {locations.map((loc, i) => (
            <div
              key={i}
              onClick={() => handleLocationClick(loc.name)}
              className="w-[170px] sm:min-w-0 flex-shrink-0 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer hover:scale-[1.02]"
            >
              <img src={loc.img} alt={loc.name} className="w-12 h-12 mb-2" />
              <p className="text-sm font-medium text-gray-700">{loc.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopLocation;
