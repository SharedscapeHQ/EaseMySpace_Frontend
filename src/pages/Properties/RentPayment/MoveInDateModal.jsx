import React, { useState } from "react";
import { FiCheckCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function MoveInDateModal({ isOpen, onClose, onConfirm, loading }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!isOpen) return null;

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate all dates for current month
  const getMonthDates = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const monthDates = getMonthDates(currentMonth);

  const handleConfirm = () => {
    const finalDate = selectedDate.toISOString().split("T")[0];
    if (onConfirm) onConfirm(finalDate);
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border p-4 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Select Move-in Date
        </h2>

        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-2 text-gray-700 font-medium">
          <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100">
            <FiChevronLeft />
          </button>
          <span>
            {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100">
            <FiChevronRight />
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-gray-500 mb-1">
          {dayNames.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-1">
          {monthDates.map((date, idx) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isPast = date < today;

            return (
              <button
                key={idx}
                disabled={isPast}
                onClick={() => setSelectedDate(new Date(date))}
                className={`py-2 px-1 rounded-lg text-[12px] w-full transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow"
                    : isPast
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-50 hover:bg-indigo-50 text-gray-700"
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 transition"
          >
            <FiCheckCircle className="text-sm" />
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}