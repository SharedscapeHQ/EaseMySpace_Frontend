import React, { useState, useEffect } from "react";

export default function PricingOptions({ plans, selectedPlan, onSelectPlan, onBookNow }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Whenever a new plan is selected, reset date & time
  useEffect(() => {
    setSelectedDate("");
    setSelectedTime("");
  }, [selectedPlan]);

  const handleBook = () => {
    if (!selectedPlan) {
      alert("Please select a pricing option before booking.");
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time for your booking.");
      return;
    }
    onBookNow({ date: selectedDate, time: selectedTime });
  };

  return (
    <div className="bg-pink-50 dark:bg-zinc-700 p-6 border-t border-pink-100 dark:border-zinc-600">
      <h3 className="text-xl font-semibold text-pink-600 mb-4">Select Service Plan</h3>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.label}
            onClick={() => onSelectPlan(plan)}
            className={`cursor-pointer p-4 rounded-xl text-center shadow-sm border-2 transition-all ${
              selectedPlan?.label === plan.label
                ? "border-pink-500 bg-pink-100 dark:bg-pink-600/30"
                : "border-pink-100 dark:border-zinc-700 bg-white dark:bg-zinc-800"
            }`}
          >
            <p className="text-lg font-semibold text-gray-800 dark:text-white">₹{plan.price}</p>
            <p className="text-sm text-gray-500">{plan.period}</p>
          </div>
        ))}
      </div>

      {/* Date & Time Selection (only if plan is selected) */}
      {selectedPlan && (
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Select Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Book Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleBook}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
