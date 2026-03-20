import React, { useState, useEffect } from "react";
import RentPaymentModal from "./RentPayment/RentPaymentModal";
import { getCurrentUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import OwnerVerifiedCard from "./OwnerVerifiedCard";
import PropertyDetailsBox from "./PropertyDetailsBox";

  const occupancyOrder = {
  single: 1,
  double: 2,
  triple: 3
};

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

  const [selected, setSelected] = useState(() => {
  const firstRoom = roomsWithLabels[0];

  const sorted = [...firstRoom.occupancyOptions].sort(
    (a, b) =>
      (occupancyOrder[a.occupancy?.toLowerCase()] || 99) -
      (occupancyOrder[b.occupancy?.toLowerCase()] || 99)
  );

  const firstAvailable =
    sorted.find((o) => o.availability !== "booked") || sorted[0];

  return {
    ...firstRoom,
    occupancy: firstAvailable.occupancy,
  };
});

 const getCapacity = (occupancy) => {
  if (!occupancy) return 1;

  const occ = occupancy.toLowerCase();

  if (occ.includes("single") || occ === "1") return 1;
  if (occ.includes("double") || occ === "2") return 2;
  if (occ.includes("triple") || occ === "3") return 3;

  return 1;
};

  const currentDataRaw =
    selected.occupancyOptions.find((o) => o.occupancy === selected.occupancy) || {
      price: "0",
      deposit: "0",
      filled_count: 0,
      availability: "available",
      locking_options: [],
    };
    

  const totalCapacity = getCapacity(currentDataRaw.occupancy);

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

  const handleBookNowClick = () => {
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




const sortedOccupancies = [...selected.occupancyOptions].sort(
  (a, b) =>
    (occupancyOrder[a.occupancy?.toLowerCase()] || 99) -
    (occupancyOrder[b.occupancy?.toLowerCase()] || 99)
);


  return (
    <>
<div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

  <div className="flex-1">
    <OwnerVerifiedCard propertyId={property.id} />
  </div>

  <div className="flex-1">
    <PropertyDetailsBox property={property} />
  </div>

  {/* Booking Section */}
<div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col h-full">

  {/* TOP STATUS ROW */}
  <div className="flex items-center justify-between">

    <span
      className={`px-2 py-1 rounded-full text-sm ${
        currentData.availability === "booked"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-green-100 text-green-800"
      }`}
    >
      {currentData.availability === "booked" ? "Booked" : "Available"}
    </span>

    <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
      Filled: {currentData.filled_count}/{totalCapacity}
    </span>

  </div>

  {/* Room Selection */}
  <div className="w-full flex mt-5 flex-col sm:flex-row sm:items-center gap-2">
    <span className="font-medium text-gray-700 text-xs">Room:</span>
    <div className="flex flex-wrap gap-2">
      {roomsWithLabels.map((room) => (
        <div
          key={room.id || room.room_label}
          onClick={() =>
            setSelected({
              ...room,
              occupancy:
               [...room.occupancyOptions]
  .sort((a,b)=>
    (occupancyOrder[a.occupancy?.toLowerCase()]||99) -
    (occupancyOrder[b.occupancy?.toLowerCase()]||99)
  )
  .find((o)=>o.availability !== "booked")
                  ?.occupancy || room.occupancyOptions[0].occupancy,
            })
          }
          className={`px-3 py-1 rounded-full  text-sm border cursor-pointer ${
            selected.room_label === room.room_label
              ? "bg-black text-white border-black text-xs"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {room.room_label}
        </div>
      ))}
    </div>
  </div>

  {/* Occupancy Selection */}
  <div className="w-full flex flex-col sm:flex-row my-3 sm:items-center gap-2">
    <span className="font-medium text-gray-700 text-xs ">Occupancy:</span>
    <div className="flex flex-wrap gap-2">
    {sortedOccupancies.map((occ) => (
        <div
          key={occ.occupancy}
          onClick={() => setSelected((prev) => ({ ...prev, occupancy: occ.occupancy }))}
          className={`px-3 py-1 rounded-full text-sm border cursor-pointer ${
            selected.occupancy === occ.occupancy
              ? "bg-indigo-600 text-white border-indigo-600"
              : occ.availability === "booked"
              ? "bg-gray-100 text-gray-500 border-gray-300 text-xs"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 text-xs"
          }`}
        >
          {occ.occupancy}
        </div>
      ))}
    </div>
  </div>

  {/* Locking Period */}
  <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3 my-2">
    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
      Locking Period :
    </span>

    {currentData.locking_options?.length > 0 ? (
      <select
        value={selectedLocking?.period || ""}
        onChange={(e) => {
          const selected = currentData.locking_options.find(
            (opt) => opt.period === e.target.value
          );
          setSelectedLocking(selected);
        }}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2664eb]"
      >
        {currentData.locking_options.map((opt) => (
          <option key={opt.period} value={opt.period}>
            {opt.period} Months
          </option>
        ))}
      </select>
    ) : (
      <span className="text-sm text-gray-400 italic">Optional</span>
    )}
  </div>

  {/* Rent & Deposit Summary */}
  <div className="w-full flex flex-col sm:flex-row gap-3">
    <div className="flex-1 flex flex-col items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
      <span className="text-gray-700 text-sm font-medium">Rent</span>
      <span className="text-gray-900 text-lg mt-1">
        ₹{displayedRent.toLocaleString()}
      </span>
    </div>

    <div className="flex-1 flex flex-col items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
      <span className="text-gray-700 text-sm font-medium">Deposit</span>
      <span className="text-gray-900 text-lg mt-1">
        ₹{Number(currentData.deposit).toLocaleString()}
      </span>
    </div>
  </div>

  {/* Book Now Button */}
  <button
  onClick={handleBookNowClick}
  disabled={currentData.availability === "booked"}
  className={`lg:mt-auto mt-5 py-2 rounded-lg transition ${
    currentData.availability === "booked"
      ? "bg-green-400 text-white cursor-not-allowed"
      : "bg-green-600 text-white hover:bg-green-700"
  }`}
>
  Book Now
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
            <h2 style={{ fontFamily: "para_font" }} className="text-lg  text-gray-800 mb-4 text-center">Login Required</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">Please login to continue with booking.</p>
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
