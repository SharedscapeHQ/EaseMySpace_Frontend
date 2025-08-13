import React, { useEffect, useState } from "react";
import { getUserSubscription } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiUserCheck,
  FiCheckCircle,
  FiClock,
  FiZap,
  FiArrowRightCircle,
} from "react-icons/fi";

export default function MyPlanDetails() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getUserSubscription()
      .then((data) => {
        console.log("✅ Plan Data Fetched:", data);
        setPlan(data);
      })
      .catch((err) => console.error("❌ Failed to fetch plan:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-700 font-medium py-6">
        <FiClock className="inline mr-2 animate-spin" /> Loading your plan
        details...
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="bg-white max-w-xl mx-auto rounded-lg p-6 shadow border border-gray-200 text-center">
        <p className="text-red-500 font-medium mb-4">
          ⚠️ No active subscription found.
        </p>
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
  const endDate = new Date(plan.end_date);
  const startDate = new Date(plan.start_date);
  const isValidEndDate = !isNaN(endDate.getTime());

  const daysLeft = isValidEndDate
    ? Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
    : null;

  const isExpiringSoon = daysLeft !== null && daysLeft <= 21 && daysLeft >= 0;


  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 border border-gray-200">
      <h3 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
        <FiUserCheck className="text-indigo-700" />
        Your Subscription Plan
      </h3>

      <ul className="space-y-4 text-gray-800 text-base">
        <li className="flex items-center gap-3">
          <FiZap className="text-indigo-500" />
          <strong>Plan Name:</strong> {plan.plan_name}
        </li>
        <li className="flex items-center gap-3">
          <FiCheckCircle className="text-green-500" />
          <strong>Contact Limit:</strong> {plan.contact_limit}
        </li>
        <li className="flex items-center gap-3">
          <FiCheckCircle className="text-yellow-600" />
          <strong>Used Contacts:</strong> {plan.used_contacts}
        </li>
        <li className="flex items-center gap-3">
          <FiCalendar className="text-blue-500" />
          <strong>Start Date:</strong>{" "}
          {startDate.toLocaleDateString("en-IN")}
        </li>
        <li className="flex items-center gap-3">
          <FiCalendar className="text-red-500" />
          <strong>End Date:</strong>{" "}
          {isValidEndDate ? endDate.toLocaleDateString("en-IN") : "Invalid date"}
          {isExpiringSoon && (
            <span className="ml-3 px-2 py-0.5 bg-yellow-200 text-yellow-800 text-sm rounded font-medium">
              ⏳ {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
            </span>
          )}
        </li>
      </ul>

      {isExpiringSoon && (
        <div className="mt-6">
          <button
            onClick={() => navigate("/subscription")}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            <FiArrowRightCircle /> Upgrade / Extend Plan
          </button>
        </div>
      )}
    </div>
  );
}
