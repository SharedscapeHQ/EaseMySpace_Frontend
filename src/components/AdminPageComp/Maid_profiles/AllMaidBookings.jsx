import React, { useState, useEffect } from "react";
import { getAllBookingsWithDetails } from "../../../api/Maid_api/maidAdminApi";
import dayjs from "dayjs";

export default function AllMaidBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await getAllBookingsWithDetails();
        setBookings(res.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading bookings...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 style={{ fontFamily: "para_font" }} className="text-2xl  text-pink-600 mb-6">All Maid Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md">
            <thead className="bg-pink-100 text-gray-700">
  <tr>
    <th className="py-3 px-4 text-left">User</th>
    <th className="py-3 px-4 text-left">Worker</th>
    <th className="py-3 px-4 text-left">Agent</th>
    <th className="py-3 px-4 text-left">Date</th>
    <th className="py-3 px-4 text-left">Time</th>
    <th className="py-3 px-4 text-left">Status</th>
    <th className="py-3 px-4 text-left">Amount Paid</th>
  </tr>
</thead>
<tbody>
  {bookings.map((b) => (
    <tr
      key={b.booking_id}
      className="border-b hover:bg-pink-50 transition-colors"
    >
      {/* User */}
      <td className="py-3 px-4">
        {b.user_first_name} {b.user_last_name}
        <br />
        <span className="text-gray-400 text-xs">{b.user_email}</span>
        <br />
        <span className="text-gray-400 text-xs">{b.user_phone}</span>
      </td>

      {/* Worker */}
      <td className="py-3 px-4">
        {b.worker_first_name} {b.worker_last_name}
        <br />
        <span className="text-gray-400 text-xs">{b.worker_skills}</span>
        <br />
        <span className="text-gray-400 text-xs">{b.worker_location}</span>
        <br />
        <span className="text-gray-400 text-xs">Age: {b.worker_age}</span>
        <br />
        <span className="text-gray-400 text-xs">Experience: {b.worker_experience}</span>
      </td>

      {/* Agent */}
      <td className="py-3 px-4">
        {b.agent_name}
        <br />
        <span className="text-gray-400 text-xs">{b.agent_email}</span>
        <br />
        <span className="text-gray-400 text-xs">{b.agent_phone}</span>
      </td>

      {/* Date & Time */}
      <td className="py-3 px-4">{dayjs(b.booking_date).format("DD MMM YYYY")}</td>
      <td className="py-3 px-4">{b.booking_time}</td>

      {/* Status */}
      <td className="py-3 px-4 text-green-600 font-medium">{b.booking_status}</td>

      {/* Price Paid */}
      <td className="py-3 px-4  text-indigo-700">₹{b.booked_price}</td> {/* <-- show booking price */}
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
}
