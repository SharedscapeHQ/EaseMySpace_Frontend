import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function HeroSearchBar() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [active, setActive] = useState(null);
  const [location, setLocation] = useState("");
  const [bhk, setBhk] = useState("");
  const [occupancy, setOccupancy] = useState("");

  /* ---------- Close on outside click ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActive(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (bhk) params.append("bhk", bhk);
    if (occupancy) params.append("occupancy", occupancy);
    navigate(`/view-properties?${params.toString()}`);
  };

  const sectionClass = (key) => `
    flex-1 h-[66px] px-6 flex items-center cursor-pointer
    transition-colors duration-200
    ${active === key ? "z-10" : "hover:bg-zinc-200 hover:rounded-full"}
  `;

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto mb-10 relative group">
      {/* OUTER BAR */}
      <div
        className={`relative flex items-center h-[66px] rounded-full border border-zinc-200 overflow-hidden
        ${active ? "bg-zinc-100" : "bg-white shadow-sm"}`}
      >
        {/* SLIDING PILL */}
        <div
          className="
            absolute  left-0 h-[64px] w-1/3
            bg-white rounded-full shadow-md
            transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            pointer-events-none
          "
          style={{
            transform:
              active === "location"
                ? "translateX(0%)"
                : active === "bhk"
                ? "translateX(100%)"
                : active === "occupancy"
                ? "translateX(200%)"
                : "translateX(0%)",
            opacity: active ? 1 : 0,
          }}
        />

        {/* LOCATION */}
        <div onClick={() => setActive("location")} className={sectionClass("location")}>
          <div className="flex flex-col items-start w-full">
            <span className="text-xs font-semibold text-zinc-800">Location</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search area"
              className="text-sm bg-transparent outline-none text-zinc-600 w-full"
            />
          </div>
        </div>

        <Separator active={active} />

        {/* BHK */}
        <div onClick={() => setActive("bhk")} className={sectionClass("bhk")}>
          <div className="flex flex-col items-start w-full">
            <span className="text-xs font-semibold text-zinc-800">BHK</span>
            <select
              value={bhk}
              onChange={(e) => setBhk(e.target.value)}
              className="text-sm bg-transparent outline-none text-zinc-600 w-full appearance-none"
            >
              <option value="">Select</option>
              <option>1 RK</option>
              <option>1 BHK</option>
              <option>2 BHK</option>
              <option>3 BHK+</option>
            </select>
          </div>
        </div>

        <Separator active={active} />

        {/* OCCUPANCY + SEARCH */}
        <div
          onClick={() => setActive("occupancy")}
          className={`${sectionClass("occupancy")} justify-between`}
        >
          <div className="flex items-center w-full gap-4">
            <div className="flex flex-col items-start w-full">
              <span className="text-xs font-semibold text-zinc-800">
                Looking For?
              </span>
              <select
                value={occupancy}
                onChange={(e) => setOccupancy(e.target.value)}
                className="text-sm bg-transparent outline-none text-zinc-700 w-full appearance-none"
              >
                <option value="">Occupancy</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="triple">Triple+</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="
                w-10 h-10 shrink-0
                rounded-full bg-blue-500 hover:bg-blue-600
                text-white flex items-center justify-center
                shadow-md transition-all duration-200
                hover:scale-105 active:scale-95
              "
            >
              <FiSearch size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Separator ---------- */
function Separator({ active }) {
  return (
    <div
      className={`w-px h-8 bg-zinc-300 transition-opacity
      ${active ? "opacity-0" : "group-hover:opacity-0 opacity-100"}`}
    />
  );
}
