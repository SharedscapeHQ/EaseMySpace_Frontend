import React, { useState } from "react";
import { FiCheckCircle, FiClock, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function BookingCalendar({ onConfirm, loading }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Month being displayed
  const [selectedTime, setSelectedTime] = useState("09:00");

  const times = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  // Generate all dates for the given month
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
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleConfirm = () => {
    const [hours, minutes] = selectedTime.split(":");
    const finalDate = new Date(selectedDate);
    finalDate.setHours(parseInt(hours), parseInt(minutes));
    if (onConfirm) onConfirm(finalDate);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white rounded-xl border p-4 w-full shadow-md">
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Calendar */}
        <div className="flex-1">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-2">
            <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100">
              <FiChevronLeft />
            </button>
            <span className="font-medium text-gray-700">
              {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100">
              <FiChevronRight />
            </button>
          </div>

          {/* Weekday Names */}
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
        </div>

        <div className="hidden lg:block w-px bg-gray-200" />

        {/* Time selection */}
        <div className="lg:w-1/3 w-full flex flex-col items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <FiClock className="text-indigo-600" /> Select Time
          </h2>

          <div className="grid grid-cols-2 gap-2 w-full">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-2 px-2 text-[12px] font-medium rounded-lg w-full transition-all ${
                  selectedTime === time
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-indigo-400"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1 text-xs shadow-sm"
          >
            <FiCheckCircle className="text-sm" />
            {loading ? "Scheduling..." : "Schedule Visit"}
          </button>
        </div>
      </div>
    </div>
  );
}