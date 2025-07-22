import React from "react";

export default function LeadsTable({ leads }) {
  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No leads available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
      <table className="min-w-full text-sm text-gray-800">
        <thead className="bg-indigo-50 text-gray-700 text-sm">
          <tr>
            <th className="px-5 py-3 text-left font-semibold">Phone</th>
            <th className="px-5 py-3 text-left font-semibold">First Seen</th>
            <th className="px-5 py-3 text-left font-semibold">Last Verified</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="even:bg-gray-50 border-b">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
