import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import OtpPopup from "../../pages/Properties/OtpPopup";
import LocationFetcher from "../LocationFetchIP/LocationFetcher";

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

export default function NearbyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState("");
  const [allLocations, setAllLocations] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [isOtpVerified, setIsOtpVerified] = useState(localStorage.getItem("otp_verified") === "true");
  const [isLoggedIn] = useState(() => !!localStorage.getItem("user"));
  const [locationDenied, setLocationDenied] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();


  const filterProperties = (allProperties, userLocation, manualLocation) => {
  const search = (manualLocation || userLocation.city || userLocation.region || "").toLowerCase();

  return allProperties.filter((p) => {
    if (!p.location) return false;

    // Split property location by comma and check each part
    const locParts = p.location.toLowerCase().split(",").map((s) => s.trim());

    return locParts.some((part) => part.includes(search));
  });
};

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

useEffect(() => {
  if (!userLocation) return;

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://api.easemyspace.in/api/properties/all");

      // Collect all unique locations for dropdown
      const locationsSet = new Set(res.data.map((p) => p.location?.trim()).filter(Boolean));
      setAllLocations([...locationsSet]);

      // Flexible filtering function
      const filterProperties = (allProperties, userLocation, manualLocation) => {
        const search = (manualLocation || userLocation.city || userLocation.region || "").toLowerCase();
        return allProperties.filter((p) => {
          if (!p.location) return false;
          const locParts = p.location.toLowerCase().split(",").map((s) => s.trim());
          return locParts.some((part) => part.includes(search));
        });
      };

      const filtered = filterProperties(res.data, userLocation, manualLocation);

      setProperties(filtered.slice(0, 6).map((p) => ({ ...p, images: parseImages(p.image) })));
    } catch (err) {
      console.error(err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProperties();
}, [userLocation, manualLocation]);







  const handlePropertyClick = (e, property) => {
    if (!isLoggedIn && !isOtpVerified) {
      e.preventDefault();
      setSelectedPropertyId(property.id);
      setShowOtpPopup(true);
      return;
    }
    navigate(`/properties/${property.id}`);
  };

  const handleSelectLocation = (loc) => {
    setManualLocation(loc);
    setSearchTerm("");
    setOpenDropdown(false);
  };

  const filteredLocations = allLocations.filter((loc) =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headingText = manualLocation || userLocation?.city || userLocation?.region
    ? `Properties near ${manualLocation || userLocation.city || userLocation.region}`
    : "Properties near...";

  const renderPropertyCard = (p) => {
    const url = p.images[0];
    const isImage = /\.(jpe?g|png|webp)$/i.test(url);
    const isVideo = /\.(mp4|mov|webm)$/i.test(url);

    return (
      <div
        key={p.id}
        onClick={(e) => handlePropertyClick(e, p)}
        className="min-w-[270px] max-w-[270px] bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden group relative transition-all duration-300 cursor-pointer"
      >
        <div className="hidden lg:block absolute inset-x-0 bottom-0 bg-blue-500 h-0 group-hover:h-full transition-all duration-300 ease-in-out z-0 rounded-2xl"></div>
        <article className="flex flex-col h-full relative z-10">
          <div className="relative h-48 w-full p-3 z-10">
            <div className="absolute top-4 left-4 z-20 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-lg shadow-md">New</div>
            <div className="h-full w-full rounded-xl overflow-hidden">
              {isImage && <img src={url} alt="Property" className="h-full w-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-transform duration-300" loading="lazy" />}
              {isVideo && <video src={url} controls className="h-full w-full object-cover" loading="lazy" />}
            </div>
          </div>
          <div className="p-4 flex flex-col gap-1 z-10 relative lg:group-hover:text-white transition-colors duration-300">
            <h3 className="font-semibold text-md truncate">{p.bhk_type || p.title}</h3>
            <p className="font-bold text-xs lg:text-base whitespace-nowrap" style={{ fontFamily: "heading_font" }}>
              ₹ {Number(p.price).toLocaleString()}/mo
            </p>
            <p className="text-gray-600 lg:group-hover:text-white text-xs truncate">{p.location}</p>
          </div>
        </article>
      </div>
    );
  };

  // ✅ Early return if user denied location
  if (locationDenied) return null;

  return (
    <div className="bg-zinc-50 pb-5">
      <section className="lg:px-10 px-3 rounded-2xl max-w-7xl mx-auto relative" style={{ fontFamily: "para_font" }}>
        <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
          <h2 className="text-[16px] lg:text-3xl text-left text-black" style={{ fontFamily: "heading_font" }}>
            {headingText}
          </h2>

          {allLocations.length > 0 && (
            <div className="relative inline-block" ref={dropdownRef}>
              <button onClick={() => setOpenDropdown(!openDropdown)} className="flex items-center gap-1 text-blue-600 font-medium hover:underline">
                {manualLocation || "Choose Location"}
                <FiChevronDown className={`transition-transform ${openDropdown ? "rotate-180" : ""}`} />
              </button>
              {openDropdown && (
                <div className="absolute left-0 mt-2 w-48 min-h-60 overflow-y-hidden bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <div className="relative p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring focus:ring-blue-400 focus:border-blue-400 outline-none"
                    />
                  </div>
                  <div className="overflow-y-auto max-h-64">
                    {filteredLocations.length ? filteredLocations.map((loc, i) => (
                      <div key={i} onClick={() => handleSelectLocation(loc)} className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer">{loc}</div>
                    )) : <div className="px-4 py-2 text-sm text-gray-500">No properties here. Try changing location.</div>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!userLocation && !locationDenied && (
          <LocationFetcher
            onLocationFetched={(loc) => {
              if (loc === null) setLocationDenied(true); // signal denied
              else setUserLocation(loc);
            }}
          />
        )}

        {loading || !userLocation ? (
          <div className="flex gap-5 overflow-x-auto scroll-smooth pb-4 scrollbar-hide">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="min-w-[270px] max-w-[270px] group bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden animate-pulse">
                <div className="h-48 w-full bg-gray-200" />
                <div className="p-4 flex flex-col gap-1">
                  <div className="h-4 bg-gray-200 rounded w-[60%] mb-2" />
                  <div className="h-4 bg-gray-300 rounded w-[30%] mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-[40%] mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-[70%]" />
                </div>
              </div>
            ))}
          </div>
        ) : !properties.length ? (
          <p className="text-center text-gray-500 mt-10">No properties found near {manualLocation || userLocation?.city || "your area"}. <br />Try changing location.</p>
        ) : (
          <div className="flex gap-5 overflow-x-auto scroll-smooth pb-4 scrollbar-hide">
            {properties.map(renderPropertyCard)}
          </div>
        )}
      </section>

      {showOtpPopup && (
        <OtpPopup
          otpPurpose="view property"
          onVerified={() => {
            setIsOtpVerified(true);
            setShowOtpPopup(false);
            if (selectedPropertyId) navigate(`/properties/${selectedPropertyId}`);
          }}
          onClose={() => {
            setShowOtpPopup(false);
            setSelectedPropertyId(null);
          }}
        />
      )}
    </div>
  );
}
