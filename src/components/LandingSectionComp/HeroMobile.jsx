import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline, IoFilterOutline } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";


import pgImg from "/landing-assets/pgImg.webp";
import sharedImg from "/landing-assets/sharedImg.webp";
import vacantImg from "/landing-assets/vacantImg.webp";

export default function HeroMobile() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [location, setLocation] = useState("");
  const [bhk, setBhk] = useState("");
  const [occupancy, setOccupancy] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

const [locationDisplay, setLocationDisplay] = useState("");


  const autocompleteServiceRef = useRef(null);
  const sessionTokenRef = useRef(null);

  /* ---------- Load Google Places API ---------- */
  useEffect(() => {
    const loadGoogleScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src =
          "https://maps.googleapis.com/maps/api/js?key=AIzaSyARyFU8-dg2b25qj4bq8Vhp3K4-LCoL57U&libraries=places";
        script.async = true;
        document.body.appendChild(script);
        script.onload = initService;
      } else {
        initService();
      }
    };

    const initService = () => {
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();
      sessionTokenRef.current =
        new window.google.maps.places.AutocompleteSessionToken();
    };

    loadGoogleScript();
  }, []);

  /* ---------- Fetch suggestions ---------- */
  const fetchSuggestions = (input) => {
    if (!input || !autocompleteServiceRef.current) {
      setSuggestions([]);
      return;
    }

    autocompleteServiceRef.current.getQueryPredictions(
      {
        input,
        componentRestrictions: { country: "in" },
        sessionToken: sessionTokenRef.current,
      },
      (predictions, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  const handleSelectSuggestion = (desc) => {
  setLocationDisplay(desc); 
  setLocation(desc.split(",")[0]); 
  setSuggestions([]);
};

 const handleSearch = () => {
  if (!location && !bhk && !occupancy) {
    alert("Please enter a location, BHK, or occupancy to search.");
    return;
  }

  const params = new URLSearchParams();
  if (location) params.append("location", location.trim()); 
  if (bhk) params.append("bhk", bhk);
  if (occupancy) params.append("occupancy", occupancy);
  navigate(`/view-properties?${params.toString()}`);
};

  const options = [
    { title: "PGs", value: "pg", img: pgImg, color: "bg-blue-100/60" },
    { title: "Flatmate", value: "flatmate", img: sharedImg, color: "bg-green-100/60" },
    { title: "Flat", value: "vacant", img: vacantImg, color: "bg-purple-100/60" },
  ];

  return (
    <section className="lg:hidden w-full bg-white px-4 py-4 space-y-4">
      {/* Property Type */}

<div className="grid grid-cols-3 gap-3">
  {options.map((item) => (
    <Link
      key={item.value}
      to={`/view-properties?looking_for=${item.value}`}
      className="group flex flex-col items-center justify-center rounded-xl bg-white active:scale-95 transition"
    >
      <div
        className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center group-hover:scale-110 transition`}
      >
        <img
          src={item.img}
          alt={item.title}
          className="w-9 h-9 object-contain"
        />
      </div>
      <span className="text-sm text-zinc-700 mt-2 font-medium">
        {item.title}
      </span>
    </Link>
  ))}
</div>


      {/* Search + Filter */}
      <div className="flex items-center gap-3 relative">
        {/* Search Input */}
        <div className="relative flex-1">
         <input
  ref={inputRef}
  type="text"
  value={locationDisplay}
  onChange={(e) => {
    setLocationDisplay(e.target.value);
    fetchSuggestions(e.target.value);
  }}
  placeholder="Search by location"
  className="w-full rounded-full py-3 pl-4 pr-12 border border-zinc-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
/>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-zinc-200 max-h-64 overflow-y-auto z-50">
              {suggestions.map((s) => (
                <div
                  key={s.place_id}
                  onClick={() => handleSelectSuggestion(s.description)}
                  className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-zinc-100"
                >
                  <FiMapPin className="text-zinc-500" />
                  <span>{s.description}</span>
                </div>
              ))}
            </div>
          )}

          {/* Search Button inside input */}
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-md active:scale-95 transition"
          >
            <IoSearchOutline size={20} />
          </button>
        </div>

        {/* Filters Button */}
       <button
  onClick={() => setShowFilters(true)}
  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-700 shadow-md active:scale-95 transition"
>
  <IoFilterOutline size={20} />
</button>
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bottom-12 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>

            {/* BHK */}
            <div className="mb-6">
              <p className="text-sm font-medium text-zinc-700 mb-3">BHK</p>
              <div className="grid grid-cols-3 gap-3">
                {["1 RK","2 RK","1 BHK","1.5 BHK","2 BHK","2.5 BHK","3 BHK","4+ BHK"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setBhk(item)}
                    className={`py-2 rounded-xl text-sm border transition ${
                      bhk === item ? "bg-blue-500 text-white border-blue-500" : "border-zinc-300 text-zinc-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Occupancy */}
            <div className="mb-6">
              <p className="text-sm font-medium text-zinc-700 mb-3">Occupancy</p>
              <div className="grid grid-cols-3 gap-3">
                {[{ label: "Single", value: "single" },{ label: "Double", value: "double" },{ label: "Triple+", value: "triple" }].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setOccupancy(item.value)}
                    className={`py-2 rounded-xl text-sm border transition ${
                      occupancy === item.value ? "bg-blue-500 text-white border-blue-500" : "border-zinc-300 text-zinc-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply */}
            <button
              onClick={() => {
                setShowFilters(false);
                handleSearch();
              }}
              className="w-full rounded-full bg-blue-500 text-white py-3 text-sm font-semibold shadow-md active:scale-95 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
