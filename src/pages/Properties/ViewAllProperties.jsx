import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ViewAllProperties() {
  const [properties, setProperties] = useState([]);
  const [filteredProps, setFilteredProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    flatStatus: "",
  });

  // Sort state: "price_asc", "price_desc", "newest"
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/properties/all", {
          withCredentials: true,
        });
        setProperties(data);
        setFilteredProps(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter and sort properties when filters or sort changes
  useEffect(() => {
    let filtered = [...properties];

    // Filter by location (case insensitive substring match)
    if (filters.location.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by flat status (exact match)
    if (filters.flatStatus.trim() !== "") {
      filtered = filtered.filter(
        (p) => p.flat_status && p.flat_status.toLowerCase() === filters.flatStatus.toLowerCase()
      );
    }

    // Filter by price range
    const min = parseInt(filters.minPrice);
    const max = parseInt(filters.maxPrice);
    if (!isNaN(min)) {
      filtered = filtered.filter((p) => p.price >= min);
    }
    if (!isNaN(max)) {
      filtered = filtered.filter((p) => p.price <= max);
    }

    // Sort
    if (sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
      // Assuming newer properties come last in array, reverse for newest first
      filtered.reverse();
    }

    setFilteredProps(filtered);
  }, [filters, sort, properties]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading)
    return (
      <>
        <div className="pt-28 text-center text-sky-600">Loading properties…</div>
      </>
    );
  if (error)
    return (
      <>
        <div className="pt-28 text-center text-red-600">{error}</div>
      </>
    );
  if (properties.length === 0)
    return (
      <>
        <div className="pt-28 text-center">No properties found.</div>
      </>
    );

  return (
    <>

      <div className="pt-28 flex min-h-screen bg-indigo-50">
        {/* Sidebar */}
        <aside
          className="hidden md:flex flex-col fixed top-28 left-0 h-[calc(100vh-7rem)] w-72 bg-white shadow-lg rounded-r-3xl p-6 overflow-y-auto z-20"
          style={{ scrollbarGutter: "stable" }}
        >
          <h2 className="text-2xl font-bold mb-6 text-indigo-700">Filters & Sort</h2>

          {/* Location Filter */}
          <div className="mb-6">
            <label htmlFor="location" className="block mb-2 font-semibold text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g. Mumbai"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Flat Status Filter */}
          <div className="mb-6">
            <label htmlFor="flatStatus" className="block mb-2 font-semibold text-gray-700">
              Flat Status
            </label>
            <select
              id="flatStatus"
              name="flatStatus"
              value={filters.flatStatus}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="under renovation">Under Renovation</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">Price Range (₹)</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-1/2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                min={0}
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-1/2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                min={0}
              />
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label htmlFor="sort" className="block mb-2 font-semibold text-gray-700">
              Sort by
            </label>
            <select
              id="sort"
              name="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-0 md:ml-72 px-6 pb-12 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-indigo-900 mb-3">Explore Our Listings</h1>
          <p className="text-gray-600 mb-8 max-w-xl">
            Find your perfect space among verified properties
          </p>

          {filteredProps.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-20">No properties found with current filters.</p>
          ) : (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProps.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 italic">
                      No Image
                    </div>
                  )}

                  <div className="p-4">
                    <h2
                      className="text-lg font-semibold text-indigo-900 truncate"
                      title={p.title}
                    >
                      {p.title}
                    </h2>
                    <p className="text-indigo-600 font-bold text-lg mt-1">
                      ₹ {p.price.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">{p.location}</p>
                    {p.flat_status && (
                      <p
                        className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          p.flat_status.toLowerCase() === "available"
                            ? "bg-green-100 text-green-700"
                            : p.flat_status.toLowerCase() === "booked"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {p.flat_status}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
