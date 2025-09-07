import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getAssignedUsers } from "../../api/rmApi";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiZap,
  FiCheckCircle,
  FiBriefcase,
  FiArrowRightCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function AssignedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startFilter, setStartFilter] = useState("");
  const [endFilter, setEndFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const rm = JSON.parse(localStorage.getItem("user"));
  const rmId = rm?.id;

  useEffect(() => {
    if (!rmId) return;

    const fetchUsers = async () => {
      try {
        const data = await getAssignedUsers(rmId);

        const mapped = data.map((user) => ({
          ...user,
          name: user.name ? capitalizeName(user.name) : "N/A",
          subscription: user.subscription || null,
        }));

        setUsers(mapped);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch assigned users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [rmId]);

  const capitalizeName = (name) =>
    name
      .trim()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

  const filteredUsers = users.filter((u) => {
    if (!u.subscription) return false;

    const startDate = new Date(u.subscription.start_date).toLocaleDateString("en-CA");
    const endDate = new Date(u.subscription.end_date).toLocaleDateString("en-CA");

    const startCheck = startFilter
      ? startDate === new Date(startFilter).toLocaleDateString("en-CA")
      : true;

    const endCheck = endFilter
      ? endDate === new Date(endFilter).toLocaleDateString("en-CA")
      : true;

    return startCheck && endCheck;
  });

  if (loading)
    return (
      <p className="text-gray-500 text-center mt-12 text-lg animate-pulse">
        Loading assigned users...
      </p>
    );

  // === Selected user subscription detail view ===
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
          className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium text-white transition-all duration-200"
        >
          ← Back to Subscribers
        </button>

        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
          {/* Left Column */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

  // === List view ===
// === List view ===
return (
  <div className="p-4 sm:p-6 max-w-7xl mx-auto">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
        Assigned Users
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 w-full sm:w-auto">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex flex-col w-full">
            <label className="text-xs font-medium text-gray-600">Start</label>
            <input
              type="date"
              value={startFilter}
              onChange={(e) => setStartFilter(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-gray-700 text-xs focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-xs font-medium text-gray-600">End</label>
            <input
              type="date"
              value={endFilter}
              onChange={(e) => setEndFilter(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-gray-700 text-xs focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
        <button
          onClick={() => {
            setStartFilter("");
            setEndFilter("");
          }}
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 lg:w-auto w-1/3 rounded text-xs font-medium text-gray-700 h-fit mt-4 sm:mt-0"
        >
          Clear
        </button>
      </div>
    </div>

    {/* Mobile Cards */}
    <div className="grid gap-4 sm:hidden">
      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No users found.</p>
      ) : (
        filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className="border rounded-lg shadow-sm p-4 bg-white cursor-pointer hover:shadow-md transition"
          >
            <h3 className="font-semibold text-indigo-600">{user.name}</h3>
            <p className="text-sm text-gray-500 mb-2">
              {user.subscription?.plan_name || "No Plan"}
            </p>
            <p className="text-sm text-gray-700">{user.email || "N/A"}</p>
            <p className="text-sm text-gray-700">{user.phone || "N/A"}</p>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>
                Start:{" "}
                {user.subscription?.start_date
                  ? new Date(user.subscription.start_date).toLocaleDateString()
                  : "N/A"}
              </span>
              <span>
                End:{" "}
                {user.subscription?.end_date
                  ? new Date(user.subscription.end_date).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Gender: {user.gender || "N/A"}
            </p>
          </div>
        ))
      )}
    </div>

    {/* Desktop Table */}
    <div className="hidden sm:block border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      <div className="max-h-[500px] overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-blue-700 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-2 text-left font-semibold uppercase tracking-wider">
                  Email / Phone
                </th>
                <th className="px-4 py-2 text-left font-semibold uppercase tracking-wider">
                  Start
                </th>
                <th className="px-4 py-2 text-left font-semibold uppercase tracking-wider">
                  End
                </th>
                <th className="px-4 py-2 text-left font-semibold uppercase tracking-wider">
                  Gender
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-4 py-2 text-indigo-600 font-medium">
                    <div>{user.name}</div>
                    <div className="text-gray-500 text-xs">
                      {user.subscription?.plan_name || "No Plan"}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-gray-700 whitespace-pre-line">
                    {user.email || "N/A"}
                    {"\n"}
                    {user.phone || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {user.subscription?.start_date
                      ? new Date(user.subscription.start_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {user.subscription?.end_date
                      ? new Date(user.subscription.end_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {user.gender || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

}
