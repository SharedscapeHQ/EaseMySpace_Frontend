import React, { useState, useEffect } from "react";
import RentPaymentModal from "./RentPayment/RentPaymentModal";
import { getCurrentUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function EssentialDetailsSub({ property }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedLocking, setSelectedLocking] = useState(null);
  const navigate = useNavigate();

  const [pricingOptions, setPricingOptions] = useState(
    property.pricingOptions?.length
      ? property.pricingOptions
      : [
          {
            id: "0",
            room_label: "Room 1",
            occupancies: [
              {
                occupancy: "N/A",
                price: "0",
                deposit: "0",
                filled_count: 0,
                availability: "available",
                locking_options: [],
              },
            ],
          },
        ]
  );


  // Add room labels and default occupancy
  const roomsWithLabels = pricingOptions.map((room, idx) => ({
    ...room,
    room_label: room.room_label || `Room ${idx + 1}`,
    occupancyOptions:
      room.occupancies?.length > 0
        ? room.occupancies
        : [
            {
              occupancy: "N/A",
              price: "0",
              deposit: "0",
              filled_count: 0,
              availability: "available",
              locking_options: [],
            },
          ],
    occupancy: room.occupancies?.[0]?.occupancy || "N/A",
  }));

  const [selected, setSelected] = useState(roomsWithLabels[0]);

  // Utility to get total capacity based on occupancy type
  const getCapacity = (occupancy) => {
    if (!occupancy) return 1;
    switch (occupancy.toLowerCase()) {
      case "single":
        return 1;
      case "double":
        return 2;
      case "triple":
        return 3;
      default:
        return 1;
    }
  };

  // Current selected occupancy data
  const currentDataRaw =
    selected.occupancyOptions.find((o) => o.occupancy === selected.occupancy) || {
      price: "0",
      deposit: "0",
      filled_count: 0,
      availability: "available",
      locking_options: [],
    };

  const totalCapacity = getCapacity(currentDataRaw.occupancy);

  // If backend says booked, show filled_count = totalCapacity
  const currentData = {
    ...currentDataRaw,
    filled_count:
      currentDataRaw.availability === "booked"
        ? totalCapacity
        : currentDataRaw.filled_count || 0,
  };

  const displayedRent = selectedLocking
    ? Number(currentData.price) - Number(selectedLocking.deduction || 0)
    : Number(currentData.price);

  // Fetch current user
  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data || null);
      } catch {
        setUserData(null);
      }
    })();
  }, []);

  // Payment success handler
  const handlePaymentSuccess = (roomLabel, occupancy) => {
    setPricingOptions((prev) =>
      prev.map((room) =>
        room.room_label === roomLabel
          ? {
              ...room,
              occupancies: room.occupancies.map((o) =>
                o.occupancy === occupancy
                  ? {
                      ...o,
                      filled_count:
                        (o.filled_count || 0) + 1 >= totalCapacity
                          ? totalCapacity
                          : (o.filled_count || 0) + 1,
                      availability:
                        (o.filled_count || 0) + 1 >= totalCapacity
                          ? "booked"
                          : "available",
                    }
                  : o
              ),
            }
          : room
      )
    );

    setSelected((prev) =>
      prev.room_label === roomLabel && prev.occupancy === occupancy
        ? {
            ...prev,
            occupancyOptions: prev.occupancyOptions.map((o) =>
              o.occupancy === occupancy
                ? {
                    ...o,
                    filled_count:
                      (o.filled_count || 0) + 1 >= totalCapacity
                        ? totalCapacity
                        : (o.filled_count || 0) + 1,
                    availability:
                      (o.filled_count || 0) + 1 >= totalCapacity
                        ? "booked"
                        : "available",
                  }
                : o
            ),
          }
        : prev
    );
  };

  const handlePayRentClick = () => {
    if (!userData) {
      setShowLoginPopup(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleLoginRedirect = () => {
    const currentPath = window.location.pathname + window.location.search;
    navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  return (
    <>
      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        {/* Left Section */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
  {/* 🔹 Centered Title */}
  <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center pb-3">
    Property Details
  </h2>

  {/* Details Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {[
      { label: "BHK Type", value: property.bhk_type || "Unavailable" },
      { label: "Location", value: property.location || "Unavailable" },
      { label: "Looking For", value: property.looking_for || "Unavailable" },
      { label: "Gender Preference", value: property.gender || "Unavailable" },
    ].map((item, idx) => (
      <div
        key={idx}
        className="flex flex-col items-center justify-center text-center px-6 py-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow duration-150"
      >
        <span className="text-sm text-gray-500 font-medium capitalize">
          {item.label}
        </span>
        <span className="text-base text-gray-900 font-semibold mt-1 capitalize">
          {item.value}
        </span>
      </div>
    ))}
  </div>
</div>



        {/* Right Section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-start space-y-4 relative">
          {/* Availability Tag */}
          <span
            className={`absolute top-4 right-4 px-2 py-1 rounded-full text-sm font-semibold ${
              currentData.availability === "booked"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {currentData.availability === "booked" ? "Booked" : "Available"}
          </span>

          {/* Filled Count */}
          <div className="absolute top-16 right-4 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            Filled: {currentData.filled_count}/{totalCapacity}
          </div>

          {/* Room selection */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-medium text-gray-700 w-24">Room:</span>
            <div className="flex flex-wrap gap-2">
              {roomsWithLabels.map((room) => (
                <div
                  key={room.id || room.room_label}
                  onClick={() =>
                    setSelected({
                      ...room,
                      occupancy: room.occupancyOptions.find(
                        (o) => o.availability !== "booked"
                      )?.occupancy || room.occupancyOptions[0].occupancy,
                    })
                  }
                  className={`px-3 py-1 rounded-full text-sm font-semibold border cursor-pointer ${
                    selected.room_label === room.room_label
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {room.room_label}
                </div>
              ))}
            </div>
          </div>

          {/* Occupancy selection */}
        {/* Occupancy selection */}
<div className="w-full flex flex-col sm:flex-row sm:items-center gap-2">
  <span className="font-medium text-gray-700 w-24">Occupancy:</span>
  <div className="flex flex-wrap gap-2">
    {selected.occupancyOptions.map((occ) => (
      <div
        key={occ.occupancy}
        onClick={() => setSelected((prev) => ({ ...prev, occupancy: occ.occupancy }))}
        className={`px-3 py-1 rounded-full text-sm font-semibold border cursor-pointer ${
          selected.occupancy === occ.occupancy
            ? "bg-indigo-600 text-white border-indigo-600"
            : occ.availability === "booked"
            ? "bg-gray-100 text-gray-500 border-gray-300"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        {occ.occupancy}
      </div>
    ))}
  </div>
</div>


          {/* Locking Period */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
            <span className="font-medium text-gray-700 w-32">Locking Period:</span>
            <select
              value={selectedLocking?.period || "6"}
              onChange={(e) => {
                const selectedOption =
                  currentData.locking_options.find(
                    (opt) => String(opt.period) === e.target.value
                  ) || { period: e.target.value, deduction: 0 };
                setSelectedLocking(selectedOption);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="6">6 Months</option>
              {currentData.locking_options
                ?.filter((opt) => opt.period && opt.period !== 6)
                .map((opt, idx) => (
                  <option key={idx} value={opt.period}>
                    {opt.period} Months
                  </option>
                ))}
            </select>
          </div>

          {/* Rent and Deposit */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-gray-700 text-sm font-medium">Rent</span>
              <span className="font-bold text-gray-900 text-lg mt-1">
                ₹{displayedRent.toLocaleString()}
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-gray-700 text-sm font-medium">Deposit</span>
              <span className="font-bold text-gray-900 text-lg mt-1">
                ₹{Number(currentData.deposit).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Pay Rent */}
          <button
            onClick={handlePayRentClick}
            disabled={currentData.availability === "booked"}
            className={`mt-4 w-full font-semibold py-2.5 rounded-lg transition ${
              currentData.availability === "booked"
                ? "bg-green-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Pay Rent
          </button>
        </div>
      </div>

      {/* Rent Payment Modal */}
      <RentPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={{ ...property, pricingOptions }}
        selectedLocking={selectedLocking}
        displayedRent={displayedRent}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Login Required
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Please login to continue with rent payment.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleLoginRedirect}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium"
              >
                Login
              </button>
              <button
                onClick={() => setShowLoginPopup(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
