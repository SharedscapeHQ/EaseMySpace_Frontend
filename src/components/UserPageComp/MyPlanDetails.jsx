import React, { useEffect, useState } from "react";
import { getUserSubscription } from "../../api/userApi";
import { useNavigate, Link } from "react-router-dom";
import {
  FiCalendar,
  FiUserCheck,
  FiCheckCircle,
  FiClock,
  FiZap,
  FiArrowRightCircle,
  FiBriefcase,
} from "react-icons/fi";

export default function MyPlanDetails() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  getUserSubscription()
    .then((data) => {
      setPlan(data);
    })
    .catch((err) => console.error("❌ Failed to fetch plan:", err))
    .finally(() => setLoading(false));
}, []);

  if (loading) {
    return (
      <div className="text-gray-700 font-medium py-6 flex items-center gap-2">
        <FiClock className="animate-spin text-xl" /> Loading your plan details...
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <p className="text-red-500 font-medium mb-4">No active subscription found.</p>
        <button
          onClick={() => navigate("/subscriptions")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
        >
          Browse Plans
        </button>
      </div>
    );
  }

  const now = new Date();
  const startDate = new Date(plan.start_date);
  const endDate = new Date(plan.end_date);
  const isValidEndDate = !isNaN(endDate.getTime());
  const daysLeft = isValidEndDate ? Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)) : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 21 && daysLeft >= 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
      
      {/* Left Column: Plan Details */}
      <div className="lg:w-2/3 px-6 py-6 space-y-4">
        <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg shadow-sm">
          <FiZap className="text-indigo-500 text-xl" />
          <div>
            <p className="text-gray-800 font-medium">Plan Name</p>
            <p className="font-semibold capitalize text-gray-700">{plan.plan_name}</p>
          </div>
        </div>

        {/* Contacts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg shadow-sm">
            <FiCheckCircle className="text-green-500 text-xl" />
            <div>
              <p className="text-gray-800 font-medium">Contact Limit</p>
              <p className="font-semibold text-gray-700">{plan.contact_limit}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg shadow-sm">
            <FiCheckCircle className="text-yellow-600 text-xl" />
            <div>
              <p className="text-gray-800 font-medium">Used Contacts</p>
              <p className="font-semibold text-gray-700">{plan.used_contacts}</p>
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg shadow-sm">
            <FiBriefcase className="text-purple-500 text-xl" />
            <div>
              <p className="text-gray-800 font-medium">Booking Limit</p>
              <p className="font-semibold text-gray-700">{plan.booking_limit}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg shadow-sm">
            <FiBriefcase className="text-pink-500 text-xl" />
            <div>
              <p className="text-gray-800 font-medium">Used Bookings</p>
              <p className="font-semibold text-gray-700">{plan.used_bookings}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg shadow-sm">
          <FiCalendar className="text-blue-500 text-xl" />
          <div>
            <p className="text-gray-800 font-medium">Start Date</p>
            <p className="font-semibold text-gray-700">{startDate.toLocaleDateString("en-IN")}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg shadow-sm relative">
          <FiCalendar className="text-red-500 text-xl" />
          <div>
            <p className="text-gray-800 font-medium">End Date</p>
            <p className="font-semibold text-gray-700">{isValidEndDate ? endDate.toLocaleDateString("en-IN") : "Invalid date"}</p>
          </div>
          {isExpiringSoon && (
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-yellow-200 text-yellow-800 text-sm rounded font-medium animate-pulse">
              ⏳ {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
            </span>
          )}
        </div>

        {isExpiringSoon && (
          <div className="mt-6 text-left">
            <button
              onClick={() => navigate("/subscription")}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md transition"
            >
              <FiArrowRightCircle /> Upgrade / Extend Plan
            </button>
          </div>
        )}
      </div>

      {/* Right Column: General Content / CTA */}
      <div className="lg:w-1/3 bg-indigo-50 px-6 py-6 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-indigo-700">Maximize Your Subscription</h3>
          <p className="text-gray-700 text-sm">
            Explore more properties, increase your contacts, and manage bookings efficiently.
            Upgrade your plan to unlock premium features and get priority support.
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
  );
}
