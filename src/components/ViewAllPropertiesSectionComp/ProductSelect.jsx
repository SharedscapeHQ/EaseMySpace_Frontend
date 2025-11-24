export default function ProductSelect({ name, filters, handleChange, className = "" }) {
  const opts = [
    ["pg", "PGs"],
    ["flatmate", "Flatmate"],
    ["vacant", "Vacant"],
  ];

  return (
    <select
      name={name}
      value={filters[name] || ""}
      onChange={handleChange}
      className={`border px-3 py-2 lg:text-sm text-xs rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    >
      {/* Placeholder */}
      <option value="" disabled hidden={!filters[name]}>
        Products
      </option>

      {opts.map(([val, label]) => (
        <option key={val} value={val}>
          {label}
        </option>
      ))}
    </select>
  );
}
