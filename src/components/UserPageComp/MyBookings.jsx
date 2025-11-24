import React, { useEffect, useState } from "react";
import { getMyBookings } from "../../api/userApi";
import { IoChatboxEllipsesOutline, IoCall } from "react-icons/io5";
import dayjs from "dayjs";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getMyBookings();
        setBookings(Array.isArray(data) ? data : []);
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
      <div className="text-center py-10 text-gray-700 dark:text-gray-300 text-lg flex justify-center items-center gap-2">
        Loading your bookings...
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center py-10">{error}</p>
    );

  if (!bookings.length)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-10 italic">
        No bookings yet.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-6">
        {bookings.map((b) => (
          <div
            key={b.booking_id}
            onClick={() => window.open(`/properties/${b.property_id}`, "_blank")}
            className="min-w-[300px] max-w-[300px] group bg-white dark:bg-zinc-700 rounded-2xl border border-zinc-200 dark:border-zinc-600 flex-shrink-0 overflow-hidden shadow-md cursor-pointer hover:shadow-lg"
          >
            {/* Image */}
            <div className="relative w-full h-44">
              {b.image && b.image.length > 0 ? (
                <img
                  src={b.image[0]}
                  alt={b.property_title || "Property"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 italic">
                  No Image
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-4 flex flex-col gap-3">
              {/* Owner Info */}
              <p className="text-zinc-800 dark:text-zinc-200 text-sm">Owner's Contact</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-lg">
                    {b.property_title?.charAt(0) || "U"}
                  </div>
                  <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    {b.property_title}
                  </span>
                </div>

                <div className="flex gap-4 text-blue-500">
                  <IoChatboxEllipsesOutline className="text-2xl cursor-pointer" />
                  <IoCall className="text-2xl cursor-pointer" />
                </div>
              </div>

              {/* Rent Info */}
              <div className="text-center">
                <p className="font-bold text-black dark:text-white text-base">
                  ₹ {Number(b.price || 0).toLocaleString()}/month
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {b.bhk_type} in {b.location || "Unknown location"}
                </p>
              </div>

              {/* Booking Date/Time */}
              <div className="text-center text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                Booking: {formatBookingDateTime(b)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
