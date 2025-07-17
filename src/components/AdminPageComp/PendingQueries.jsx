import React from "react";

export default function PendingQueries({ queries }) {
  if (!queries.length) {
    return <p className="text-gray-500 mt-4">No pending queries.</p>;
  }

  return (
    <div className="space-y-4">
      {queries.map((query) => (
        <div
          key={query.id}
          className="bg-white p-4 rounded shadow border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-indigo-700 mb-1">
            {query.property_title || "Unknown Property"}
          </h3>
          <p className="text-sm text-gray-700">
            <strong>User:</strong> {query.user_name || query.user_email}<br />
            <strong>Message:</strong> {query.message}<br />
            <strong>Created:</strong>{" "}
            {new Date(query.created_at).toLocaleString()}
          </p>
          <button
            className="mt-2 text-sm text-green-600 hover:underline"
            onClick={() => alert("Mark as resolved functionality pending")}
          > 
            Mark as Resolved
          </button>
        </div>
      ))}
    </div>
  );
}
