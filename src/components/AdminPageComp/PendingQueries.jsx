import React, { useEffect, useState } from "react";
import { fetchAllEditQueries, resolveEditQuery } from "../../api/adminApi";
import { Link } from "react-router-dom";

export default function AllQueries() {
  const [queries, setQueries] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await fetchAllEditQueries();
        setQueries(res.data?.queries || []);
      } catch (error) {
        console.error("Failed to fetch edit queries", error);
      }
    };
    fetchQueries();
  }, []);

  const handleResolve = async (id) => {
    try {
      await resolveEditQuery(id);
      setQueries((prev) =>
        prev.map((query) =>
          query.id === id ? { ...query, resolved: true } : query
        )
      );
    } catch (error) {
      alert("Failed to mark as resolved.");
    }
  };

  const filteredQueries =
    filter === "all"
      ? queries
      : queries.filter((q) => q.resolved === (filter === "resolved"));

  const statusBadge = (resolved) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        resolved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {resolved ? "Resolved" : "Pending"}
    </span>
  );

  return (
    <div style={{ fontFamily: "para_font" }} className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { label: "All", value: "all" },
          { label: "Pending", value: "pending" },
          { label: "Resolved", value: "resolved" },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border
              ${
                filter === value
                  ? value === "all"
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : value === "pending"
                    ? "bg-yellow-500 text-white border-yellow-500 shadow"
                    : "bg-green-600 text-white border-green-600 shadow"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-800"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Queries List */}
      {filteredQueries.length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-lg">
          No {filter} queries found.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredQueries.map((query) => (
            <div
              key={query.id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition flex flex-col sm:flex-row justify-between"
            >
              {/* Left Info Section */}
             <div className="flex-1 space-y-3">
  <div>
    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Name</p>
    <p className="text-sm font-medium text-gray-900">
      {query.user_first_name} {query.user_last_name}
    </p>
  </div>
  <div>
    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Submitted On</p>
    <p className="text-sm text-gray-900">
      {new Date(query.created_at).toLocaleString()}
    </p>
  </div>
  <div>
    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Message</p>
    <p className="text-sm text-gray-900 break-words whitespace-normal">
      {query.message}
    </p>
  </div>
</div>


              {/* Right Action Section */}
              <div className="flex flex-col items-start sm:items-end gap-2 mt-4 sm:mt-0">
                {statusBadge(query.resolved)}
                {!query.resolved && (
                  <button
                    onClick={() => handleResolve(query.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                  >
                    Mark as Resolved
                  </button>
                )}
                <Link
                  to={`/properties/${query.property_id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  View Property
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
