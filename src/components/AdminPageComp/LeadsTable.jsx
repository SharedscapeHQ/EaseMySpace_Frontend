import React, { useState } from "react";
import { markFollowUp } from "../../api/adminApi";
import { clearFollowUp } from "../../api/ownerApi";
import toast from "react-hot-toast";

export default function LeadsTable({ leads }) {
  const [remarks, setRemarks] = useState({});
  const [localLeads, setLocalLeads] = useState(leads);
  const [filter, setFilter] = useState("all");

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role || "";

  const handleRemarkChange = (id, value) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const handleFollowUp = async (leadId) => {
    const remark = remarks[leadId];
    if (!remark) {
      toast.error("Please enter a remark");
      return;
    }

    try {
      const res = await markFollowUp({ leadId, remark });
      if (res.data.success) {
        toast.success("Follow-up marked successfully");
        setLocalLeads((prev) =>
          prev.map((lead) =>
            lead.id === leadId
              ? {
                  ...lead,
                  follow_up_done: true,
                  remark: res.data?.lead?.remark || remark,
                  followed_by: res.data?.lead?.followed_by || user?.firstName || "You",
                }
              : lead
          )
        );
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
        setLocalLeads((prev) =>
          prev.map((lead) =>
            lead.id === leadId
              ? {
                  ...lead,
                  follow_up_done: false,
                  remark: null,
                  followed_by: null,
                }
              : lead
          )
        );
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

  return (
    <div className="overflow-x-auto border rounded-xl shadow-md bg-white">
      <div className="flex items-center justify-end p-4">
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
                <td className="px-5 py-3">{lead.phone}</td>
                <td className="px-5 py-3">
                  {lead.first_seen
                    ? new Date(lead.first_seen).toLocaleString()
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  {lead.last_verified_at
                    ? new Date(lead.last_verified_at).toLocaleString()
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  {lead.follow_up_done ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked
                          disabled
                          className="accent-green-600 w-4 h-4"
                        />
                        <span className="text-green-600 font-medium text-xs">
                          Follow-up done
                        </span>
                      </div>
                      {userRole === "owner" && (
                        <button
                          onClick={() => handleClearFollowUp(lead.id)}
                          className="text-red-600 text-xs hover:underline mt-1 self-start"
                        >
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
                        onChange={(e) =>
                          handleRemarkChange(lead.id, e.target.value)
                        }
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
                <td className="px-5 py-3 whitespace-pre-wrap break-words max-w-sm">
                  {lead.remark || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
