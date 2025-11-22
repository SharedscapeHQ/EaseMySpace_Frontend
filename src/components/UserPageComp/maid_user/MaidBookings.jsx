import React, { useEffect, useState } from "react";
import { FiClock, FiMapPin, FiUser, FiPhoneCall, FiCalendar } from "react-icons/fi";
import { fetchUserBookings } from "../../../api/Maid_api/maidUserApi";

export default function MaidBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get userId from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    async function loadBookings() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchUserBookings(userId);
        setBookings(data || []);
      } catch (err) {
        console.error("❌ Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [userId]);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading bookings...</div>;

  if (bookings.length === 0)
    return <div className="p-6 text-center text-gray-500">No bookings found.</div>;

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">My Maid Bookings</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {bookings.map((b) => (
          <div
            key={b.booking_id}
            className="bg-white shadow-md rounded-2xl overflow-hidden border hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4 p-4 border-b">
              <img
                src={b.profile_photo || "/maid-placeholder.png"}
                alt={`${b.worker_first_name} ${b.worker_last_name}`}
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {b.worker_first_name} {b.worker_last_name}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <FiUser /> Age: {b.worker_age} | Exp: {b.worker_experience}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <FiMapPin /> {b.worker_location}
                </p>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <p className="text-gray-700 flex items-center gap-2">
                <FiCalendar className="text-indigo-500" />{" "}
                {new Date(b.booking_date).toLocaleDateString()} at {b.booking_time}
              </p>

              <p className="text-gray-700 flex items-center gap-2">
                <FiClock className="text-indigo-500" /> Status:{" "}
                <span
                  className={`font-semibold ${
                    b.booking_status === "Completed"
                      ? "text-green-600"
                      : b.booking_status === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {b.booking_status}
                </span>
              </p>

              <p className="text-gray-700 flex items-center gap-2">
                <FiPhoneCall className="text-indigo-500" /> Service Type:{" "}
                <span className="font-medium">{b.service_type}</span>
              </p>

              <div className="text-lg font-semibold text-indigo-700">₹{b.price}</div>
              <p className="text-sm text-gray-500">Skills: {b.worker_skills}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
