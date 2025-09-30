import { useState } from "react";

export default function EssentialDetails({ property }) {
  // Ensure pricing array exists, fallback to a single object with proper defaults
  const pricingOptions = property.pricing?.length
    ? property.pricing
    : [
        {
          occupancy: property.occupancy || "N/A",
          price: property.price || "N/A",
          deposit: property.deposit || "N/A",
        },
      ];

  const [selected, setSelected] = useState(pricingOptions[0]);

return (
  <div className="mt-6 flex flex-col lg:flex-row gap-6">
    
    {/* Left Container - Property Details */}
   <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {[
      { label: "BHK Type", value: property.bhk_type || "Unavailable" },
      { label: "Location", value: property.location || "Unavailable" },
      { label: "Looking For", value: property.looking_for || "Unavailable" },
      { label: "Gender preference", value: property.gender || "Unavailable" },
    ].map((item, idx) => (
      <div
        key={idx}
        className="flex flex-col items-center justify-center text-center px-4 py-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
      >
        <span className="text-sm lg:text-base text-gray-500 font-medium capitalize">{item.label}</span>
        <span className="text-sm lg:text-base text-gray-900 font-semibold mt-1 capitalize">{item.value}</span>
      </div>
    ))}
  </div>
</div>


    {/* Right Container - Occupancy + Pricing */}
 <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
  
  {/* Occupancy Tabs */}
  <div className="flex flex-col items-center w-full mb-6 sm:flex-wrap sm:justify-center sm:items-center sm:flex-row gap-2 sm:gap-4">
    <p className="text-base sm:text-lg font-medium text-gray-700 mb-2 sm:mb-0">Occupancy</p>
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
      {pricingOptions.map((opt, idx) => (
        <button
          key={idx}
          onClick={() => setSelected(opt)}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold border transition-colors ${
            selected.occupancy === opt.occupancy
              ? "bg-black text-white border-black"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {opt.occupancy}
        </button>
      ))}
    </div>
  </div>

  {/* Rent & Deposit */}
  <div className="flex flex-row justify-center items-center gap-4 w-full">
    {/* Rent Container */}
    <div className="flex-1 bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm text-center">
      <div className="text-sm sm:text-lg text-gray-700 mb-1 sm:mb-2">Rent</div>
      <div className="font-bold text-gray-900 text-lg sm:text-2xl">
        {selected.price !== "N/A" ? `₹${Number(selected.price).toLocaleString()}/mo` : "N/A"}
      </div>
    </div>

    {/* Deposit Container */}
    <div className="flex-1 bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm text-center">
      <div className="text-sm sm:text-lg text-gray-700 mb-1 sm:mb-2">Deposit</div>
      <div className="font-bold text-gray-900 text-lg sm:text-2xl">
        {selected.deposit !== "N/A" ? `₹${Number(selected.deposit).toLocaleString()}` : "N/A"}
      </div>
    </div>
  </div>

</div>



  </div>
);




}
