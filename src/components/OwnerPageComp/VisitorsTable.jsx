import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { FaGlobe, FaMapMarkerAlt, FaClock, FaFilter } from "react-icons/fa";
import * as XLSX from "xlsx";

export default function VisitorsTable() {
  const [visitors, setVisitors] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("all"); // all | allowed | blocked
  const [loading, setLoading] = useState(false);

  const localToday = new Date().toISOString().split("T")[0];

  // Fetch visitors
  useEffect(() => {
    const fetchVisitors = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://api.easemyspace.in/api/track");
        const data = await res.json();
        setVisitors(data || []);
      } catch (err) {
        console.error("❌ Failed to fetch visitors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, []);

  // Apply filters
  const filteredVisitors = visitors.filter((v) => {
    // Date filter
    if (filterDate) {
      const dateOnly = new Date(v.first_seen).toISOString().split("T")[0];
      if (dateOnly !== filterDate) return false;
    }

    // Allowed / Blocked filter
    if (filterType === "allowed" && !v.is_precise) return false;
    if (filterType === "blocked" && v.is_precise) return false;

    return true;
  });

  // Export to Excel
  const exportToExcel = () => {
    // Export without visitor_id
    const exportData = filteredVisitors.map(({ visitor_id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visitors");
    XLSX.writeFile(workbook, "visitors.xlsx");
  };

  return (
    <div className="border rounded-xl shadow-md bg-white w-full">
      {/* Filters + Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-3 flex-wrap">
        {/* Date Filter */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700 font-medium">Date:</label>
          <input
            type="date"
            value={filterDate}
            max={localToday}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm focus:ring-1 focus:ring-indigo-500"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="text-xs text-red-600 underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Allowed/Blocked Filter */}
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Visitors</option>
            <option value="allowed">Allowed (Precise)</option>
            <option value="blocked">Blocked (IP Fallback)</option>
          </select>
        </div>

        {/* Export Button */}
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition"
        >
          <FiDownload size={16} />
          Export
        </button>
      </div>

      {/* Table / Cards */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : filteredVisitors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No visitors found.</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-indigo-50 text-gray-700 text-sm">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">
                    <FaGlobe className="inline mr-1" /> IP
                  </th>
                  <th className="px-5 py-3 text-left font-semibold">
                    <FaMapMarkerAlt className="inline mr-1" /> Location
                  </th>
                  <th className="px-5 py-3 text-left font-semibold">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left font-semibold">
                    <FaClock className="inline mr-1" /> First Seen
                  </th>
                  <th className="px-5 py-3 text-left font-semibold">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((v) => (
                  <tr key={v.id} className="even:bg-gray-50 border-b align-top">
                    <td className="px-5 py-3">{v.ip || "—"}</td>
                    <td className="px-5 py-3">
                      {v.city ? `${v.city}, ` : ""}
                      {v.region ? `${v.region}, ` : ""}
                      {v.country || "—"}
                    </td>
                    <td className="px-5 py-3">
                      {v.is_precise ? (
                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                          Allowed
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                          Blocked
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {v.first_seen
                        ? new Date(v.first_seen).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      {v.last_seen ? new Date(v.last_seen).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid gap-4 p-4">
            {filteredVisitors.map((v) => (
              <div
                key={v.id}
                className="border rounded-lg p-4 shadow-sm bg-gray-50 space-y-2"
              >
                <div className="flex items-center text-sm text-gray-700 gap-2">
                  <FaGlobe className="text-indigo-500" /> {v.ip || "—"}
                </div>
                <div className="flex items-center text-sm text-gray-700 gap-2">
                  <FaMapMarkerAlt className="text-indigo-500" />{" "}
                  {v.city ? `${v.city}, ` : ""}
                  {v.region ? `${v.region}, ` : ""}
                  {v.country || "—"}
                </div>
                <div>
                  {v.is_precise ? (
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      Allowed
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                      Blocked
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-700 gap-2">
                  <FaClock className="text-indigo-500" />{" "}
                  {v.first_seen
                    ? new Date(v.first_seen).toLocaleString()
                    : "—"}
                </div>
                <div className="text-xs text-gray-500">
                  Last Seen:{" "}
                  {v.last_seen ? new Date(v.last_seen).toLocaleString() : "—"}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
