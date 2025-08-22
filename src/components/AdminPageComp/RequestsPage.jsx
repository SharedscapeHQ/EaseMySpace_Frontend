import React, { useEffect, useState } from "react";
import { getAllRequests } from "../../api/requestApi";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper to format date as dd/mm/yyyy hh:mm AM/PM
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
};

export default function RequestsTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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
      "Created At": formatDate(req.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "requests.xlsx");
  };

  if (loading) return <div className="text-center py-8">Loading requests...</div>;

  return (
    <div className="overflow-x-auto border rounded-xl shadow-md bg-white">
      {/* Export */}
      <div className="flex items-center justify-end p-4">
        <button
          onClick={exportToExcel}
          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
        >
          <FiDownload size={16} />
          Export
        </button>
      </div>

      {/* Table */}
      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No requests found.</div>
      ) : (
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-indigo-50 text-gray-700 text-sm">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Name</th>
              <th className="px-5 py-3 text-left font-semibold">Email</th>
              <th className="px-5 py-3 text-left font-semibold">Phone</th>
              <th className="px-5 py-3 text-left font-semibold">Created At</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="even:bg-gray-50 border-b align-top">
                <td className="px-5 py-3">{req.name || "—"}</td>
                <td className="px-5 py-3">{req.email || "—"}</td>
                <td className="px-5 py-3">{req.phone || "—"}</td>
                <td className="px-5 py-3">{formatDate(req.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
