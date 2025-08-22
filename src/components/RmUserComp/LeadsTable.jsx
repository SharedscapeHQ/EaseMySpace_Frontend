import React, { useEffect, useState } from "react";
import { getAllLeads, markFollowUp } from "../../api/adminApi";
import { clearFollowUp } from "../../api/ownerApi";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Constants
const FLAGGED_NUMBERS = ["9136547739", "9867637509", "9586132074"];

// Format date as dd/mm/yyyy hh:mm AM/PM
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
  hours = hours ? hours : 12;
  return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
};

export default function LeadsTable() {
  const [localLeads, setLocalLeads] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role || "";

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await getAllLeads();
        setLocalLeads(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const isFlaggedPhone = (phone) => {
    if (!phone) return false;
    const normalized = phone.replace(/\D/g, "");
    return FLAGGED_NUMBERS.some((num) => normalized.endsWith(num));
  };

  const handleRemarkChange = (id, value) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const updateLead = (id, changes) => {
    setLocalLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...changes } : lead))
    );
  };

  const handleFollowUp = async (leadId) => {
    const remark = remarks[leadId];
    if (!remark) return toast.error("Please enter a remark");

    try {
      const res = await markFollowUp({ leadId, remark });
      if (res.data.success) {
        toast.success("Follow-up marked successfully");
        updateLead(leadId, {
          follow_up_done: true,
          remark: res.data?.lead?.remark || remark,
          followed_by: res.data?.lead?.followed_by || user?.firstName || "You",
        });
        setRemarks((prev) => ({ ...prev, [leadId]: "" }));
      } else {
        toast.error(res.data.message || "Failed to mark follow-up");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while marking follow-up");
    }
  };

  const handleClearFollowUp = async (leadId) => {
    try {
      const res = await clearFollowUp({ leadId });
      if (res.data.success) {
        toast.success("Follow-up cleared");
        updateLead(leadId, {
          follow_up_done: false,
          remark: null,
          followed_by: null,
        });
      } else {
        toast.error(res.data.message || "Failed to clear follow-up");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while clearing follow-up");
    }
  };

  const filteredLeads = localLeads.filter((lead) => {
    if (filter === "all") return true;
    if (filter === "done") return lead.follow_up_done;
    if (filter === "pending") return !lead.follow_up_done;
    return true;
  });

  const exportToExcel = () => {
    if (!localLeads || localLeads.length === 0) {
      toast.error("No leads to export");
      return;
    }

    const data = localLeads.map((lead) => ({
      Phone: lead.phone,
      "First Seen": formatDate(lead.first_seen),
      "Last Verified": formatDate(lead.last_verified_at),
      "Follow-up Done": lead.follow_up_done ? "Yes" : "No",
      "Followed By": lead.followed_by || "",
      Remark: lead.remark || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "leads.xlsx");
  };

  if (loading) return <div className="text-center py-8">Loading leads...</div>;

  return (
    <div className="overflow-x-auto border rounded-xl shadow-md bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <label className="text-sm mr-2 text-gray-700 font-medium">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="done">Follow-up Done</option>
            <option value="pending">Not Followed-up</option>
          </select>
        </div>

        <button
          onClick={exportToExcel}
          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
        >
          <FiDownload size={16} />
          Export
        </button>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No leads found.</div>
      ) : (
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-indigo-50 text-gray-700 text-sm">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Phone</th>
              <th className="px-5 py-3 text-left font-semibold">First Seen</th>
              <th className="px-5 py-3 text-left font-semibold">Last Verified</th>
              <th className="px-5 py-3 text-left font-semibold">Follow-up</th>
              <th className="px-5 py-3 text-left font-semibold">Followed By</th>
              <th className="px-5 py-3 text-left font-semibold">Remark</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="even:bg-gray-50 border-b align-top">
                <td className={`px-5 py-3 ${isFlaggedPhone(lead.phone) ? "text-red-600 font-bold" : ""}`}>
                  {lead.phone}
                </td>
                <td className="px-5 py-3">{formatDate(lead.first_seen)}</td>
                <td className="px-5 py-3">{formatDate(lead.last_verified_at)}</td>
                <td className="px-5 py-3">
                  {lead.follow_up_done ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked disabled className="accent-green-600 w-4 h-4" />
                        <span className="text-green-600 font-medium text-xs">Follow-up done</span>
                      </div>
                      {userRole === "owner" && (
                        <button onClick={() => handleClearFollowUp(lead.id)} className="text-red-600 text-xs hover:underline mt-1 self-start">
                          Clear Follow-up
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <textarea
                        rows="2"
                        className="border rounded-md px-2 py-1 text-xs focus:outline-indigo-500 resize-none"
                        placeholder="Enter remark"
                        value={remarks[lead.id] || ""}
                        onChange={(e) => handleRemarkChange(lead.id, e.target.value)}
                      />
                      <button
                        onClick={() => handleFollowUp(lead.id)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 transition"
                      >
                        Mark Follow-up
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-5 py-3">{lead.followed_by || "—"}</td>
                <td className="px-5 py-3 whitespace-pre-wrap break-words max-w-sm">{lead.remark || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
