import React, { useEffect, useState } from "react";
import { getAllRequests, markFollowUp, clearFollowUp } from "../../api/requestApi";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { FaCalendarAlt } from "react-icons/fa";

// Helper: format date
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleString();
};

export default function RequestsTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState({});
  const [loadingIds, setLoadingIds] = useState({});
  const [filterDate, setFilterDate] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // ✅ Local today (not UTC)
  const today = new Date();
  const localToday = today.toLocaleDateString("en-CA");

  useEffect(() => {
    async function fetchRequests() {
      try {
        const data = await getAllRequests();
        setRequests(data.requests || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  // ─── Export to Excel ───
  const exportToExcel = () => {
    if (!requests || requests.length === 0) {
      toast.error("No requests to export");
      return;
    }

    const data = requests.map((req) => ({
      Name: req.name || "",
      Email: req.email || "",
      Phone: req.phone || "",
      "Created At": formatDate(req.created_at),
      "Follow-up Done": req.follow_up_done ? "Yes" : "No",
      "Followed By": req.followed_by || "—",
      Remark: req.remark || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "requests.xlsx");
  };

  // ─── Mark Follow-up ───
  const handleMarkFollowUp = async (requestId) => {
    const remark = remarks[requestId];
    if (!remark) return toast.error("Please enter a remark");

    setLoadingIds((prev) => ({ ...prev, [requestId]: true }));
    try {
      const res = await markFollowUp({ requestId, remark });
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, ...res.request } : r))
      );
      setRemarks((prev) => ({ ...prev, [requestId]: "" }));
      toast.success(res.message || "Follow-up marked");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark follow-up");
    } finally {
      setLoadingIds((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  // ─── Clear Follow-up ───
  const handleClearFollowUp = async (requestId) => {
    setLoadingIds((prev) => ({ ...prev, [requestId]: true }));
    try {
      const res = await clearFollowUp(requestId);
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, ...res.request } : r))
      );
      toast.success(res.message || "Follow-up cleared");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clear follow-up");
    } finally {
      setLoadingIds((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleRemarkChange = (id, value) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Filter by exact date
  const filteredRequests = requests.filter((req) => {
    if (!filterDate) return true;
    const reqDate = new Date(req.created_at).setHours(0, 0, 0, 0);
    const selectedDate = new Date(filterDate).setHours(0, 0, 0, 0);
    return reqDate === selectedDate;
  });

  if (loading) return <div className="text-center py-8">Loading requests...</div>;

  return (
    <div className="border rounded-xl shadow-md bg-white">
      {/* Header Bar - Filter & Export */}
      <div className="flex items-center justify-between gap-3 p-4">
  <div className="flex flex-col w-full sm:w-auto">
  <label className="text-xs font-medium text-gray-600">Date Filter</label>
  <div className="relative">
    <FaCalendarAlt className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
    <input
      type={filterDate ? "date" : "text"}
      placeholder="mm/dd/yyyy"
      value={filterDate}
      max={localToday}
      onFocus={(e) => (e.target.type = "date")}
      onBlur={(e) => {
        if (!filterDate) e.target.type = "text";
      }}
      onChange={(e) => setFilterDate(e.target.value)}
      className="w-full pl-8 border border-gray-300 rounded px-2 py-1 text-gray-700 text-xs focus:ring-2 focus:ring-indigo-400"
    />
  </div>
</div>


  <button
    onClick={exportToExcel}
    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
  >
    <FiDownload size={16} />
    Export
  </button>
</div>


      {/* Mobile Cards */}
      <div className="block sm:hidden divide-y">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No requests found.</div>
        ) : (
          filteredRequests.map((req) => (
            <div key={req.id} className="p-4">
              <p className="">{req.name || "—"}</p>
              <p className="text-sm text-gray-600">{req.email || "—"}</p>
              <p className="text-sm text-gray-600">{req.phone || "—"}</p>
              <p className="text-xs mt-1">{formatDate(req.created_at)}</p>

              <div className="mt-2">
                {req.follow_up_done ? (
                  <div>
                    <span className="text-green-600 text-xs">✔ Follow-up done</span>
                    <button
                      onClick={() => handleClearFollowUp(req.id)}
                      disabled={loadingIds[req.id]}
                      className="ml-3 text-red-600 text-xs hover:underline disabled:opacity-50"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  (role === "admin" || role === "RM" || role === "owner") && (
                    <div className="mt-2 flex flex-col gap-2">
                      <textarea
                        rows="2"
                        className="border rounded-md px-2 py-1 text-xs focus:outline-indigo-500 resize-none"
                        placeholder="Enter remark"
                        value={remarks[req.id] || ""}
                        onChange={(e) => handleRemarkChange(req.id, e.target.value)}
                      />
                      <button
                        onClick={() => handleMarkFollowUp(req.id)}
                        disabled={loadingIds[req.id]}
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        Mark Follow-up
                      </button>
                    </div>
                  )
                )}
              </div>

              <p className="text-xs text-gray-600 mt-2">
                Followed By: {req.followed_by || "—"}
              </p>
              <p className="text-xs text-gray-700 mt-1 break-words">
                Remark: {req.remark || "—"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-indigo-50 text-gray-700 text-sm">
            <tr>
              <th className="px-5 py-3 text-left ">Name</th>
              <th className="px-5 py-3 text-left ">Contact</th>
              <th className="px-5 py-3 text-left ">Date & Time</th>
              <th className="px-5 py-3 text-left ">Follow-up</th>
              <th className="px-5 py-3 text-left ">Followed By</th>
              <th className="px-5 py-3 text-left ">Remark</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id} className="even:bg-gray-50 border-b align-top">
                <td className="px-5 py-3">{req.name || "—"}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-col gap-1">
                    <span>{req.email || "—"}</span>
                    <span>{req.phone || "—"}</span>
                  </div>
                </td>
                <td className="px-5 py-3">{formatDate(req.created_at)}</td>
                <td className="px-5 py-3">
                  {req.follow_up_done ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-green-600 text-xs">✔ Done</span>
                      <button
                        onClick={() => handleClearFollowUp(req.id)}
                        disabled={loadingIds[req.id]}
                        className="text-red-600 text-xs hover:underline mt-1 disabled:opacity-50"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    (role === "admin" || role === "RM" || role === "owner") && (
                      <div className="flex flex-col gap-1">
                        <textarea
                          rows="2"
                          className="border rounded-md px-2 py-1 text-xs focus:outline-indigo-500 resize-none"
                          placeholder="Enter remark"
                          value={remarks[req.id] || ""}
                          onChange={(e) => handleRemarkChange(req.id, e.target.value)}
                        />
                        <button
                          onClick={() => handleMarkFollowUp(req.id)}
                          disabled={loadingIds[req.id]}
                          className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                          Mark Follow-up
                        </button>
                      </div>
                    )
                  )}
                </td>
                <td className="px-5 py-3 text-xs text-gray-600">
                  {req.followed_by || "—"}
                </td>
                <td className="px-5 py-3 whitespace-pre-wrap break-words max-w-sm">
                  {req.remark || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
