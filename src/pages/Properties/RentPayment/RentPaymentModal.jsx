import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import RentPayBtn from "./RentPayBtn";
import { SERVICE_CHARGE, getGst } from "./RentPayHelpers";

export default function RentPaymentModal({
  isOpen,
  onClose,
  property,
  onPaymentSuccess,
  selectedLocking: parentLocking,
  moveInDate,
}) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedOccupancy, setSelectedOccupancy] = useState("");
  const [selectedLocking, setSelectedLocking] = useState(null);
  const [pricing, setPricing] = useState({
    rent: 0,
    deposit: 0,
    availability: "available",
    locking_options: [],
  });
  const [displayedRent, setDisplayedRent] = useState(0);

  const pricingOptions = property?.pricingOptions?.length
    ? property.pricingOptions
    : [
        {
          id: "0",
          room_label: "Room 1",
          occupancies: [
            {
              occupancy: "N/A",
              price: 0,
              deposit: 0,
              availability: "available",
              locking_options: [],
            },
          ],
        },
      ];

  // Initialize defaults
  useEffect(() => {
    if (!property || !property.pricingOptions?.length) return;
    const defaultRoom = property.pricingOptions[0];
    const defaultOcc = defaultRoom.occupancies[0];
    setSelectedRoom(defaultRoom);
    setSelectedOccupancy(defaultOcc?.occupancy || "N/A");
    setSelectedLocking(parentLocking || null);
  }, [property, parentLocking]);

  // Update pricing when room or occupancy changes
  useEffect(() => {
    if (!selectedRoom || !selectedOccupancy) return;
    const found = selectedRoom.occupancies.find(
      (o) => o.occupancy === selectedOccupancy,
    );
    if (found) {
      setPricing({
        rent: Number(found.price) || 0,
        deposit: Number(found.deposit) || 0,
        availability: found.availability || "available",
        locking_options: found.locking_options || [],
      });
    }
  }, [selectedRoom, selectedOccupancy]);

  // Update displayed rent dynamically based on locking
  useEffect(() => {
    const baseRent = pricing.rent || 0;
    const deduction = Number(selectedLocking?.deduction || 0);
    setDisplayedRent(baseRent - deduction > 0 ? baseRent - deduction : 0);
  }, [pricing, selectedLocking]);

  const gst = getGst(SERVICE_CHARGE);
  const totalPayable = displayedRent + pricing.deposit + SERVICE_CHARGE + gst;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
              onClick={onClose}
            >
              <AiOutlineClose size={20} />
            </button>

            {/* Modal Title */}
            <h2
              style={{ fontFamily: "para_font" }}
              className="text-xl  text-gray-900 mb-4 text-center"
            >
              Confirm Rent Payment
            </h2>

            {/* Room Selection */}
            <div className="flex justify-center gap-3 mb-3 flex-wrap">
              {pricingOptions.map((room) => {
                const isBooked = room.occupancies.every(
                  (o) => o.availability === "booked",
                );
                return (
                  <button
                    key={room.id || room.room_label}
                    onClick={() => {
                      setSelectedRoom(room);
                      setSelectedOccupancy(room.occupancies[0].occupancy);
                    }}
                    disabled={isBooked}
                    className={`px-3 py-2 rounded-lg border transition ${
                      isBooked
                        ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                        : selectedRoom?.room_label === room.room_label
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                    }`}
                  >
                    {room.room_label} {isBooked && "(Booked)"}
                  </button>
                );
              })}
            </div>

            {/* Occupancy Selection */}
            {selectedRoom && (
              <div className="flex justify-center gap-3 mb-4 flex-wrap">
                {selectedRoom.occupancies.map((occ) => (
                  <button
                    key={occ.occupancy}
                    onClick={() => setSelectedOccupancy(occ.occupancy)}
                    disabled={occ.availability === "booked"}
                    className={`px-4 py-2 rounded-lg border transition ${
                      occ.availability === "booked"
                        ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                        : selectedOccupancy === occ.occupancy
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                    }`}
                  >
                    {occ.occupancy}{" "}
                    {occ.availability === "booked" && "(Booked)"}
                  </button>
                ))}
              </div>
            )}

            {/* Locking Period */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 mb-4">
              <span className="font-medium text-gray-700">Locking Period:</span>

              {pricing.locking_options?.length > 0 ? (
                <select
                  value={selectedLocking?.period || ""}
                  onChange={(e) => {
                    const selected = pricing.locking_options.find(
                      (opt) => String(opt.period) === e.target.value,
                    );
                    setSelectedLocking(selected || null); // keep null if nothing
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select locking period (optional)</option>
                  {pricing.locking_options.map((opt, idx) => (
                    <option key={idx} value={opt.period}>
                      {opt.period} months
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-gray-400 italic text-sm">Optional</span>
              )}
            </div>

            {/* Summary Section */}
            <div className="mt-3 bg-blue-50 rounded-xl p-4 text-center space-y-1">
              <p className="text-lg  text-gray-800">
                Rent: ₹{displayedRent.toLocaleString()}
              </p>
              <p className="text-md text-gray-700">
                Deposit: ₹{pricing.deposit.toLocaleString()}
              </p>
              <hr className="my-2 border-gray-300" />
              <p className="text-sm text-gray-700">
                Service Fee: ₹{SERVICE_CHARGE.toLocaleString()}{" "}
                <span className="text-xs text-gray-500">(one-time)</span>
              </p>
              <p className="text-sm text-gray-700">
                GST (18%): ₹{gst.toFixed(2)}
              </p>
              <hr className="my-2 border-gray-300" />
              <p className="text-lg  text-gray-900">
                Total Payable: ₹{totalPayable.toLocaleString()}
              </p>
              {selectedLocking?.deduction > 0 && (
                <p className="text-sm text-green-700">
                  You saved ₹{selectedLocking.deduction.toLocaleString()}
                </p>
              )}
            </div>

            {/* 🔹 RentPayBtn */}
            <div className="mt-6 flex justify-center">
              <RentPayBtn
                property={property}
                rentDetails={{
                  rent: displayedRent,
                  deposit: pricing.deposit,
                  room_label: selectedRoom?.room_label,
                  occupancy: selectedOccupancy,
                  locking_period: selectedLocking?.period || null,
                  deduction: selectedLocking?.deduction || 0,
                  move_in_date: moveInDate,
                }}
                onSuccess={() => {
                  onPaymentSuccess?.(
                    selectedRoom?.room_label,
                    selectedOccupancy,
                  );
                  onClose(); 
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
