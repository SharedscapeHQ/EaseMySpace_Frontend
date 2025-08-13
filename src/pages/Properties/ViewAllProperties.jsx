import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearchOutline } from "react-icons/io5";
import { FaSlidersH } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

import { incrementPropertyView } from "../../api/propertiesApi.js";
import OtpPopup from "./OtpPopup";
import axios from "axios";
import { getCurrentUser } from "../../api/authApi.js";
import { addRecentlyViewedProperty } from "../../api/userApi.js";

const parseImages = (raw) =>
  !raw
    ? []
    : Array.isArray(raw)
    ? raw
    : raw.startsWith("{")
    ? raw
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

const pickCover = (arr = []) =>
  arr.find((u) => /\.(jpe?g|png|webp)$/i.test(u)) || null;

const bhkNumber = (val = "") => {
  const n = parseFloat(String(val).replace(/[^\d.]/g, ""));
  return isNaN(n) ? null : n;
};

const applyFiltersSort = (list, f, sort) => {
  let l = [...list];
  if (f.location.trim())
    l = l.filter((p) =>
      p.location.toLowerCase().includes(f.location.toLowerCase())
    );
  if (f.gender) l = l.filter((p) => p.gender?.toLowerCase() === f.gender);
  if (f.occupancy)
    l = l.filter((p) => p.occupancy?.toLowerCase() === f.occupancy);
  if (f.bhk) {
    const want = parseFloat(f.bhk);
    l = l.filter((p) => {
      const val = bhkNumber(p.bhk_type);
      if (val === null) return false;
      return want === 4 ? val >= 4 : Math.abs(val - want) < 0.01;
    });
  }

  if (f.looking_for) l = l.filter((p) => p.looking_for === f.looking_for);
  const min = parseInt(f.minPrice, 10);
  const max = parseInt(f.maxPrice, 10);
  if (!isNaN(min)) l = l.filter((p) => p.price >= min);
  if (!isNaN(max)) l = l.filter((p) => p.price <= max);
  if (sort === "price_asc") l.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") l.sort((a, b) => b.price - a.price);
  return l;
};

export default function ViewAllProperties() {
  const { search } = useLocation();
  const qs = new URLSearchParams(search);
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: qs.get("location") || "",
    minPrice: qs.get("min") || "",
    maxPrice: qs.get("max") || "",
    gender: qs.get("gender") || "",
    occupancy: qs.get("occ") || "",
    bhk: qs.get("bhk") || "",
    looking_for: qs.get("looking_for") || "",
  });
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const otpVerified = localStorage.getItem("otp_verified") === "true";
  const [isOtpVerified, setIsOtpVerified] = useState(otpVerified);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const cache = localStorage.getItem("user");
    return !!cache;
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setIsLoggedIn(false);
        localStorage.removeItem("user");
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const syncLogin = () => {
      const cache = localStorage.getItem("user");
      setIsLoggedIn(!!cache);
    };

    window.addEventListener("storage", syncLogin);
    window.addEventListener("auth-change", syncLogin);
    return () => {
      window.removeEventListener("storage", syncLogin);
      window.removeEventListener("auth-change", syncLogin);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://api.easemyspace.in/api/properties/all",
          { withCredentials: true }
        );
        const ready = data.map((p) => {
          const imgs = parseImages(p.image);
          return { ...p, images: imgs, cover: pickCover(imgs) };
        });
        setProperties(ready);
        setFiltered(ready);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const applyNow = useCallback(
    () => setFiltered(applyFiltersSort(properties, filters, sort)),
    [properties, filters, sort]
  );

  useEffect(() => {
    setFiltered(applyFiltersSort(properties, filters, sort));
  }, [sort, properties, filters]);

  const headingText = useMemo(() => {
    const renderWithOwnerSubtext = (mainText) => (
      <>
        {mainText}
        <br />
        <span className="text-sm text-gray-800 lg:text-xl">
          Owner's Property
        </span>
      </>
    );

    if (filtered.length === 0) {
      if (filters.looking_for === "pg")
        return renderWithOwnerSubtext("Browse Verified PG Listings");
      if (filters.looking_for === "vacant")
        return renderWithOwnerSubtext("Browse Direct Owner's Listings");
      if (filters.looking_for === "flatmate") return "Matching Listings";
      return "Explore Our Listings";
    }

    if (filtered.every((p) => p.looking_for === "flatmate"))
      return "Matching Listings";
    if (filtered.every((p) => p.looking_for === "vacant"))
      return renderWithOwnerSubtext("Browse Direct Owner's Listings");
    if (filtered.every((p) => p.looking_for === "pg"))
      return renderWithOwnerSubtext("Browse Verified PG Listings");

    return "Explore Our Listings";
  }, [filtered, filters.looking_for]);

  return (
    <div
      style={{ fontFamily: "para_font" }}
      className="w-full bg-indigo-50/30 min-h-screen pt-16 md:pt-10"
    >
      <div className="max-w-6xl mx-auto px-4 flex gap-2">
        <aside className="hidden md:block w-72 flex-shrink-0">
          <div className="sticky top-16 md:top-24 bg-white shadow-md rounded-3xl p-4 border border-gray-100 text-sm">
            <SidebarContent
              filters={filters}
              handleFilterChange={handleFilterChange}
              sort={sort}
              setSort={setSort}
            />
            <button
              onClick={applyNow}
              className="w-full mt-4 py-2 bg-blue-500 hover:bg-blue-700 text-white  rounded-lg shadow"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        <main className="flex-1 flex md:mt-0 -mt-16 flex-col items-center w-full overflow-visible">
          <section className="w-full max-w-4xl mx-auto text-left mb-4 md:-mt-5 mt-2 px-2 md:px-8">
            <h1
              style={{ fontFamily: "heading_font" }}
              className="text-lg lg:text-3xl mb-0 text-black leading-tight"
            >
              {headingText}
            </h1>
            <p className="text-gray-600 text-xs">
              Find your perfect space among verified properties
            </p>
            <div className="inline md:hidden text-sm font-medium">
              All Listings
            </div>
          </section>

          <div className="sticky top-20 mb-4 z-40 md:shadow-sm shadow-none md:border md:bg-white bg-zinc-50 md:border-gray-300 px-4 py-3 rounded-2xl w-full max-w-3xl mx-auto overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 min-w-max">
              {/* Mobile Filter Icon Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="md:hidden text-xl px-2 py-1 rounded-full text-gray-600 hover:bg-gray-100 flex-shrink-0"
                title="Filters"
              >
                <FaSlidersH />
              </button>

              {/* Property Count — inline on desktop */}
              <div className="hidden md:inline text-sm font-medium">
                All Listings
              </div>

              {/* Search Input */}
              <div className="relative md:w-[40%] w-full md:mx-3">
                <IoSearchOutline
                  className=" absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={(e) => {
                    handleFilterChange(e);
                    // Live filter update for location search
                    setFiltered(
                      applyFiltersSort(
                        properties,
                        { ...filters, location: e.target.value },
                        sort
                      )
                    );
                  }}
                  placeholder="Search by location"
                  className="w-full pl-8 px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="flex gap-2 md:pl-0 pl-1">
                <button
                  onClick={() => setSort("price_desc")}
                  className={`text-sm px-3 py-1.5 rounded-lg border whitespace-nowrap  ${
                    sort === "price_desc"
                      ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                      : "text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <span className="hidden md:inline">Rent</span> (High → Low)
                </button>
                <button
                  onClick={() => setSort("price_asc")}
                  className={`text-sm px-3 py-1.5 rounded-lg border whitespace-nowrap ${
                    sort === "price_asc"
                      ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                      : "text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <span className="hidden md:inline">Rent</span> (Low → High)
                </button>
              </div>
            </div>
          </div>

          <section className="w-full max-w-4xl">
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-4 max-w-3xl mx-auto"
                  >
                    {/* Left: Image area */}
                    <div className="w-full md:w-64 flex-shrink-0">
                      <div className="w-full h-48 bg-gray-200 rounded-lg" />
                      <div className="flex gap-2 mt-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="h-20 w-1/3 bg-gray-100 rounded-lg"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right: Textual content */}
                    <div className="flex-1 space-y-4 mt-4 md:mt-0">
                      <div className="h-5 bg-gray-300 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded-full w-24" />
                        <div className="h-6 bg-gray-200 rounded-full w-24" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-8 bg-gray-100 rounded" />
                        <div className="h-8 bg-gray-100 rounded" />
                        <div className="h-8 bg-gray-100 rounded" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-16 bg-gray-100 rounded" />
                        <div className="h-16 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-500 text-lg mt-20">
                No properties match your filters.
              </p>
            ) : (
              <div className="space-y-8">
                {filtered.map((p) => (
                  <PropertyCard
                    key={p.id}
                    p={p}
                    setShowOtpPopup={setShowOtpPopup}
                    setIsOtpVerified={setIsOtpVerified}
                    setSelectedPropertyId={setSelectedPropertyId}
                    isOtpVerified={isOtpVerified}
                    isLoggedIn={isLoggedIn} // Pass the isLoggedIn prop
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative max-h-[90vh] w-full max-w-sm bg-white p-6 pt-8 rounded-3xl shadow-2xl border border-gray-100 overflow-y-auto text-sm">
                {/* Close Button */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="absolute top-3 right-5 text-gray-500 hover:text-gray-700 text-2xl "
                  title="Close"
                >
                  &times;
                </button>

                <SidebarContent
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  sort={sort}
                  setSort={setSort}
                />

                <button
                  onClick={() => {
                    applyNow();
                    setShowFilters(false);
                  }}
                  className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white  rounded-lg shadow"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* OTP Popup Modal */}
      {showOtpPopup && (
        <OtpPopup
        otpPurpose="view property"
          onVerified={(hasPaidStatus) => {
            setIsOtpVerified(true);
            setShowOtpPopup(false);

            if (selectedPropertyId) {
              const propToNavigate = properties.find(
                (prop) => prop.id === selectedPropertyId
              );
              if (propToNavigate) {
                navigate(`/properties/${selectedPropertyId}`, {
                  state: { property: propToNavigate },
                });
              }
            }
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

const SidebarContent = React.memo(function SidebarContent({
  filters,
  handleFilterChange,
  sort,
  setSort,
}) {
  return (
    <div className="space-y-5 text-sm">
      <Select
        label="Gender"
        name="gender"
        opts={[
          ["", "Any"],
          ["male", "Male"],
          ["female", "Female"],
          ["unisex", "Unisex"],
        ]}
        filters={filters}
        handleChange={handleFilterChange}
      />
      <Select
        label="Occupancy"
        name="occupancy"
        opts={[
          ["", "Any"],
          ["single", "Single"],
          ["double", "Double"],
          ["triple", "Triple"],
        ]}
        filters={filters}
        handleChange={handleFilterChange}
      />
      <Select
        label="BHK"
        name="bhk"
        opts={[
          ["", "Any"],
          ["1", "1 BHK"],
          ["1.5", "1.5 BHK"],
          ["2", "2 BHK"],
          ["2.5", "2.5 BHK"],
          ["3", "3 BHK"],
          ["4", "4 BHK+"],
        ]}
        filters={filters}
        handleChange={handleFilterChange}
      />
      <div>
        <label className="block mb-2  text-gray-700">Budget Range (₹)</label>
        <div className="flex gap-2">
          <Input
            name="minPrice"
            type="number"
            placeholder="Min"
            filters={filters}
            handleChange={handleFilterChange}
          />
          <Input
            name="maxPrice"
            type="number"
            placeholder="Max"
            filters={filters}
            handleChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );
});

function Input({
  label,
  name,
  filters,
  handleChange,
  className = "",
  ...rest
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block mb-2  text-gray-700 text-sm">{label}</label>
      )}
      <input
        name={name}
        value={filters[name]}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        autoComplete="off"
        {...rest}
      />
    </div>
  );
}

function Select({
  label,
  name,
  opts,
  filters,
  handleChange,
  value,
  onChange,
  className = "",
  ...rest
}) {
  return (
    <div className={className}>
      <label className="block mb-2  text-gray-700 text-sm">{label}</label>
      <select
        name={name}
        value={value || filters[name]}
        onChange={handleChange || onChange}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        {...rest}
      >
        {opts.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}

const PropertyCard = ({
  p,
  setShowOtpPopup,
  setIsOtpVerified,
  setSelectedPropertyId,
  isOtpVerified,
  isLoggedIn,
}) => {
  const thumbs = p.images.filter((img) => img !== p.cover).slice(0, 3);
  const extra = p.images.length - 1 - thumbs.length;

  const handleViewDetailsClick = (event, p) => {
  if (!isLoggedIn && !isOtpVerified) {
    event.preventDefault();
    setSelectedPropertyId(p.id);
    setShowOtpPopup(true);
  } else {
    const visited = JSON.parse(sessionStorage.getItem("viewedProps") || "[]");
    if (!visited.includes(p.id)) {
      incrementPropertyView(p.id);
      addRecentlyViewedProperty(p.id).catch(console.error);
      sessionStorage.setItem(
        "viewedProps",
        JSON.stringify([...visited, p.id])
      );
    }
  }
};



  return (
    <Link
      to={isLoggedIn || isOtpVerified ? `/properties/${p.id}` : "#"}
      state={isLoggedIn || isOtpVerified ? { property: p } : null}
      onClick={(e) => handleViewDetailsClick(e, p)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-300 w-full max-w-3xl mx-auto overflow-x-hidden flex flex-col md:flex-row p-4 gap-4"
    >
      <div className="w-full md:w-64 flex-shrink-0">
        {p.cover ? (
          <img
            src={p.cover}
            alt={p.title}
            loading="lazy"
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center italic text-gray-400 rounded-lg">
            No Image
          </div>
        )}
        <div className="flex gap-2 mt-2">
          {thumbs.map((t, i) => (
            <div key={i} className="relative h-20 w-1/3">
              <img
                src={t}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover rounded-lg"
              />
              {i === thumbs.length - 1 && extra > 0 && (
                <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs rounded-lg">
                  +{extra}
                </span>
              )}
            </div>
          ))}
          {Array.from({ length: 3 - thumbs.length }).map((_, i) => (
            <div
              key={i}
              className="h-20 w-1/3 bg-gray-50 border border-dashed border-gray-200 rounded-lg"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-start flex-1 gap-3">
        <div className="flex items-start justify-between flex-wrap gap-y-1">
          <div>
            <h2 className="text-lg flex items-center gap-1 text-gray-800 leading-snug ">
              {p.looking_for === "pg"
                ? `${p.title || "Untitled Property"}'s PG`
                : p.title || "Untitled Property"}{" "}
              {p.verified && (
                <span className="bg-green-500 text-white text-[8px] px-2 py-1 rounded-full flex items-center gap-1">
                  <FiCheckCircle className="text-[10px]" />
                  Verified
                </span>
              )}
            </h2>

            <p className="text-sm text-gray-500 truncate ">📍 {p.location}</p>
          </div>
          <Link
            to={isLoggedIn || isOtpVerified ? `/properties/${p.id}` : "#"}
            state={isLoggedIn || isOtpVerified ? { property: p } : null}
            onClick={(e) => handleViewDetailsClick(e, p)}
            className="text-indigo-600 text-sm font-medium border border-indigo-600 px-4 py-1.5 rounded-full hover:bg-indigo-50 transition whitespace-nowrap"
          >
            View Details
          </Link>
        </div>

        {p.looking_for && (
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-[2px] rounded-full w-max">
            {p.looking_for === "flatmate"
              ? "Flatmate"
              : p.looking_for === "pg"
              ? "Paying Guest"
              : "Vacant Flat"}
          </span>
        )}

        <div className="grid grid-cols-3 text-center text-xs">
          <Stat
            label="Rent"
            value={`₹ ${p.price?.toLocaleString() || "N/A"}`}
          />
          <Stat
            label="Deposit"
            value={`₹ ${p.deposit?.toLocaleString() || "-"}`}
          />
          <Stat label="Built‑up" value={`${p.sqft || "-"} sqft`} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Feature icon="🛋️" label="Occupancy" value={p.occupancy || "-"} />
          <Feature icon="🏠" label="BHK Type" value={p.bhk_type || "-"} />
          <Feature
            icon="📍"
            label="Distance"
            value={p.distance_from_station || "-"}
          />
          <Feature icon="🔑" label="Available" value={p.flat_status || "-"} />
        </div>
      </div>
    </Link>
  );
};

const Stat = ({ label, value }) => (
  <div className="py-2 border-r last:border-r-0">
    <p className=" text-gray-800">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const Feature = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 p-3 border rounded-lg">
    <span>{icon}</span>
    <div>
      <p className="text-sm font-medium text-gray-700">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
);
