import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearchOutline } from "react-icons/io5";
import { FaSlidersH } from "react-icons/fa";
import axios from "axios";
import Select from "../../components/ViewAllPropertiesSectionComp/Select.jsx";
import { Helmet } from "react-helmet";

import OtpPopup from "./OtpPopup";
import { getCurrentUser } from "../../api/authApi.js";

// Components
import SidebarContent from "../../components/ViewAllPropertiesSectionComp/SidebarContent.jsx";
import PropertyCard from "../../components/ViewAllPropertiesSectionComp/PropertyCard.jsx";
import Pagination from "../../components/ViewAllPropertiesSectionComp/Pagination.jsx";
import SalesPersonCard from "../../components/ViewAllPropertiesSectionComp/SalesPersonCard.jsx";
import PropertyCardSkeleton from "../../components/ViewAllPropertiesSectionComp/PropertyCardSkeleton.jsx";
import ProductSelect from "../../components/ViewAllPropertiesSectionComp/ProductSelect.jsx";

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
  if (!isNaN(min)) l = l.filter((p) => p.price >= min);
  if (!isNaN(max)) l = l.filter((p) => p.price <= max);
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
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const otpVerified = localStorage.getItem("otp_verified") === "true";
  const [isOtpVerified, setIsOtpVerified] = useState(otpVerified);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("user"));

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  useEffect(() => {
    window.scrollTo(0,0);
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

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const applyNow = useCallback(
    () => setFiltered(applyFiltersSort(properties, filters, sort)),
    [properties, filters, sort]
  );

  useEffect(() => {
    setFiltered(applyFiltersSort(properties, filters, sort));
    setCurrentPage(1);
  }, [filters, sort, properties]);

  // --- heading text ---
  const headingText = useMemo(() => {
    const ownerText = (text) => (
      <>
        {text} <br />
        <span className="text-sm text-gray-800 lg:text-xl">Owner's Property</span>
      </>
    );

    if (filtered.length === 0) {
      if (filters.looking_for === "pg") return ownerText("Browse Verified PG Listings");
      if (filters.looking_for === "vacant") return ownerText("Browse Direct Owner's Listings");
      if (filters.looking_for === "flatmate") return "Matching Listings";
      return "Explore Our Listings";
    }

    if (filtered.every((p) => p.looking_for === "flatmate")) return "Matching Listings";
    if (filtered.every((p) => p.looking_for === "vacant")) return ownerText("Browse Direct Owner's Listings");
    if (filtered.every((p) => p.looking_for === "pg")) return ownerText("Browse Verified PG Listings");

    return "Explore Our Listings";
  }, [filtered, filters.looking_for]);

  return (
    <div className="w-full pb-5 bg-zinc-50  min-h-screen lg:py-10" style={{ fontFamily: "para_font" }}>

{/* Helmet for SEO */}
      <Helmet>
        <title>Find Verified PGs, Flatmates & Vacant Flats in Andheri, Goregaon, Thane, Ghatkopar | EaseMySpace</title>
        <meta
          name="description"
          content="Search verified PGs, shared accommodations, flatmates, and vacant flats in Mumbai areas like Andheri, Goregaon, Thane, and Ghatkopar. EaseMySpace makes finding rental spaces hassle-free and broker-free."
        />
        <meta name="keywords" content="PG in Andheri, PG in Goregaon, Flatmates in Mumbai, Shared Flats Mumbai, Vacant Rooms Thane, Flats in Ghatkopar, Mumbai Rentals, Verified PGs Mumbai" />
        <link rel="canonical" href="https://easemyspace.in/view-properties" />
      </Helmet>


      <div className="w-full mx-auto px-1 flex gap-2">
        {/* Sidebar */}
        <aside className="hidden md:block w-72 flex-shrink-0">
          <div className="sticky top-16 md:top-24 bg-white shadow-md rounded-lg p-4 border border-gray-100 text-sm">
            <SidebarContent filters={filters} handleFilterChange={handleFilterChange} sort={sort} setSort={setSort} />
            <button onClick={applyNow} className="w-full mt-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg shadow">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Main Section */}
        <main className="flex-1 flex flex-col items-center w-full overflow-visible">
           <section className="w-full max-w-4xl mx-auto text-left mb-4 md:-mt-5 mt-2 lg:px-0 px-2">
            <h1
              style={{ fontFamily: "heading_font" }}
              className="text-lg lg:text-3xl mb-0 text-black leading-tight"
            >
              {headingText}
            </h1>
            <p className="text-gray-600 text-xs">
              Find your perfect space among verified properties
            </p>
            <div className="inline lg:hidden text-sm font-medium">
              All Listings
            </div>
          </section>

          {/* Search + Sort */}
          <div className="sticky top-20 mb-4 z-20 md:shadow-sm shadow-none md:border md:bg-white bg-zinc-50 md:border-gray-300 px-4 py-3 rounded-lg w-full max-w-3xl mx-auto overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 min-w-max">
              {/* Mobile Filter Icon Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="md:hidden text-xl px-2 py-1 rounded-full text-gray-600 hover:bg-gray-100 flex-shrink-0"
                title="Filters"
              >
                <FaSlidersH />
              </button>

         <ProductSelect
  name="looking_for"
  filters={filters}
  handleChange={handleFilterChange}
  className=" whitespace-nowrap font-medium text-gray-600 text-sm px-3 py-1.5 rounded-xl border-gray-200 "
/>

              {/* Search Input */}
              <div className="relative md:w-[40%] z-20 w-full md:mx-3">
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

          {/* Listings */}
         <section className="w-full max-w-4xl space-y-8">
  {loading ? (
    <PropertyCardSkeleton/>
  ) : paginatedProperties.length === 0 ? (
    <p className="text-center text-gray-500 text-lg mt-20">No properties match your filters.</p>
  ) : (
    paginatedProperties.map((p, index) => (
      <React.Fragment key={p.id}>
        {/* Show SalesPersonCard after 3rd card on mobile */}
        {index === 3 && (
          <div className="block xl:hidden">
            <SalesPersonCard />
          </div>
        )}
        <PropertyCard
          p={p}
          setShowOtpPopup={setShowOtpPopup}
          setIsOtpVerified={setIsOtpVerified}
          setSelectedPropertyId={setSelectedPropertyId}
          isOtpVerified={isOtpVerified}
          isLoggedIn={isLoggedIn}
        />
      </React.Fragment>
    ))
  )}
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
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </main>

       <aside className="hidden xl:block w-80 flex-shrink-0">
  <SalesPersonCard />
</aside>
      </div>

      {/* Mobile Filters */}
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
              <div className="relative max-h-[90vh] w-full max-w-sm bg-white p-6 pt-8 rounded-lg shadow-2xl border border-gray-100 overflow-y-auto text-sm">
                <button onClick={() => setShowFilters(false)} className="absolute top-3 right-5 text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                <SidebarContent filters={filters} handleFilterChange={handleFilterChange} sort={sort} setSort={setSort} />
                <button
                  onClick={() => {
                    applyNow();
                    setShowFilters(false);
                  }}
                  className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* OTP Popup */}
      {showOtpPopup && (
        <OtpPopup
          otpPurpose="view property"
          onVerified={() => {
            setIsOtpVerified(true);
            setShowOtpPopup(false);
            if (selectedPropertyId) {
              const prop = properties.find((p) => p.id === selectedPropertyId);
              if (prop) navigate(`/properties/${selectedPropertyId}`, { state: { property: prop } });
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
