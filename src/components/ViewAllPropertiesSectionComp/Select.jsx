export default function Select({ label, name, opts, filters, handleChange, className = "" }) {
  return (
    <div>
      {label && <label className="block mb-2 text-gray-700">{label}</label>}
      <select
        name={name}
        value={filters[name] || ""}
        onChange={handleChange}
        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      >
        {opts.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
