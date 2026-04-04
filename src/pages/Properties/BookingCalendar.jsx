import React, { useState } from "react";
import { FiCheckCircle, FiClock, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function BookingCalendar({ onConfirm, loading, disabledBookings = [] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [showModal, setShowModal] = useState(false); // ✅ NEW

const generateTimeSlots = () => {
  const slots = [];
  const startHour = 9;   // 9 AM
  const endHour = 21;    // 9 PM

  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
    slots.push(`${String(hour).padStart(2, "0")}:30`);
  }

  return slots;
};

const times = generateTimeSlots();

  // ✅ Split times
  const visibleTimes = times.slice(0, 6);
  const remainingTimes = times.slice(6);

  const getMonthDates = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const dates = [];
    for (let d = start.getTime(); d <= end.getTime(); d += 24 * 60 * 60 * 1000) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const monthDates = getMonthDates(currentMonth);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalizedBookings = disabledBookings.map((b) => {
    const d = new Date(b.booking_date);
    d.setHours(0, 0, 0, 0);
    return { ...b, bookingDateObj: d };
  });

  const getBookingForDate = (date) => {
    return normalizedBookings.find(
      (b) => b.bookingDateObj.getTime() === date.getTime()
    );
  };

  const handleConfirm = () => {
    const [hours, minutes] = selectedTime.split(":");
    const finalDate = new Date(selectedDate);
    finalDate.setHours(parseInt(hours), parseInt(minutes));

    const blockedBooking = getBookingForDate(selectedDate);
    if (blockedBooking && blockedBooking.booking_time === selectedTime) {
      alert(
        `You already have a booking on ${blockedBooking.booking_date} at ${blockedBooking.booking_time}`
      );
      return;
    }

    if (onConfirm) onConfirm(finalDate);
  };

  const prevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const nextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const now = new Date();

const isToday =
  selectedDate.toDateString() === now.toDateString();

const isPastTime = (time) => {
  if (!isToday) return false;

  const [h, m] = time.split(":").map(Number);
  const slotTime = new Date(selectedDate);
  slotTime.setHours(h, m, 0, 0);

  const minAllowed = new Date(now.getTime() + 30 * 60000);
return slotTime < minAllowed;
};



  // ✅ Reusable button (no duplicate logic)
  const renderTimeButton = (time) => {
    const blockedBooking = getBookingForDate(selectedDate);
    const disabledTime =
  (blockedBooking && blockedBooking.booking_time === time) ||
  isPastTime(time);

    return (
      <button
        key={time}
        onClick={() => {
          setSelectedTime(time);
          setShowModal(false); // close if from modal
        }}
        disabled={disabledTime}
        className={`py-2 px-2 text-[12px] font-medium rounded-lg w-full transition-all ${
          selectedTime === time
            ? "bg-indigo-600 text-white shadow-sm"
            : disabledTime
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-indigo-400"
        }`}
        title={disabledTime ? "Already booked" : ""}
      >
        {time}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl border p-4 w-full lg:h-full shadow-md">
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Calendar */}
        <div className="flex-1">
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

          <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-gray-500 mb-1">
            {dayNames.map((d) => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: monthDates[0].getDay() }).map((_, i) => (
              <div key={`spacer-${i}`} className="py-2" />
            ))}

            {monthDates.map((date, idx) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isPast = date < today;
              const isSunday = date.getDay() === 0;
              const blockedBooking = getBookingForDate(date);

              return (
                <button
                  key={idx}
                  disabled={isPast || isSunday || blockedBooking}
                  onClick={() => setSelectedDate(new Date(date))}
                  className={`py-2 px-1 rounded-lg text-[12px] w-full ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : isPast || isSunday || blockedBooking
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-50 hover:bg-indigo-50"
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
            {visibleTimes.map(renderTimeButton)}

            {remainingTimes.length > 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="col-span-2 py-2 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50"
              >
                Show More
              </button>
            )}
          </div>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="mt-2 w-full bg-indigo-600 text-white py-2 px-3 rounded-xl flex items-center justify-center gap-1 text-xs"
          >
            <FiCheckCircle />
            {loading ? "Scheduling..." : "Schedule Visit"}
          </button>
        </div>
      </div>

      {/* ✅ MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-[90%] max-w-md max-h-[70vh] overflow-y-auto">
            <h3 className="text-sm font-semibold mb-3">More Time Slots</h3>

            <div className="grid grid-cols-2 gap-2">
              {remainingTimes.map(renderTimeButton)}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full py-2 text-xs border rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}