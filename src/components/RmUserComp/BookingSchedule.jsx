import React, { useEffect, useState } from "react";
import { getAllBookings } from "../../api/rmApi";
import { FaHome, FaCalendarAlt, FaClock } from "react-icons/fa";

export default function BookingSchedule() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getAllBookings();
        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.rows)
          ? res.rows
          : [];
        setBookings(data);
        setFilteredBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!filterDate) {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter((b) => {
        const bookingDate = new Date(b.booking_date).toISOString().split("T")[0];
        return bookingDate === filterDate;
      });
      setFilteredBookings(filtered);
    }
  }, [filterDate, bookings]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">All Bookings</h1>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border px-3 py-1 rounded shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="mt-6 border rounded-lg p-6 shadow-sm bg-white text-center">
          <p className="text-gray-500">📅 No bookings available.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg shadow-sm bg-white">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">User</th>
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
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => {
                  const date = booking.booking_date
                    ? new Date(booking.booking_date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "-";

                  const time = booking.booking_time
                    ? (() => {
                        const [hour, min] = booking.booking_time.split(":");
                        let h = parseInt(hour, 10);
                        const ampm = h >= 12 ? "PM" : "AM";
                        if (h > 12) h -= 12;
                        if (h === 0) h = 12;
                        return `${h}:${min} ${ampm}`;
                      })()
                    : "-";

                  return (
                    <tr
                      key={booking.booking_id || index}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold">
                          {booking.firstName} {booking.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{booking.email}</div>
                        <div className="text-sm text-gray-600">{booking.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{booking.property_title}</div>
                        <div className="text-sm text-gray-600">
                          {booking.property_location}
                        </div>
                      </td>
                      <td className="px-4 py-3">{date}</td>
                      <td className="px-4 py-3">{time}</td>
                      <td className="px-4 py-3">
                        <a
                          href={`/properties/${booking.property_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          View Details
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {filteredBookings.map((booking, index) => {
              const date = booking.booking_date
                ? new Date(booking.booking_date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "-";

              const time = booking.booking_time
                ? (() => {
                    const [hour, min] = booking.booking_time.split(":");
                    let h = parseInt(hour, 10);
                    const ampm = h >= 12 ? "PM" : "AM";
                    if (h > 12) h -= 12;
                    if (h === 0) h = 12;
                    return `${h}:${min} ${ampm}`;
                  })()
                : "-";

              return (
                <div
                  key={booking.booking_id || index}
                  className="border rounded-lg shadow-sm bg-white p-4"
                >
                  <div className="font-semibold text-indigo-700">
                    {booking.firstName} {booking.lastName}
                  </div>
                  <div className="text-sm text-gray-600">{booking.email}</div>
                  <div className="text-sm text-gray-600 mb-2">{booking.phone}</div>

                  <div className="font-medium">{booking.property_title}</div>
                  <div className="text-sm text-gray-600 mb-2">
                    {booking.property_location}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FaCalendarAlt /> {date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FaClock /> {time}
                  </div>

                  <a
                    href={`/properties/${booking.property_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View Details
                  </a>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
