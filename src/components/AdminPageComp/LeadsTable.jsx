import React from "react";

export default function LeadsTable({ leads }) {
  if (!leads || leads.length === 0) {
    return <p>No leads available.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
  <table className="min-w-full text-sm text-gray-700">
    <thead className="bg-indigo-600 text-white">
      <tr>
        <th className="p-3 text-left font-medium">Phone</th>
        <th className="p-3 text-left font-medium">First Seen</th>
        <th className="p-3 text-left font-medium">Last Verified</th>
      </tr>
    </thead>
    <tbody>
      {leads.map((lead) => (
        <tr key={lead.id} className="even:bg-gray-50">
          <td className="p-3">{lead.phone}</td>
          <td className="p-3">
            {lead.first_seen
              ? new Date(lead.first_seen).toLocaleString()
              : "-"}
          </td>
          <td className="p-3">
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
