import React, { useEffect, useState } from "react";
import { getAllAdminQueries, resolveAdminQuery } from "../../../api/Maid_api/maidAdminApi";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch queries
  const fetchQueries = async () => {
    try {
      setLoading(true);
      const data = await getAllAdminQueries();
      setQueries(data);
    } catch (err) {
      console.error("❌ Failed to fetch queries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  // Handle resolve query
  const handleResolve = async (id) => {
    try {
      await resolveAdminQuery(id); // no remark now
      fetchQueries(); // refresh list
    } catch (err) {
      console.error("❌ Failed to resolve query:", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 style={{ fontFamily: "para_font" }} className="text-2xl  text-pink-600">Admin Queries</h2>

      {loading ? (
        <p className="text-gray-500">Loading queries...</p>
      ) : queries.length === 0 ? (
        <p className="text-gray-500">No queries available.</p>
      ) : (
        <div className="space-y-4">
          {queries.map((query) => (
            <div
              key={query.id}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition flex flex-col sm:flex-row justify-between"
            >
              {/* Left section: user info + query */}
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  Name: {query.user_name}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  Email: {query.user_email}
                </p>
                <p className="text-xs text-gray-500">
                  Submitted: {new Date(query.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-900 break-words">
                  Message: {query.query_text}
                </p>

                {query.status === "resolved" && (
                  <>
                    <p className="text-xs text-green-600">✅ Resolved</p>
                    {query.resolved_by_name && (
                      <p className="text-xs text-gray-600">
                        Resolved by: <span className="font-medium">{query.resolved_by_name}</span>
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Right section: actions */}
              <div className="flex flex-col items-start sm:items-end gap-2 mt-4 sm:mt-0">
                {query.status === "resolved" ? (
                  <span className="px-2 py-1 rounded text-white text-sm bg-green-600">
                    RESOLVED
                  </span>
                ) : (
                  <button
                    onClick={() => handleResolve(query.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
