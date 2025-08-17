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
      <div className="text-center py-6 text-gray-700">
        <FiClock className="inline mr-2 animate-spin" /> Loading bookings...
      </div>
    );
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (bookings.length === 0)
    return <p className="text-center text-gray-500 italic">No bookings yet.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ul className="space-y-8">
        {bookings.map((b) => (
          <li
            key={b.booking_id}
            className="flex flex-col sm:flex-row bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-2xl shadow-xl border border-indigo-200 overflow-hidden"
          >
            {/* Property Image */}
            <div className="w-full sm:w-56 h-48 sm:h-48 flex-shrink-0 overflow-hidden rounded-l-2xl">
              <img
                src={b.image && b.image.length > 0 ? b.image[0] : "/placeholder.jpg"}
                alt={b.property_title}
                className="w-full h-full object-cover block"
              />
            </div>

            {/* Property Details */}
            <div className="flex-1 p-6 flex flex-col justify-between w-full relative">
              {/* Booked Badge */}
              <span className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Booked
              </span>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{b.property_title}</h3>
                <p className="text-gray-700 text-sm mb-1">
                  <strong>Location:</strong> {b.location}
                </p>
                <p className="text-gray-700 text-sm mb-1">
                  <strong>BHK Type:</strong> {b.bhk_type || "N/A"}
                </p>
                <p className="text-gray-700 text-sm mb-1">
                  <strong>Price:</strong> {b.price ? `₹${b.price.toLocaleString()}` : "N/A"}
                </p>
              </div>

              {/* Booking Date/Time and View Details */}
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 text-indigo-700 text-sm font-medium">
                  <FaCalendarAlt className="text-indigo-600" /> {formatBookingDateTime(b)}
                </div>
                <button
                  onClick={() => navigate(`/properties/${b.property_id}`)}
                  className="mt-2 sm:mt-0 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
