import React, { useEffect, useState } from "react";
import { getAllRequests, markFollowUp, clearFollowUp } from "../../api/requestApi";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

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
    <div className="overflow-x-auto border rounded-xl shadow-md bg-white">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4">
        {/* Date Filter */}
        <input
          type="date"
          value={filterDate}
          max={localToday}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded-lg px-3 py-1 text-sm"
        />

        <button
          onClick={exportToExcel}
          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
        >
          <FiDownload size={16} />
          Export
        </button>
      </div>

      {/* Table */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No requests found.</div>
      ) : (
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-indigo-50 text-gray-700 text-sm">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Name</th>
              <th className="px-5 py-3 text-left font-semibold">Contact</th>
              <th className="px-5 py-3 text-left font-semibold">Date & Time</th>
              <th className="px-5 py-3 text-left font-semibold">Follow-up</th>
              <th className="px-5 py-3 text-left font-semibold">Followed By</th>
              <th className="px-5 py-3 text-left font-semibold">Remark</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id} className="even:bg-gray-50 border-b align-top">
                {/* Name */}
                <td className="px-5 py-3">{req.name || "—"}</td>

                {/* Contact */}
                <td className="px-5 py-3 flex flex-col gap-1">
                  <span>{req.email || "—"}</span>
                  <span>{req.phone || "—"}</span>
                </td>

                {/* Date & Time */}
                <td className="px-5 py-3">{formatDate(req.created_at)}</td>

                {/* Follow-up */}
                <td className="px-5 py-3">
                  {req.follow_up_done ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked
                          disabled
                          className="accent-green-600 w-4 h-4"
                        />
                        <span className="text-green-600 font-medium text-xs">
                          Done
                        </span>
                      </div>
                      
                        <button
                          onClick={() => handleClearFollowUp(req.id)}
                          disabled={loadingIds[req.id]}
                          className="text-red-600 text-xs hover:underline mt-1 self-start disabled:opacity-50"
                        >
                          Clear
                        </button>
                    
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {(role === "admin" ||
                        role === "RM" ||
                        role === "owner") && (
                        <>
                          <textarea
                            rows="2"
                            className="border rounded-md px-2 py-1 text-xs focus:outline-indigo-500 resize-none"
                            placeholder="Enter remark"
                            value={remarks[req.id] || ""}
                            onChange={(e) =>
                              handleRemarkChange(req.id, e.target.value)
                            }
                          />
                          <button
                            onClick={() => handleMarkFollowUp(req.id)}
                            disabled={loadingIds[req.id]}
                            className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 transition disabled:opacity-50"
                          >
                            Mark
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </td>

                {/* Followed By */}
                <td className="px-5 py-3 text-xs text-gray-600">
                  {req.followed_by || "—"}
                </td>

                {/* Remark */}
                <td className="px-5 py-3 whitespace-pre-wrap break-words max-w-sm">
                  {req.remark || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
