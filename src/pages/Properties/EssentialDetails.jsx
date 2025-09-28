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
    <div className="mt-6 border border-gray-300 p-6 rounded-lg bg-white">
      <h2
        style={{ fontFamily: "heading_font" }}
        className="text-[16px] lg:text-xl text-left text-black mb-4"
      >
        Essential Details
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        {[
          // Occupancy first
          {
            label: "Occupancy",
            value:
              pricingOptions.length > 1 ? (
                <select
                  className=" bg-blue-200  px-2.5 outline-none text-blue-900 rounded py-0.5 text-xs lg:text-base"
                  value={selected.occupancy}
                  onChange={(e) => {
                    const opt = pricingOptions.find(
                      (p) => p.occupancy === e.target.value
                    );
                    setSelected(opt);
                  }}
                >
                  {pricingOptions.map((opt, idx) => (
                    <option key={idx} value={opt.occupancy}>
                      {opt.occupancy || "N/A"}
                    </option>
                  ))}
                </select>
              ) : (
                selected.occupancy || "N/A"
              ),
          },
          { label: "Rent", value: selected.price !== "N/A" ? `₹${selected.price}` : "N/A" },
          { label: "Deposit", value: selected.deposit !== "N/A" ? `₹${selected.deposit}` : "N/A" },
          { label: "Flat Status", value: property.flat_status || "N/A" },
          { label: "BHK Type", value: property.bhk_type || "N/A" },
          { label: "Looking For", value: property.looking_for || "N/A" },
          { label: "Gender", value: property.gender || "N/A" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center text-center px-2 py-3 bg-white rounded-md lg:shadow-none lg:border-l border-b lg:border-b-0"
          >
            <span className="text-xs lg:text-base text-gray-600 font-medium">
              {item.label}
            </span>
            <span className="text-xs lg:text-base text-gray-900 font-semibold">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
