import React, { useEffect, useState } from "react";
import { getAllBookings } from "../../api/rmApi";
import { FaHome, FaCalendarAlt, FaClock, FaPhone, FaPhoneAlt } from "react-icons/fa";

export default function BookingSchedule() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | upcoming | past

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
  let filtered = bookings;

  // 📅 Date filter
  if (filterDate) {
    filtered = filtered.filter((b) => {
      const bookingDate = new Date(b.booking_date)
        .toISOString()
        .split("T")[0];
      return bookingDate === filterDate;
    });
  }

  // ⏱️ Status filter (NEW)
  if (statusFilter !== "all") {
    const now = new Date();

    filtered = filtered.filter((b) => {
      const [hour, min] = (b.booking_time || "00:00").split(":");
      const bookingDateTime = new Date(b.booking_date);
      bookingDateTime.setHours(parseInt(hour), parseInt(min));

      if (statusFilter === "upcoming") {
        return bookingDateTime >= now;
      }

      if (statusFilter === "past") {
        return bookingDateTime < now;
      }

      return true;
    });
  }

  setFilteredBookings(filtered);
}, [filterDate, bookings, statusFilter]);

return (
  <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <h1
        style={{ fontFamily: "para_font" }}
        className="text-xl md:text-2xl font-semibold text-indigo-700"
      >
        All Bookings
      </h1>

      <div className="flex flex-col w-full md:w-40">
  <label className="text-xs text-gray-500 mb-1">Status</label>

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="w-full px-3 py-2 border rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
  >
    <option value="all">All</option>
    <option value="upcoming">Upcoming</option>
    <option value="past">Past</option>
  </select>
</div>

      {/* Filter */}
      <div className="flex flex-col w-full md:w-52">
        <label className="text-xs text-gray-500 mb-1">
          Filter by Date
        </label>

        

        <div className="relative">
          <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

          <input
            type="text"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            placeholder="Select date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
      </div>
    </div>

    {/* Loading */}
    {loading ? (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
      </div>
    ) : filteredBookings.length === 0 ? (
      <div className="border rounded-xl p-6 bg-white text-center shadow-sm">
        <FaCalendarAlt className="mx-auto text-2xl text-gray-400 mb-2" />
        <p className="text-gray-500 text-sm">No bookings available</p>
      </div>
    ) : (
      <>
        {/* ---------------- DESKTOP TABLE ---------------- */}
        <div className="hidden md:block overflow-x-auto rounded-xl shadow-sm border bg-white">
          <table className="min-w-full">
            <thead className="bg-indigo-600 text-white text-sm">
              <tr>
                <th className="px-5 py-3 text-left">User</th>
                <th className="px-5 py-3 text-left">Owner</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Time</th>
                <th className="px-5 py-3 text-left">Action</th>
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
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* USER */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-800">
                        {booking.firstName} {booking.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.email}
                      </div>
                     <a
  href={`tel:${booking.phone}`}
  className="flex items-center gap-1 text-xs text-indigo-600 mt-1 hover:underline"
>
  <FaPhoneAlt  />
  {booking.phone || "N/A"}
</a>
                    </td>

                    {/* PROPERTY */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-800">
                        {booking.property_title}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <FaHome />
                        {booking.property_location}
                      </div>

                      <a
                        href={`tel:${booking.owner_phone}`}
                        className="flex items-center gap-1 text-xs text-indigo-600 mt-1 hover:underline"
                      >
                        <FaPhoneAlt  />
                        {booking.owner_phone || "N/A"}
                      </a>
                    </td>

                    {/* DATE */}
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {date}
                    </td>

                    {/* TIME */}
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {time}
                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4">
                      <a
                        href={`/properties/${booking.property_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ---------------- MOBILE CARDS ---------------- */}
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
                className="bg-white rounded-xl shadow-sm border p-4"
              >
                {/* USER */}
                <div className="font-medium text-indigo-700">
                  {booking.firstName} {booking.lastName}
                </div>
                <div className="text-xs text-gray-500">
                  {booking.email}
                </div>
               <a
  href={`tel:${booking.phone}`}
  className="flex items-center gap-1 text-xs text-indigo-600 mb-2"
>
  <FaPhoneAlt  />
  {booking.phone || "N/A"}
</a>

                {/* PROPERTY */}
                <div className="font-medium text-gray-800">
                  {booking.property_title}
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <FaHome />
                  {booking.property_location}
                </div>

                <a
                  href={`tel:${booking.owner_phone}`}
                  className="flex items-center gap-1 text-xs text-indigo-600 mt-1"
                >
                  <FaPhoneAlt  />
                  {booking.owner_phone || "N/A"}
                </a>

                {/* DATE TIME */}
                <div className="flex justify-between mt-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt />
                    {date}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock />
                    {time}
                  </div>
                </div>

                {/* ACTION */}
                <a
                  href={`/properties/${booking.property_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-center text-xs bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
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
