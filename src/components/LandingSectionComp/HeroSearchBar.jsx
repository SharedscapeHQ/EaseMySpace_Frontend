// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiSearch, FiMapPin, FiCheck } from "react-icons/fi";

// export default function HeroSearchBar() {
//   const navigate = useNavigate();
//   const containerRef = useRef(null);

//   const [active, setActive] = useState(null);
//   const [location, setLocation] = useState("");
//   const [bhk, setBhk] = useState("");
//   const [occupancy, setOccupancy] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const autocompleteServiceRef = useRef(null);
//   const sessionTokenRef = useRef(null);

//   /* ---------- Handle outside click ---------- */
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setActive(null);
//         setSuggestions([]);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* ---------- Initialize AutocompleteService ---------- */
//   useEffect(() => {
//     const loadGoogleScript = () => {
//       if (!window.google) {
//         const script = document.createElement("script");
//         script.src =
//           "https://maps.googleapis.com/maps/api/js?key=AIzaSyARyFU8-dg2b25qj4bq8Vhp3K4-LCoL57U&libraries=places";
//         script.async = true;
//         document.body.appendChild(script);
//         script.onload = initService;
//       } else {
//         initService();
//       }
//     };

//     const initService = () => {
//       autocompleteServiceRef.current =
//         new window.google.maps.places.AutocompleteService();
//       sessionTokenRef.current =
//         new window.google.maps.places.AutocompleteSessionToken();
//     };

//     loadGoogleScript();
//   }, []);

//   /* ---------- Fetch Suggestions ---------- */
//   const fetchSuggestions = (input) => {
//     if (!input || !autocompleteServiceRef.current) {
//       setSuggestions([]);
//       return;
//     }

//     autocompleteServiceRef.current.getQueryPredictions(
//       {
//         input,
//         componentRestrictions: { country: "in" },
//         sessionToken: sessionTokenRef.current,
//       },
//       (predictions, status) => {
//         if (
//           status === window.google.maps.places.PlacesServiceStatus.OK &&
//           predictions
//         ) {
//           setSuggestions(predictions);
//         } else {
//           setSuggestions([]);
//         }
//       }
//     );
//   };

//   const handleSelectSuggestion = (description) => {
//     setLocation(description.split(",")[0]);
//     setSuggestions([]);
//   };

//   const handleSearch = () => {
//     const params = new URLSearchParams();
//     if (location) params.append("location", location);
//     if (bhk) params.append("bhk", bhk);
//     if (occupancy) params.append("occupancy", occupancy);
//     navigate(`/view-properties?${params.toString()}`);
//   };

//   const sectionClass = (key) =>
//     `flex-1 h-[66px] px-6 flex items-center cursor-pointer transition-colors duration-200 ${
//       active === key ? "z-10" : "hover:bg-zinc-200 hover:rounded-full"
//     }`;

//   const bhkOptions = ["1 RK", "2 RK", "1 BHK", "1.5 BHK", "2 BHK", "2.5 BHK", "3 BHK", "4 BHK"];
//   const occupancyOptions = ["Single", "Double", "Triple+"];

//   return (
//     <div ref={containerRef} className="max-w-4xl flex items-center mx-auto mb-10 relative group z-20">
//       <div
//         className={`relative flex items-center lg:h-[66px] h-[55px] rounded-full border border-zinc-200 ${
//           active ? "bg-zinc-100" : "bg-white w-full shadow-sm"
//         }`}
//       >
//         {/* Sliding Pill */}
//         <div
//           className="absolute left-0 h-[64px] w-1/3 bg-white rounded-full shadow-md transition-all duration-300 pointer-events-none"
//           style={{
//             transform:
//               active === "location"
//                 ? "translateX(0%)"
//                 : active === "bhk"
//                 ? "translateX(100%)"
//                 : active === "occupancy"
//                 ? "translateX(200%)"
//                 : "translateX(0%)",
//             opacity: active ? 1 : 0,
//           }}
//         />

//         {/* LOCATION */}
//         <div onClick={() => setActive("location")} className={sectionClass("location")}>
//           <div className="flex flex-col items-start w-full relative">
//             <span className="text-xs  text-zinc-800">Location</span>
//             <input
//               value={location}
//               onChange={(e) => {
//                 const val = e.target.value;
//                 setLocation(val);
//                 fetchSuggestions(val);
//               }}
//               placeholder="Search"
//               className="lg:text-sm text-xs bg-transparent outline-none text-zinc-600 w-full"
//             />
//             {suggestions.length > 0 && (
//               <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-zinc-200 max-h-96 overflow-y-auto scrollbar-hide w-[400px] lg:w-[500px] p-3">
//                 {suggestions.map((sug) => (
//                   <div
//                     key={sug.place_id}
//                     onClick={() => handleSelectSuggestion(sug.description)}
//                     className="flex items-center gap-4 px-4 py-3 cursor-pointer transition hover:bg-zinc-100 active:bg-zinc-200"
//                   >
//                     <div className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-600 flex-shrink-0">
//                       <FiMapPin size={18} />
//                     </div>
//                     <span className="text-base text-zinc-800 leading-snug text-left">
//                       {sug.description}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <Separator active={active} />

//         {/* BHK */}
//       <div className={sectionClass("bhk")}>
//   <div className="flex flex-col items-start w-full relative">
//     <span className="lg:text-sm text-[12px]  text-zinc-800 mb-1">BHK</span>

//     {/* Selected value aligned left */}
//     <div
//       onClick={() => setActive("bhk")}
//       className="lg:text-sm text-[12px] text-zinc-700 w-full cursor-pointer py-1 text-left"
//     >
//       {bhk || "Select"}
//     </div>

//     {/* Dropdown menu */}
//     {active === "bhk" && (
//       <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-zinc-200 z-[9999] max-h-64 overflow-y-auto scrollbar-hide w-full">
//         {bhkOptions.map((opt) => (
//           <div
//             key={opt}
//             onClick={() => {
//               setBhk(opt);
//               setActive(null);
//             }}
//             className="flex items-center justify-between px-4 py-3 cursor-pointer transition hover:bg-zinc-100 active:bg-zinc-200"
//           >
//             <span className="text-sm text-zinc-800">{opt}</span>
//             {bhk === opt && <FiCheck className="text-green-500 w-5 h-5" />}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// </div>


//         <Separator active={active} />

//         {/* OCCUPANCY + SEARCH */}
//       <div className={`${sectionClass("occupancy")} flex items-center justify-between`}>
//   <div className="flex flex-col items-start w-full relative">
//     <span className="lg:text-sm text-[12px] text-zinc-800 mb-1 whitespace-nowrap">Looking For?</span>

//     {/* Selected value aligned left, no border */}
//     <div
//       onClick={() => setActive("occupancy")}
//       className="lg:text-sm text-[12px] text-zinc-700 w-full cursor-pointer py-1 text-left"
//     >
//       {occupancy || "Occupancy"}
//     </div>

//     {/* Dropdown menu */}
//     {active === "occupancy" && (
//       <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-zinc-200 z-[9999] max-h-64 overflow-y-auto scrollbar-hide w-full">
//         {occupancyOptions.map((opt) => (
//           <div
//             key={opt}
//             onClick={() => {
//               setOccupancy(opt);
//               setActive(null);
//             }}
//             className="flex items-center justify-between px-4 py-3 cursor-pointer transition hover:bg-zinc-100 active:bg-zinc-200"
//           >
//             <span className="text-sm text-zinc-800">{opt}</span>
//             {occupancy === opt && <FiCheck className="text-green-500 w-5 h-5" />}
//           </div>
//         ))}
//       </div> 
//     )}
//   </div>

//   {/* Center-aligned search button */}

// </div>


//       </div>
//         <button
//     onClick={handleSearch}
//     className="lg:w-14 lg:h-14 w-10 h-10 flex-shrink-0 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 active:scale-95 ml-3"
//   >
//     <FiSearch size={22}  />
//   </button>
//     </div>
//   );
// }

// function Separator({ active }) {
//   return (
//     <div
//       className={`lg:w-px h-8 bg-zinc-300 transition-opacity ${
//         active ? "opacity-0" : "group-hover:opacity-0 opacity-100"
//       }`}
//     />
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin } from "react-icons/fi";

const GOOGLE_PLACES_API_KEY = "AIzaSyA7eEHeUbXgAcQpRh9Drs0lXetq7VB8N4A";

export default function HeroSearchBar() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [location, setLocation] = useState("");

 useEffect(() => {
  if (!window.google) {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      initAutocomplete();
    };
    document.body.appendChild(script);
  } else {
    initAutocomplete();
  }
}, []);

  const initAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["(cities)"], // restrict to cities
      componentRestrictions: { country: "in" },
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.name) {
        setLocation(place.name);
      }
    });
  };

  const handleSearch = () => {
    if (!location) return;
    const params = new URLSearchParams();
    params.append("location", location);
    navigate(`/view-properties?${params.toString()}`);
  };

  return (
    <div ref={containerRef} className="w-full relative pb-8 lg:pt-8">
      <div className="flex w-full items-center relative">
        <div className="flex-1 relative">
          <label
            htmlFor="locationInput"
            className="absolute -top-3 left-4 text-[10px] lg:text-xs text-gray-500 font-medium bg-white px-1 pointer-events-none"
          >
            Location
          </label>
          <input
            ref={inputRef}
            id="locationInput"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city, area, or landmark"
            className="w-full lg:py-5 py-3 pl-4 pr-12 rounded-2xl text-md outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200"
          />
          <FiMapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        <button
          onClick={handleSearch}
          className="ml-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full lg:w-14 lg:h-14 w-10 h-10 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <FiSearch size={24} />
        </button>
      </div>
    </div>
  );
}