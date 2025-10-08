import React, { useState } from "react";
import { addWorkerBooking } from "../../../api/Maid_api/maidUserApi";

export default function BookingPopup({ profile, selectedPlan, selectedDate, selectedTime, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleConfirmBooking = async () => {
    console.log("Booking triggered");

    // Validate required fields
    if (!profile?.id || !selectedPlan?.label || !selectedPlan?.price || !selectedDate || !selectedTime) {
      alert("Please select a valid plan, date, and time.");
      console.warn("Booking data missing:", { profile, selectedPlan, selectedDate, selectedTime });
      return;
    }

    // Get user info from localStorage
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user?.id) {
      alert("User not logged in.");
      console.warn("No valid user found in localStorage");
      return;
    }

    const bookingData = {
      worker_id: Number(profile.id),
      booked_by: Number(user.id),
      service_type: selectedPlan.label,
      price: Number(selectedPlan.price),
      booking_date: selectedDate,
      booking_time: selectedTime,
    };

    console.log("Booking data prepared:", bookingData);

    try {
      setLoading(true);
      const response = await addWorkerBooking(bookingData);
      console.log("Booking response:", response);
      alert("Booking successful! 🎉");
      onClose();
    } catch (err) {
      console.error("Error booking worker:", err);
      alert(err.response?.data?.error || "Failed to book worker. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-pink-600 mb-4 text-center">Booking Summary</h2>

        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
          <p><strong>Service Type:</strong> {selectedPlan.label}</p>
          <p><strong>Price:</strong> ₹{selectedPlan.price} ({selectedPlan.period})</p>
          <p><strong>Date:</strong> {selectedDate}</p>
          <p><strong>Time:</strong> {selectedTime}</p>
        </div>

        <button
          onClick={handleConfirmBooking}
          disabled={loading}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 mt-6 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
        >
          {loading ? "Booking..." : "Confirm & Pay"}
        </button>
      </div>
    </div>
  );
}
