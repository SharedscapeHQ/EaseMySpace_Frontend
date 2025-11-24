import React from "react";

export default function Stat({ label, value }) {
  return (
    <div className="py-2 border-r last:border-r-0">
      <p className="text-gray-800">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
