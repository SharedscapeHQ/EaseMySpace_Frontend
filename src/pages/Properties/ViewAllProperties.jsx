import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import { Helmet } from "react-helmet";

import OtpPopup from "./OtpPopup";
import { getCurrentUser } from "../../api/authApi.js";

// Components
import PropertyCard from "../../components/ViewAllPropertiesSectionComp/PropertyCard.jsx";
import Pagination from "../../components/ViewAllPropertiesSectionComp/Pagination.jsx";
import SalesPersonCard from "../../components/ViewAllPropertiesSectionComp/SalesPersonCard.jsx";
import PropertyCardSkeleton from "../../components/ViewAllPropertiesSectionComp/PropertyCardSkeleton.jsx";

import { GoSortAsc } from "react-icons/go";
import { GoSortDesc } from "react-icons/go";

// --- helpers ---
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

l = l.filter((p) => {
  const price = Number(p.price) || 0; // ✅ make sure it's a number
  if (!isNaN(min) && price < min) return false;
  if (!isNaN(max) && price > max) return false;
  return true;
})
  if (sort === "price_asc") l.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") l.sort((a, b) => b.price - a.price);
  return l;
};

// --- main component ---
export default function ViewAllProperties() {
  const { search } = useLocation();
  const qs = new URLSearchParams(search);
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    location: qs.get("location") || "",
    minPrice: qs.get("min") || "",
    maxPrice: qs.get("max") || "",
    gender: qs.get("gender") || "",
    occupancy: qs.get("occ") || "",
    bhk: qs.get("bhk") || "",
    looking_for: qs.get("looking_for") || "",
  });
  const [sort, setSort] = useState(qs.get("sort") || "newest");

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const otpVerified = localStorage.getItem("otp_verified") === "true";
  const [isOtpVerified, setIsOtpVerified] = useState(otpVerified);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("user")
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // --- fetch user login status ---
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("user");
          setIsLoggedIn(false);
        }
      } catch {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const syncLogin = () => setIsLoggedIn(!!localStorage.getItem("user"));
    window.addEventListener("storage", syncLogin);
    window.addEventListener("auth-change", syncLogin);
    return () => {
      window.removeEventListener("storage", syncLogin);
      window.removeEventListener("auth-change", syncLogin);
    };
  }, []);

  // --- fetch properties ---
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
        console.error("Failed to fetch properties", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ update query params when filters/sort change
  const updateQueryParams = useCallback(
    (newFilters, newSort) => {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([k, v]) => {
        if (v) {
          if (k === "minPrice") params.set("min", v);
          else if (k === "maxPrice") params.set("max", v);
          else if (k === "occupancy") params.set("occ", v);
          else params.set(k, v);
        }
      });
      if (newSort && newSort !== "newest") params.set("sort", newSort);
      navigate({ search: params.toString() }, { replace: true });
    },
    [navigate]
  );

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    updateQueryParams(newFilters, sort);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    updateQueryParams(filters, newSort);
  };

  const applyNow = useCallback(
    () => setFiltered(applyFiltersSort(properties, filters, sort)),
    [properties, filters, sort]
  );

  useEffect(() => {
    setFiltered(applyFiltersSort(properties, filters, sort));
    setCurrentPage(1);
  }, [filters, sort, properties]);

  return (
    <div
      className="w-full pb-5 bg-zinc-100 min-h-screen lg:py-5 py-3 "
      style={{ fontFamily: "para_font" }}
    >
      {/* Helmet for SEO */}
      <Helmet>
        <title>
          {filters.looking_for === "pg"
            ? `PGs in ${filters.location || "Mumbai"} | EaseMySpace`
            : filters.looking_for === "flatmate"
            ? `Flatmates in ${filters.location || "Mumbai"} | EaseMySpace`
            : filters.looking_for === "vacant"
            ? `Flats for Rent in ${filters.location || "Mumbai"} | EaseMySpace`
            : `PGs, Flatmates & Flats in ${
                filters.location || "Mumbai"
              } | EaseMySpace`}
        </title>
        <meta
          name="description"
          content={`Find verified ${
            filters.looking_for || "rental"
          } properties in ${
            filters.location || "Mumbai"
          } – PGs, shared flats, flatmates, and vacant rooms. Broker-free listings.`}
        />
      </Helmet>

      {/* Header */}
      <section className="w-full text-center mb-6 px-2">
        <h1
          style={{ fontFamily: "heading_font" }}
          className="text-lg lg:text-3xl font-semibold text-black"
        >
          {filters.looking_for === "pg" &&
            `Verified PGs in ${filters.location || "Mumbai"}`}
          {filters.looking_for === "flatmate" &&
            `Flatmates Wanted in ${filters.location || "Mumbai"}`}
          {filters.looking_for === "vacant" &&
            `Vacant Flats in ${filters.location || "Mumbai"}`}
          {!filters.looking_for &&
            "PGs, Flats & Flatmates Across Mumbai"}
        </h1>
        <p className="text-gray-600 text-sm">
          {filters.looking_for === "pg"
            ? `Book your ideal paying guest accommodation hassle-free`
            : filters.looking_for === "flatmate"
            ? `Connect with potential flatmates quickly and easily`
            : filters.looking_for === "vacant"
            ? `Find available flats ready to move in`
            : `Explore PGs, flats, and flatmate options across Mumbai`}
        </p>
      </section>

      {/* Filter Bar */}
  <div className="sticky top-20 z-20 bg-white border border-gray-200 shadow-sm py-3 rounded-lg w-full max-w-7xl mx-auto mb-6 overflow-x-auto scrollbar-hide">
  <div className="flex items-center gap-4 flex-nowrap px-3 min-w-max">
    {/* Looking For */}
    <select
      name="looking_for"
      value={filters.looking_for || ""}
      onChange={handleFilterChange}
      className="text-sm px-3 py-2 border rounded-md shadow-sm bg-white"
    >
      <option value="">
        {filters.looking_for ? "Reset" : "Products"}
      </option>
      <option value="pg">PG</option>
      <option value="flatmate">Flatmate</option>
      <option value="vacant">Vacant Flat</option>
    </select>

    {/* Location Search */}
    <div className="relative">
      <IoSearchOutline
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
        size={18}
      />
      <input
        type="text"
        name="location"
        value={filters.location}
        onChange={(e) => {
          handleFilterChange(e);
          setFiltered(
            applyFiltersSort(properties, { ...filters, location: e.target.value }, sort)
          );
        }}
        placeholder="Search by location"
        className="w-48 pl-8 pr-3 py-2 text-sm border rounded-md shadow-sm bg-white"
      />
    </div>

    {/* Occupancy */}
    <select
      name="occupancy"
      value={filters.occupancy || ""}
      onChange={handleFilterChange}
      className="text-sm px-3 py-2 border rounded-md shadow-sm bg-white"
    >
      <option value="">
        {filters.occupancy ? "Reset" : "Occupancy"}
      </option>
      <option value="single">Single</option>
      <option value="double">Double</option>
      <option value="triple">Triple</option>
    </select>

    {/* BHK */}
    <select
      name="bhk"
      value={filters.bhk || ""}
      onChange={handleFilterChange}
      className="text-sm px-3 py-2 border rounded-md shadow-sm bg-white"
    >
      <option value="">{filters.bhk ? "Reset" : "BHK"}</option>
      <option value="1">1 BHK</option>
      <option value="1.5">1.5 BHK</option>
      <option value="2">2 BHK</option>
      <option value="2.5">2.5 BHK</option>
      <option value="3">3 BHK</option>
      <option value="3.5">3.5 BHK</option>
      <option value="4">4+ BHK</option>
    </select>

    {/* Gender */}
    <select
      name="gender"
      value={filters.gender || ""}
      onChange={handleFilterChange}
      className="text-sm px-3 py-2 border rounded-md shadow-sm bg-white"
    >
      <option value="">{filters.gender ? "Reset" : "Gender"}</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="any">Any</option>
    </select>

    {/* Budget */}
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleFilterChange}
          placeholder="Min ₹"
          className="w-24 px-2 py-2 text-sm border rounded-md shadow-sm bg-white"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          placeholder="Max ₹"
          className="w-24 px-2 py-2 text-sm border rounded-md shadow-sm bg-white"
        />
      </div>
    </div>

    {/* Sort */}
    <button
  onClick={() => handleSortChange("price_desc")}
  className={`flex items-center gap-2 text-sm px-3 py-2 border rounded-md shadow-sm ${
    sort === "price_desc"
      ? "bg-indigo-100 text-indigo-700 border-indigo-300"
      : "text-gray-600 border-gray-200 hover:bg-gray-100"
  }`}
>
  <GoSortDesc className="w-4 h-4" />
  <span>(High → Low)</span>
</button>

<button
  onClick={() => handleSortChange("price_asc")}
  className={`flex items-center gap-2 text-sm px-3 py-2 border rounded-md shadow-sm ${
    sort === "price_asc"
      ? "bg-indigo-100 text-indigo-700 border-indigo-300"
      : "text-gray-600 border-gray-200 hover:bg-gray-100"
  }`}
>
  <GoSortAsc className="w-4 h-4" />
  <span> (Low → High)</span>
</button>
  </div>
</div>



      {/* Listings */}
<section className="w-full max-w-7xl mx-auto space-y-8 lg:px-0 px-3">
  {loading ? (
    <PropertyCardSkeleton />
  ) : paginatedProperties.length === 0 ? (
    <p className="text-center text-gray-500 text-lg mt-20">
      No properties match your filters.
    </p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {paginatedProperties.map((p, index) => (
        <React.Fragment key={p.id}>
          {/* Default property card */}
          <PropertyCard
            p={p}
            setShowOtpPopup={setShowOtpPopup}
            setIsOtpVerified={setIsOtpVerified}
            setSelectedPropertyId={setSelectedPropertyId}
            isOtpVerified={isOtpVerified}
            isLoggedIn={isLoggedIn}
          />

          {/* 📱 On mobile: insert SalesPersonCard after 3rd property */}
          {index === 2 && (
            <div className="block lg:hidden">
              <SalesPersonCard className="w-full h-full" />
            </div>
          )}

          {/* 💻 On desktop: special layout with salesperson card centered */}
          {index === 4 && paginatedProperties.length > 6 && (
            <>
              {/* SalesPerson card spanning 2 cols */}
              <div className="hidden lg:flex lg:col-span-2">
                <SalesPersonCard className="w-full h-full" />
              </div>
            </>
          )}

          {/* Edge case → if only 2–3 properties total, still show card */}
          {paginatedProperties.length <= 3 &&
            index === paginatedProperties.length - 1 && (
              <div className="lg:col-span-2 flex">
                <SalesPersonCard className="w-full h-full" />
              </div>
            )}
        </React.Fragment>
      ))}
    </div>
  )}

  {/* Post Requirements Box */}
  <div className="w-full bg-blue-100 mt-5 flex flex-col md:flex-row items-center justify-between px-4 py-4 rounded-lg shadow-sm">
    <div className="mb-2 md:mb-0">
      <div className="text-xs font-semibold text-gray-900">
        Didn't get what you are searching for?
      </div>
      <div className="text-xs text-gray-600 mt-1">
        Post your requirement and we’ll connect to solve your space issue.
      </div>
    </div>
    <Link
      to="/demand-form"
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition"
    >
      Post Requirements
    </Link>
  </div>
</section>





      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* OTP Popup */}
      {showOtpPopup && (
        <OtpPopup
          otpPurpose="view property"
          onVerified={() => {
            setIsOtpVerified(true);
            setShowOtpPopup(false);
            if (selectedPropertyId) {
              const prop = properties.find((p) => p.id === selectedPropertyId);
              if (prop)
                navigate(`/properties/${selectedPropertyId}`, {
                  state: { property: prop },
                });
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
