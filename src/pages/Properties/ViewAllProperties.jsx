import React, { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

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

/* -------- filter + sort helper -------- */
const bhkNumber = (val = "") => {
  const n = parseFloat(String(val).replace(/[^\d.]/g, ""));
  return isNaN(n) ? null : n; // null when not parsable
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
      const val = bhkNumber(p.bhk);
      if (val === null) return false;
      // “4+” means >=4
      return f.bhk === "4" ? val >= 4 : val === want;
    });
  }

  if (f.looking_for) l = l.filter((p) => p.looking_for === f.looking_for);

  const min = parseInt(f.minPrice, 10);
  const max = parseInt(f.maxPrice, 10);
  if (!isNaN(min)) l = l.filter((p) => p.price >= min);
  if (!isNaN(max)) l = l.filter((p) => p.price <= max);

  if (sort === "price_asc") l.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") l.sort((a, b) => b.price - a.price);
  else l.reverse();

  return l;
};

export default function ViewAllProperties() {
  const { search } = useLocation();
  const qs = new URLSearchParams(search);

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

  /* -------- fetch -------- */
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
        setFiltered(applyFiltersSort(ready, filters, sort));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* -------- react to filters/sort -------- */
  useEffect(() => {
    setFiltered(applyFiltersSort(properties, filters, sort));
  }, [filters, sort, properties]);

  /* -------- heading text -------- */
  const headingText = useMemo(() => {
    if (filtered.length === 0) return "Explore Our Listings";
    if (filtered.every((p) => p.looking_for === "flatmate"))
      return "Matching Listings";
    if (filtered.every((p) => p.looking_for === "vacant"))
      return "Browse Direct Owner's Listings (No Broker)";
    return "Explore Our Listings";
  }, [filtered]);

  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  if (loading)
    return (
      <div className="pt-28 text-center text-sky-600">Loading properties…</div>
    );
  if (error)
    return <div className="pt-28 text-center text-red-600">{error}</div>;
  if (!properties.length)
    return <div className="pt-28 text-center">No properties found.</div>;

  /* -------- JSX -------- */
  return (
    <div className="md:pt-10 w-full pt-16 flex bg-indigo-50 min-h-screen">
      <aside className="hidden md:block fixed top-28 left-0 w-72 h-[calc(100vh-7rem)] overflow-y-auto bg-white shadow-lg rounded-r-3xl p-6 z-20">
        <SidebarContent />
      </aside>

      <main className="flex-1 ml-0 md:ml-72 px-4 sm:px-6 pb-12 -mt-10 max-w-7xl mx-auto">
        <button
          onClick={() => setShowFilters(true)}
          className="md:hidden mb-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
        >
          <span className="text-xl">🧰</span>
          Filters & Sort
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-3">
          {headingText}
        </h1>
        <p className="text-gray-600 mb-8 max-w-xl">
          Find your perfect space among verified properties
        </p>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-20">
            No properties match your filters.
          </p>
        ) : (
          <div className="space-y-8">
            {filtered.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </main>

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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 32 }}
              className="fixed top-0 left-0 h-full w-11/12 max-w-xs bg-white z-50 p-6 pt-10 shadow-xl flex flex-col"
            >
              <SidebarContent />
              <button
                onClick={() => setShowFilters(false)}
                className="md:hidden mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  /* -------- sidebar + field helpers -------- */
  function SidebarContent() {
    return (
      <>
        <Input label="Location" name="location" placeholder="e.g. Andheri" />
        <Select
          label="Gender"
          name="gender"
          opts={[
            ["", "Any"],
            ["male", "Male"],
            ["female", "Female"],
            ["unisex", "Unisex"],
          ]}
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
        />
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">
            Price Range (₹)
          </label>
          <div className="flex gap-2">
            <Input name="minPrice" type="number" placeholder="Min" />
            <Input name="maxPrice" type="number" placeholder="Max" />
          </div>
        </div>
        <Select
          label="Sort by"
          name="sortControl"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          opts={[
            ["newest", "Newest"],
            ["price_asc", "Price Low → High"],
            ["price_desc", "Price High → Low"],
          ]}
        />
      </>
    );
  }

  function Input({ label, name, className = "", ...rest }) {
    return (
      <div className={`mb-6 ${className}`}>
        {label && (
          <label className="block mb-2 font-semibold text-gray-700">
            {label}
          </label>
        )}
        <input
          name={name}
          value={filters[name]}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-400 outline-none"
          autoComplete="off"
          {...rest}
        />
      </div>
    );
  }

  function Select({ label, name, opts, className = "", ...rest }) {
    return (
      <div className={`mb-6 ${className}`}>
        <label className="block mb-2 font-semibold text-gray-700">
          {label}
        </label>
        <select
          name={name}
          value={filters[name] ?? rest.value}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-400 outline-none"
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
}

/* -------- card + stat/feature -------- */
const PropertyCard = ({ p }) => {
  const thumbs = p.images.filter((img) => img !== p.cover).slice(0, 3);
  const extra = p.images.length - 1 - thumbs.length;

  return (
    <Link
      to={`/properties/${p.id}`}
      state={{ property: p }}
      className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start px-4 sm:px-5 pt-4 pb-2 border-b">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            {p.title || "Untitled Property"}{" "}
            <span className="text-indigo-600">{p.project}</span>
          </h2>
          <p className="text-sm text-gray-500 truncate">• {p.location}</p>
          {p.looking_for && (
            <span className="inline-block mt-1 bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-[2px] rounded-full">
              {p.looking_for === "flatmate" ? "Flat‑mate" : "Vacant Flat"}
            </span>
          )}
        </div>

        <button className="self-start sm:self-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg">
          Get Details
        </button>
      </div>

      <div className="grid grid-cols-3 text-center text-xs sm:text-sm border-b">
        <Stat label="Rent" value={`₹ ${p.price.toLocaleString()}`} />
        <Stat label="Deposit" value={`₹ ${p.deposit?.toLocaleString() || "-"}`} />
        <Stat label="Built‑up" value={`${p.sqft || "-"} sqft`} />
      </div>

      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-col sm:flex-row w-full sm:w-2/3 gap-2 p-4">
          {p.cover ? (
            <img
              src={p.cover}
              alt={p.title}
              loading="lazy"
              className="w-full h-48 sm:h-64 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 sm:h-64 bg-gray-200 flex items-center justify-center italic text-gray-400 rounded-lg">
              No Image
            </div>
          )}

          <div className="flex sm:flex-col gap-2 sm:w-28 mt-2 sm:mt-0">
            {thumbs.map((t, i) => (
              <div key={i} className="relative h-20 w-1/3 sm:w-full">
                <img
                  src={t}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover rounded-lg"
                />
                {i === thumbs.length - 1 && extra > 0 && (
                  <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-semibold rounded-lg">
                    +{extra}
                  </span>
                )}
              </div>
            ))}
            {Array.from({ length: 3 - thumbs.length }).map((_, i) => (
              <div key={i} className="h-20 w-1/3 sm:w-full bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="w-full sm:w-1/3 flex items-center">
          <div className="grid grid-cols-2 gap-4 w-full px-4 pb-4">
            <Feature icon="🛋️" label="Occupancy" value={p.occupancy || "-"} />
            <Feature icon="🏠" label="Type" value={p.bhk || "-"} />
            <Feature icon="🛁" label="Bath" value={p.attachedBath || "-"} />
            <Feature icon="🔑" label="Available" value={p.flat_status || "-"} />
          </div>
        </div>
      </div>
    </Link>
  );
};

const Stat = ({ label, value }) => (
  <div className="py-3 border-r last:border-r-0">
    <p className="font-semibold text-gray-800">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const Feature = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 p-4 border rounded-xl">
    <span>{icon}</span>
    <div>
      <p className="text-sm font-medium text-gray-700">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
);
