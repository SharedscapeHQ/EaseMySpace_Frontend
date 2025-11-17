import { useState, useEffect } from "react";

export default function EssentialDetails({ property }) {
  const pricingOptions = property.pricingOptions?.length
    ? property.pricingOptions
    : [
        {
          id: "0",
          room_label: "Room 1",
          occupancies: [{ occupancy: "N/A", price: "N/A", deposit: "N/A" }],
        },
      ];

  // Map rooms to include occupancyOptions and default selected occupancy
  const roomsWithLabels = pricingOptions.map((room, idx) => ({
    ...room,
    room_label: room.room_label || `Room ${idx + 1}`,
    occupancyOptions: room.occupancies?.map((o) => o.occupancy) || ["N/A"],
    occupancy: room.occupancies?.[0]?.occupancy || "N/A",
  }));

  const [selected, setSelected] = useState(roomsWithLabels[0]);

  // Get price/deposit for selected occupancy
  const currentData = selected.occupancies.find(
    (o) => o.occupancy === selected.occupancy
  ) || { price: "N/A", deposit: "N/A" };

  useEffect(() => {
  }, [roomsWithLabels]);

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
              <span className="text-sm lg:text-base text-gray-500 font-medium capitalize">
                {item.label}
              </span>
              <span className="text-sm lg:text-base text-gray-900 font-semibold mt-1 capitalize">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Container - Room + Occupancy + Rent/Deposit */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-start space-y-4">
        {/* Room Selection */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="font-medium text-gray-700 w-24">Room:</span>
          <div className="flex flex-wrap gap-2">
            {roomsWithLabels.map((room) => (
              <button
                key={room.id || room.room_label}
                onClick={() =>
                  setSelected({ ...room, occupancy: room.occupancies[0].occupancy })
                }
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-semibold border transition-colors ${
                  selected.room_label === room.room_label
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {room.room_label}
              </button>
            ))}
          </div>
        </div>

        {/* Occupancy Selection */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="font-medium text-gray-700 w-24">Occupancy:</span>
          <div className="flex flex-wrap gap-2">
            {selected.occupancyOptions.map((occ) => (
              <button
                key={occ}
                onClick={() => setSelected((prev) => ({ ...prev, occupancy: occ }))}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-semibold border transition-colors ${
                  selected.occupancy === occ
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {occ.charAt(0).toUpperCase() + occ.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Rent & Deposit */}
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-2">
          <div className="flex-1 flex flex-col items-center bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-gray-700 text-sm font-medium">Rent</span>
            <span className="font-bold text-gray-900 text-lg mt-1">
              {currentData.price ? `₹${Number(currentData.price).toLocaleString()}/mo` : "N/A"}
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-gray-700 text-sm font-medium">Deposit</span>
            <span className="font-bold text-gray-900 text-lg mt-1">
              {currentData.deposit ? `₹${Number(currentData.deposit).toLocaleString()}` : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}