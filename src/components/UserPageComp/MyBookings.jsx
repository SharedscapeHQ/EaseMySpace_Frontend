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

    // Normalize into full ISO string
    const dt = new Date(`${booking.booking_date.split("T")[0]}T${booking.booking_time}`);

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
      <div
        className="text-center py-10 text-gray-700 text-lg flex justify-center items-center gap-2"
        style={{ fontFamily: "para_font" }}
      >
        <FiClock className="animate-spin text-xl" /> Loading your bookings...
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center py-10" style={{ fontFamily: "para_font" }}>
        {error}
      </p>
    );

  if (bookings.length === 0)
    return (
      <p
        className="text-center text-gray-500 py-10 italic"
        style={{ fontFamily: "para_font" }}
      >
        No bookings yet.
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {bookings.map((b) => (
        <div
          key={b.booking_id}
          onClick={() => navigate(`/properties/${b.property_id}`)}
          className="group relative min-w-[270px] lg:max-w-[300px] bg-white rounded-2xl border border-zinc-200 overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl"
          style={{ fontFamily: "para_font" }}
        >
          {/* Hover Blue Overlay */}
          <div className="hidden lg:block absolute inset-x-0 bottom-0 bg-blue-500 h-0 group-hover:h-full transition-all duration-300 ease-in-out z-0 rounded-2xl"></div>

          {/* Image Section */}
          <div className="relative h-48 w-full p-3 pt-3 pb-0 z-10">
            <div className="h-full w-full overflow-hidden rounded-xl">
              <img
                src={
                  Array.isArray(b.image) && b.image.length > 0
                    ? b.image[0]
                    : "/placeholder.jpg"
                }
                alt={b.property_title || "Property"}
                className="h-full w-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-transform duration-300"
              />
            </div>

            {/* Booked Badge */}
            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-md z-10">
              Booked
            </span>
          </div>

          {/* Content Section */}
          <div className="p-4 flex flex-col gap-1 z-10 relative">
            <h3 className="text-md truncate max-w-full sm:max-w-[200px] lg:group-hover:text-white transition-colors duration-300">
              {b.property_title}
            </h3>
            <p className="text-gray-600 text-xs lg:group-hover:text-white transition-colors duration-300 flex items-center gap-1">
              📍 {b.location}
            </p>
            <p className="text-zinc-800 text-xs lg:text-base whitespace-nowrap lg:group-hover:text-white transition-colors duration-300 flex items-center gap-1">
              🏠 {b.bhk_type || "N/A"}
            </p>
            <p className="text-zinc-800 text-xs lg:text-base whitespace-nowrap lg:group-hover:text-white transition-colors duration-300 flex items-center gap-1">
              💰 {b.price ? `₹${Number(b.price).toLocaleString()}` : "N/A"}
            </p>

            {/* Booking Date/Time */}
            <div className="mt-2 flex items-center gap-2 text-indigo-700 text-sm font-medium transition-colors duration-300 lg:group-hover:text-white">
              <FaCalendarAlt className="text-indigo-600 transition-colors duration-300 lg:group-hover:text-white" />
              {formatBookingDateTime(b)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
