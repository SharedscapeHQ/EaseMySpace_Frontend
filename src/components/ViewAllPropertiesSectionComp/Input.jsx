import React from "react";

export default function Input({ label, name, filters, handleChange, ...rest }) {
  return (
    <div>
      {label && <label className="block mb-2 text-gray-700 text-sm">{label}</label>}
      <input
        name={name}
        value={filters[name]}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 text-sm"
        {...rest}
      />
    </div>
  );
}
