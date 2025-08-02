import React, { useEffect, useState } from "react";
import { fetchAllEditQueries, resolveEditQuery } from "../../api/adminApi";

export default function AllQueries() {
  const [queries, setQueries] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await fetchAllEditQueries();
        const fetchedQueries = res.data?.queries || [];

        setQueries(fetchedQueries);
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

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1 rounded ${
            filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("resolved")}
          className={`px-3 py-1 rounded ${
            filter === "resolved" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Resolved
        </button>
      </div>

      {filteredQueries.length === 0 ? (
        <p className="text-gray-500">No {filter} queries found.</p>
      ) : (
        filteredQueries.map((query) => (
          <div
            key={query.id}
            className="bg-white p-4 rounded shadow border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-indigo-700 mb-1">
              {query.property_title}
            </h3>
            <p className="text-sm text-gray-700">
              <strong>User:</strong> {query.user_name || query.user_email}
              <br />
              <strong>Message:</strong> {query.message}
              <br />
              <strong>Status:</strong>{" "}
              {query.resolved ? (
                <span className="text-green-600">Resolved</span>
              ) : (
                <span className="text-yellow-600">Pending</span>
              )}
              <br />
              <strong>Created:</strong>{" "}
              {new Date(query.created_at).toLocaleString()}
            </p>
            {!query.resolved && (
              <button
                className="mt-2 text-sm text-green-600 hover:underline"
                onClick={() => handleResolve(query.id)}
              >
                Mark as Resolved
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
