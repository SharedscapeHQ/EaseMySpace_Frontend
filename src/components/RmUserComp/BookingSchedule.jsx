import React, { useEffect, useState } from "react";
import { getAllBookings } from "../../api/rmApi";
import { FaUser, FaHome, FaCalendarAlt, FaClock } from "react-icons/fa";

export default function BookingSchedule() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getAllBookings();

        // Safely extract bookings array
        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.rows)
          ? res.rows
          : [];

        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">
        Booking Schedule
      </h1>
      <p className="text-gray-600 mb-6">
        All users' booking schedules.
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-6 border rounded-lg p-6 shadow-sm bg-white text-center">
          <p className="text-gray-500">📅 No bookings available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-sm bg-white">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Sr no.</th>
                <th className="px-4 py-2 text-left">
                  <div className="flex items-center gap-2">
                    <FaUser /> User
                  </div>
                </th>
                <th className="px-4 py-2 text-left">
                  <div className="flex items-center gap-2">
                    <FaHome /> Property
                  </div>
                </th>
                <th className="px-4 py-2 text-left">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt /> Date
                  </div>
                </th>
                <th className="px-4 py-2 text-left">
                  <div className="flex items-center gap-2">
                    <FaClock /> Time
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
  {bookings.map((booking, index) => {
    // Normalize date & time
    const date = booking.booking_date
      ? new Date(booking.booking_date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

    const time = booking.booking_time
      ? new Date(`1970-01-01T${booking.booking_time}Z`).toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "-";

    return (
      <tr
        key={booking.id || index}
        className="border-b hover:bg-gray-50 transition"
      >
        <td className="px-4 py-2">{index + 1}</td>
        <td className="px-4 py-2">
          {booking.user_name || `User ${booking.user_id}`}
        </td>
        <td className="px-4 py-2">
          {booking.property_name || `Property ${booking.property_id}`}
        </td>
        <td className="px-4 py-2">{date}</td>
        <td className="px-4 py-2">{time}</td>
      </tr>
    );
  })}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
}
