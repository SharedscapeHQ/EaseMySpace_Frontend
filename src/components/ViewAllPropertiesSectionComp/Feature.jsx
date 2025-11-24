import React from "react";

export default function Feature({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg">
      <span>{icon}</span>
      <div>
        <p className="text-sm font-medium text-gray-700">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}
