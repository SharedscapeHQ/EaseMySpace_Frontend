import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { resolveComplaint, getAllComplaints } from "../../api/adminApi";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString();
};

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState({});
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getAllComplaints();
      setComplaints(res?.data?.complaints || []);
    } catch (err) {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    setLoadingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await resolveComplaint(id);

      // safely extract complaint data
      const updatedComplaint =
        res?.complaint || res?.data?.complaint || {};

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                is_resolved: true,
                resolved_by_firstname: updatedComplaint.resolved_by_firstname || "Admin",
                resolved_at: updatedComplaint.resolved_at || new Date().toISOString(),
              }
            : c
        )
      );

      toast.success("Complaint resolved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resolve");
    } finally {
      setLoadingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filter === "pending") return !c.is_resolved;
    if (filter === "resolved") return c.is_resolved;
    return true;
  });

  if (loading) {
    return <div className="text-center py-8">Loading complaints...</div>;
  }

  return (
    <div className="border rounded-xl shadow-md bg-white p-4 overflow-x-auto">

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded text-sm ${
            filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1 rounded text-sm ${
            filter === "pending" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          Pending
        </button>

        <button
          onClick={() => setFilter("resolved")}
          className={`px-3 py-1 rounded text-sm ${
            filter === "resolved" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          Resolved
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-4">All Complaints</h2>

      <table className="min-w-full text-sm text-gray-800 border-collapse">
        <thead className="bg-gray-100 text-gray-700 text-sm border-b">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">User</th>
            <th className="px-4 py-3 text-left font-semibold">Subject</th>
            <th className="px-4 py-3 text-left font-semibold">Complaint</th>
            <th className="px-4 py-3 text-left font-semibold">Created At</th>
            <th className="px-4 py-3 text-left font-semibold">Resolved By</th>
            <th className="px-4 py-3 text-left font-semibold">Resolved At</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredComplaints.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-6 text-gray-500">
                No complaints found.
              </td>
            </tr>
          ) : (
            filteredComplaints.map((c) => (
              <tr
                key={c.id}
                className="border-b even:bg-gray-50 hover:bg-gray-100 transition"
              >
                {/* USER */}
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">
                    {c.raised_firstname} {c.raised_lastname}
                  </div>
                  <div className="text-xs text-gray-600">{c.raised_email}</div>
                  <div className="text-xs text-gray-600">{c.raised_phone}</div>
                </td>

                {/* SUBJECT */}
                <td className="px-4 py-4 font-semibold text-gray-900">
                  {c.subject || "—"}
                </td>

                {/* MESSAGE */}
                <td className="px-4 py-4 max-w-xs break-words text-gray-700">
                  {c.message}
                </td>

                {/* CREATED DATE */}
                <td className="px-4 py-4">{formatDate(c.created_at)}</td>

                {/* RESOLVED BY */}
                <td className="px-4 py-4">
                  {c.is_resolved ? c.resolved_by_firstname : "—"}
                </td>

                {/* RESOLVED AT */}
                <td className="px-4 py-4">
                  {c.is_resolved ? formatDate(c.resolved_at) : "—"}
                </td>

                {/* STATUS */}
                <td className="px-4 py-4">
                  {c.is_resolved ? (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                      Resolved
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-medium">
                      Pending
                    </span>
                  )}
                </td>

                {/* ACTION */}
                <td className="px-4 py-4">
                  {c.is_resolved ? (
                    <span className="text-gray-400 text-sm">—</span>
                  ) : (
                    <button
                      onClick={() => handleResolve(c.id)}
                      disabled={loadingIds[c.id]}
                      className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
                    >
                      {loadingIds[c.id] ? "Resolving..." : "Resolve"}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
