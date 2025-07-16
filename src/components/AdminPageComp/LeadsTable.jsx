import React from "react";

export default function LeadsTable({ leads }) {
  if (!leads || leads.length === 0) {
    return <p>No leads available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm bg-white rounded shadow">
        <thead className="bg-indigo-100">
          <tr>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">Source</th>
            <th className="p-2 text-left">First Seen</th>
            <th className="p-2 text-left">Last Verified</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{lead.phone}</td>
              <td className="p-2">{lead.source || "-"}</td>
              <td className="p-2">
                {lead.first_seen
                  ? new Date(lead.first_seen).toLocaleString()
                  : "-"}
              </td>
              <td className="p-2">
                {lead.last_verified_at
                  ? new Date(lead.last_verified_at).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
