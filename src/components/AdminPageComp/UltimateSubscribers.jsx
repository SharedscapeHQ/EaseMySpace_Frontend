import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getUltimateUsers, getAllRMs, assignRMToUser } from "../../api/rmApi";
import {
  FiZap,
  FiCheckCircle,
  FiBriefcase,
  FiCalendar,
  FiArrowRightCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function UltimateSubscribers() {
  const [users, setUsers] = useState([]);
  const [rms, setRms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState({});
  const [startFilter, setStartFilter] = useState("");
  const [endFilter, setEndFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUltimateUsers();
    fetchRMs();
  }, []);

  const fetchUltimateUsers = async () => {
    try {
      const data = await getUltimateUsers();
      setUsers(
        data.map((user) => ({
          ...user,
          name: capitalizeName(`${user.name}`),
          selectedRM: user.assigned_rm_id || "",
          assigned_rm_id: user.assigned_rm_id || "",
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRMs = async () => {
    try {
      const data = await getAllRMs();
      setRms(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch RMs");
    }
  };

  const assignRM = async (userId, rmId) => {
    if (!userId || !rmId) return toast.error("Please select an RM first");

    const user = users.find((u) => u.id === userId);
    if (user && user.assigned_rm_id === rmId) {
      return toast.error("This RM is already assigned");
    }

    try {
      setAssigning((prev) => ({ ...prev, [userId]: true }));
      await assignRMToUser(userId, rmId);
      toast.success("RM assigned successfully");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, selectedRM: rmId, assigned_rm_id: rmId }
            : u
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign RM");
    } finally {
      setAssigning((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const capitalizeName = (name) =>
    name
      .trim()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

  // Filter by subscription dates
  const filteredUsers = users.filter((u) => {
    const startDate = new Date(u.subscription?.start_date);
    const endDate = new Date(u.subscription?.end_date);

    const startCheck = startFilter ? startDate >= new Date(startFilter) : true;
    const endCheck = endFilter ? endDate <= new Date(endFilter) : true;

    return startCheck && endCheck;
  });

  if (loading)
    return (
      <p className="text-gray-500 text-center mt-12 text-lg animate-pulse">
        Loading ultimate subscribers...
      </p>
    );

  // ✅ Detail view if a user is clicked
  if (selectedUser) {
    const plan = selectedUser.subscription;
    const startDate = plan?.start_date ? new Date(plan.start_date) : null;
    const endDate = plan?.end_date ? new Date(plan.end_date) : null;

    const isValidEndDate = endDate instanceof Date && !isNaN(endDate);
    const today = new Date();
    const daysLeft = isValidEndDate
      ? Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
      : null;
    const isExpiringSoon = isValidEndDate && daysLeft <= 7 && daysLeft >= 0;

    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedUser(null)}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium text-gray-700"
        >
          ← Back to Subscribers
        </button>

        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
          {/* Left Column: Plan Details */}
          <div className="lg:w-2/3 px-6 py-6 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg shadow-sm">
              <FiZap className="text-indigo-500 text-xl" />
              <div>
                <p className="text-gray-800 font-medium">Plan Name</p>
                <p className="font-semibold capitalize text-gray-700">
                  {plan?.plan_name || "N/A"}
                </p>
              </div>
            </div>

            {/* Contacts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg shadow-sm">
                <FiCheckCircle className="text-green-500 text-xl" />
                <div>
                  <p className="text-gray-800 font-medium">Contact Limit</p>
                  <p className="font-semibold text-gray-700">
                    {plan?.contact_limit ?? "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg shadow-sm">
                <FiCheckCircle className="text-yellow-600 text-xl" />
                <div>
                  <p className="text-gray-800 font-medium">Used Contacts</p>
                  <p className="font-semibold text-gray-700">
                    {plan?.used_contacts ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bookings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg shadow-sm">
                <FiBriefcase className="text-purple-500 text-xl" />
                <div>
                  <p className="text-gray-800 font-medium">Booking Limit</p>
                  <p className="font-semibold text-gray-700">
                    {plan?.booking_limit ?? "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg shadow-sm">
                <FiBriefcase className="text-pink-500 text-xl" />
                <div>
                  <p className="text-gray-800 font-medium">Used Bookings</p>
                  <p className="font-semibold text-gray-700">
                    {plan?.used_bookings ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg shadow-sm">
              <FiCalendar className="text-blue-500 text-xl" />
              <div>
                <p className="text-gray-800 font-medium">Start Date</p>
                <p className="font-semibold text-gray-700">
                  {startDate ? startDate.toLocaleDateString("en-IN") : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg shadow-sm relative">
              <FiCalendar className="text-red-500 text-xl" />
              <div>
                <p className="text-gray-800 font-medium">End Date</p>
                <p className="font-semibold text-gray-700">
                  {isValidEndDate
                    ? endDate.toLocaleDateString("en-IN")
                    : "Invalid date"}
                </p>
              </div>
              {isExpiringSoon && (
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-yellow-200 text-yellow-800 text-sm rounded font-medium animate-pulse">
                  ⏳ {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                </span>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3 bg-indigo-50 px-6 py-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-indigo-700">
                Maximize Your Subscription
              </h3>
              <p className="text-gray-700 text-sm">
                Explore more properties, increase your contacts, and manage
                bookings efficiently. Upgrade your plan to unlock premium
                features and get priority support.
              </p>
              <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
                <li>Access more contacts</li>
                <li>Increase booking limit</li>
                <li>Priority customer support</li>
                <li>Exclusive property insights</li>
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/subscription"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md transition w-full"
              >
                View / Upgrade Plans <FiArrowRightCircle />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ List view
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-0">
          Subscribers List
        </h2>

        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Start Date
            </label>
            <input
              type="date"
              value={startFilter}
              onChange={(e) => setStartFilter(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-gray-700 text-xs focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600">
              End Date
            </label>
            <input
              type="date"
              value={endFilter}
              onChange={(e) => setEndFilter(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-gray-700 text-xs focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            onClick={() => {
              setStartFilter("");
              setEndFilter("");
            }}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium text-gray-700"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-indigo-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 uppercase tracking-wider">
                  Name / Plan
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 uppercase tracking-wider">
                  Start
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 uppercase tracking-wider">
                  End 
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 uppercase tracking-wider">
                  Assign RM
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No ultimate subscribers found.
                  </td>
                </tr>
              )}

              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td
                    className="px-4 py-2 text-indigo-600 font-medium cursor-pointer hover:underline"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div>{user.name}</div>
                    <div className="text-gray-500 italic text-[11px]">
                      {user.subscription?.plan_name || "N/A"}
                    </div>
                  </td>

                  <td className="px-4 py-2 text-gray-700 whitespace-pre-line">
                    {user.email || "N/A"}{"\n"}
                    {user.phone || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {user.subscription?.start_date
                      ? new Date(
                          user.subscription.start_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {user.subscription?.end_date
                      ? new Date(
                          user.subscription.end_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-2">
                    <select
                      className="border border-gray-300 rounded px-2 py-1 text-gray-700 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-400"
                      value={user.selectedRM}
                      onChange={(e) => {
                        const rmId = e.target.value;
                        setUsers((prev) =>
                          prev.map((u) =>
                            u.id === user.id ? { ...u, selectedRM: rmId } : u
                          )
                        );
                      }}
                      disabled={rms.length === 0 || assigning[user.id]}
                    >
                      <option value="">Select RM</option>
                      {rms.map((rm) => (
                        <option key={rm.id} value={rm.id}>
                          {rm.email}
                        </option>
                      ))}
                    </select>

                    <button
                      className={`px-3 py-1 rounded text-white text-xs sm:text-sm transition
                        ${
                          assigning[user.id]
                            ? "bg-gray-400 cursor-not-allowed"
                            : user.assigned_rm_id
                            ? "bg-amber-500 hover:bg-amber-600"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      disabled={!user.selectedRM || assigning[user.id]}
                      onClick={() => assignRM(user.id, user.selectedRM)}
                    >
                      {assigning[user.id]
                        ? "Assigning..."
                        : user.assigned_rm_id
                        ? "Change"
                        : "Assign"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
