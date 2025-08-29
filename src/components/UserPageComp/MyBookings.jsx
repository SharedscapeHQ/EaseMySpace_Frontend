import React, { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { getMyBookings } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getMyBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const formatBookingDateTime = (booking) => {
    if (!booking.booking_date || !booking.booking_time) return "Invalid date";
    const isoString = `${booking.booking_date.split("T")[0]}T${booking.booking_time}`;
    const dt = new Date(isoString);
    if (isNaN(dt)) return "Invalid date";

    return dt.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading)
    return (
      <div className="text-center py-10 text-gray-700 text-lg flex justify-center items-center gap-2" style={{ fontFamily: "para_font" }}>
        <FiClock className="animate-spin text-xl" /> Loading your bookings...
      </div>
    );

  if (error)
    return <p className="text-red-500 text-center py-10" style={{ fontFamily: "para_font" }}>{error}</p>;

  if (bookings.length === 0)
    return <p className="text-center text-gray-500 py-10 italic" style={{ fontFamily: "para_font" }}>No bookings yet.</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
  <ul className="space-y-6">
    {bookings.map((b) => (
      <li
        key={b.booking_id}
        onClick={() => navigate(`/properties/${b.property_id}`)}
        className="flex flex-col sm:flex-row bg-gradient-to-r from-white to-indigo-50 rounded-2xl shadow-xl border border-indigo-200 overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer group"
        style={{ fontFamily: "para_font" }}
      >
        {/* Property Image */}
        <div className="w-full sm:w-64 h-56 sm:h-56 flex-shrink-0 overflow-hidden rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none">
          <img
            src={b.image && b.image.length > 0 ? b.image[0] : "/placeholder.jpg"}
            alt={b.property_title}
            className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Property Details */}
        <div className="flex-1 p-6 flex flex-col justify-between w-full relative">
          {/* Booked Badge */}
          <span className="absolute top-4 right-4 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
            Booked
          </span>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors duration-300">
              {b.property_title}
            </h3>
            <p className="text-gray-700 text-sm">
              <strong>Location:</strong> {b.location}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>BHK Type:</strong> {b.bhk_type || "N/A"}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Price:</strong> {b.price ? `₹${b.price.toLocaleString()}` : "N/A"}
            </p>
          </div>

          {/* Booking Date/Time */}
          <div className="mt-4 flex items-center gap-2 text-indigo-700 text-sm font-medium">
            <FaCalendarAlt className="text-indigo-600" /> {formatBookingDateTime(b)}
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>

  );
}
