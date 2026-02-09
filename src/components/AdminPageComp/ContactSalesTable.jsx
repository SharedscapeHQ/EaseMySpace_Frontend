import React, { useEffect, useState } from "react";
import { getAllSalesInquiries, updateSalesInquiry } from "../../api/adminApi";
import toast from "react-hot-toast";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString();
};

export default function ContactSalesTable() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState({});
  const [filter, setFilter] = useState("all");
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await getAllSalesInquiries();
      setInquiries(res?.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    if (!remarks[id] || remarks[id].trim() === "") {
      toast.error("Please enter a remark before resolving.");
      return;
    }

    setLoadingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await updateSalesInquiry(id, {
        status: "resolved",
        remark: remarks[id],
      });

      toast.success("Inquiry marked as resolved!");

      const updatedInquiry = res?.inquiry || res?.data?.inquiry || {};

      setInquiries((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status: "resolved",
                remark: remarks[id],
                resolved_by: updatedInquiry.resolved_by || "Admin",
                resolved_at: updatedInquiry.resolved_at || new Date().toISOString(),
              }
            : i
        )
      );

      setRemarks((prev) => ({ ...prev, [id]: "" }));
    } finally {
      setLoadingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredInquiries = inquiries.filter((i) => {
    if (filter === "pending") return i.status !== "resolved";
    if (filter === "resolved") return i.status === "resolved";
    return true;
  });

  if (loading) {
    return <div className="text-center py-8">Loading inquiries...</div>;
  }

  return (
    <div className="border rounded-xl shadow-md bg-white p-4 overflow-x-auto">
      
      {/* Filters */}
      <div className="flex gap-3 mb-4">
        {["all", "pending", "resolved"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded text-sm ${
              filter === type ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <h2 style={{ fontFamily: "para_font" }} className="text-lg font-semibold mb-4">Contact Sales Requests</h2>

      <table className="min-w-full text-sm text-gray-800 border-collapse">
        <thead className="bg-gray-100 text-gray-700 text-sm border-b">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Email</th>
            <th className="px-4 py-3 text-left font-semibold">Phone</th>
            <th className="px-4 py-3 text-left font-semibold">Created At</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Remark</th>
            <th className="px-4 py-3 text-left font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredInquiries.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-500">
                No inquiries found.
              </td>
            </tr>
          ) : (
            filteredInquiries.map((i) => (
              <tr
                key={i.id}
                className="border-b even:bg-gray-50 hover:bg-gray-100 transition"
              >
                <td className="px-4 py-4">{i.name}</td>
                <td className="px-4 py-4">{i.email}</td>
                <td className="px-4 py-4">{i.phone}</td>
                <td className="px-4 py-4">{formatDate(i.created_at)}</td>

                <td className="px-4 py-4">
                  {i.status === "resolved" ? (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                      Resolved
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-medium">
                      Pending
                    </span>
                  )}
                </td>

                <td className="px-4 py-4">
                  {i.status === "resolved" ? (
                    <span className="text-gray-600 text-sm">{i.remark}</span>
                  ) : (
                    <input
                      type="text"
                      placeholder="Add remark..."
                      className="border rounded px-2 py-1 text-xs w-40"
                      value={remarks[i.id] || ""}
                      onChange={(e) =>
                        setRemarks((prev) => ({ ...prev, [i.id]: e.target.value }))
                      }
                    />
                  )}
                </td>

                <td className="px-4 py-4">
                  {i.status !== "resolved" && (
                    <button
                      onClick={() => handleResolve(i.id)}
                      disabled={loadingIds[i.id]}
                      className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded disabled:opacity-50"
                    >
                      {loadingIds[i.id] ? "Updating..." : "Resolve"}
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
