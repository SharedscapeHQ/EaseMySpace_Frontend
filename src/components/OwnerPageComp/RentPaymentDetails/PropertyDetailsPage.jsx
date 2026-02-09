import { FiMapPin } from "react-icons/fi";
import { MdOutlineBedroomParent } from "react-icons/md";

export default function PropertyDetailsPage({
  payments,
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  onSelectProperty,
}) {
  const filtered = payments.filter((item) => {
    const title = item.property?.title?.toLowerCase() || "";
    const location = item.property?.location || "";
    const matchesSearch = title.includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "all" || location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 style={{ fontFamily: "para_font" }} className="text-3xl font-bold text-indigo-700 mb-6 text-center">Properties</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search by property title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[250px] border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
        />

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 shadow-sm"
        >
          {["all", ...new Set(payments.map((p) => p.property?.location).filter(Boolean))].map(
            (loc, i) => (
              <option key={i} value={loc}>
                {loc === "all" ? "All Locations" : loc}
              </option>
            )
          )}
        </select>
      </div>

      {/* Properties Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 text-lg">No properties found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden border border-gray-100 hover:border-indigo-300"
              onClick={() => onSelectProperty?.(item)}
            >
              {/* Image */}
              <div className="h-48 w-full bg-gray-100 flex items-center justify-center relative group">
                {item.property?.image ? (
                  <img
                    src={item.property.image}
                    alt={item.property.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-semibold text-indigo-700">{item.property?.title || "-"}</h3>

                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <FiMapPin className="text-indigo-500" />
                  {item.property?.location || "-"}
                </div>

                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <MdOutlineBedroomParent className="text-indigo-500" />
                  {item.property?.bhk_type || "-"}
                </div>

                <div className="text-gray-500 text-sm">
                  <span className="font-medium">Occupancy:</span> {item.property?.occupancy || "-"}
                </div>

                {/* Button / Call to Action */}
                <button
                  className="w-full mt-2 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                  onClick={() => onSelectProperty?.(item)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
