export default function ProductSelect({ name, filters, handleChange, className = "" }) {
  const opts = [
    ["pg", "PGs"],
    ["flatmate", "Flatmate"],
    ["vacant", "Vacant"],
  ];

  return (
    <div className={`min-w-[140px] ${className}`}>
      <select
        name={name}
        value={filters[name] || ""}
        onChange={handleChange}
        className="w-full border px-3 py-2 lg:text-sm text-xs rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {/* Placeholder inside dropdown */}
        <option value="" disabled hidden={!filters[name]}>
          Products
        </option>

        {/* Dropdown options */}
        {opts.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
