import React, { useEffect, useState } from "react";
import { fetchAllEditQueries, resolveEditQuery } from "../../api/adminApi";

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
          { label: "All", value: "all", color: "blue" },
          { label: "Pending", value: "pending", color: "yellow" },
          { label: "Resolved", value: "resolved", color: "green" },
        ].map(({ label, value, color }) => (
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
                  : value === "all"
                  ? "bg-white text-gray-700 border-gray-300 hover:bg-blue-100 hover:text-blue-700"
                  : value === "pending"
                  ? "bg-white text-gray-700 border-gray-300 hover:bg-yellow-100 hover:text-yellow-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-green-100 hover:text-green-700"
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
       <div className="grid gap-4">
  {filteredQueries.map((query) => (
    <div
      key={query.id}
      className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex-1 min-w-[150px]">
        <strong className="font-medium bg-blue-200 px-2 rounded-lg">User</strong> {query.user_name || query.user_email}
      </div>
      <div className="flex-1 min-w-[300px]">
        <strong className="font-medium bg-blue-200 px-2 rounded-lg">Created</strong> {new Date(query.created_at).toLocaleString()}
      </div>
      <div className="flex-2 min-w-[200px] truncate">
        <strong className="font-medium bg-blue-200 px-2 rounded-lg">Message</strong> {query.message}
      </div>
      <div className="flex-1 min-w-[120px]">{statusBadge(query.resolved)}</div>
      {!query.resolved && (
        <button
          onClick={() => handleResolve(query.id)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          Mark as Resolved
        </button>
      )}
    </div>
  ))}
</div>

      )}
    </div>
  );
}
