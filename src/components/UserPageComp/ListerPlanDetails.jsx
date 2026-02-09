import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiArrowRightCircle,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { getListerUserSubscription } from "../../api/userApi";

export default function ListerPlanDetails() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListerPlan = async () => {
      try {
        const data = await getListerUserSubscription(); 
        setPlan(data);
      } catch (err) {
        console.error("❌ Failed to fetch lister plan:", err);
        setPlan(null);
      } finally {
        setLoading(false);
      }
    };

    fetchListerPlan();
  }, []);

  if (loading) {
    return (
      <div className="text-gray-700 font-medium py-6 flex items-center gap-2">
        <FiClock className="animate-spin text-xl" /> Loading your lister plan details...
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <p className="text-red-500 font-medium mb-4">No active lister subscription found.</p>
        <button
          onClick={() => navigate("/lister-subscription")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
        >
          Browse Lister Plans
        </button>
      </div>
    );
  }

  const now = new Date();
  const startDate = new Date(plan.start_date);
  const endDate = new Date(plan.end_date);
  const isValidEndDate = !isNaN(endDate.getTime());
  const daysLeft = isValidEndDate
    ? Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
    : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 14 && daysLeft >= 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
      {/* Left Section */}
      <div className="lg:w-2/3 px-6 py-6 space-y-4">
        <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg shadow-sm">
          <FiHome className="text-indigo-500 text-xl" />
          <div>
            <p className="text-gray-800 font-medium">Plan Name</p>
            <p className=" capitalize text-gray-700">
              {plan.plan_name?.replace("_", " ")}
            </p>
          </div>
        </div>

        {/* Property Limits */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg shadow-sm">
            <FiCheckCircle className="text-green-500 text-xl" />
            <div>
              <p className="text-gray-800 font-medium">Property Limit</p>
              <p className=" text-gray-700">{plan.property_limit}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg shadow-sm">
            <FiCheckCircle className="text-yellow-600 text-xl" />
            <div>
              <p className="text-gray-800 font-medium">Used Properties</p>
              <p className=" text-gray-700">{plan.used_properties}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg shadow-sm">
            <FiCalendar className="text-blue-500 text-xl" />
            <div>
              <p className="text-gray-800 font-medium">Start Date</p>
              <p className=" text-gray-700">
                {startDate.toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg shadow-sm relative">
            <FiCalendar className="text-red-500 text-xl" />
            <div>
              <p className="text-gray-800 font-medium">End Date</p>
              <p className=" text-gray-700">
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

        {/* Status */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg shadow-sm">
          <FiAlertTriangle
            className={`text-xl ${
              plan.status === "active" ? "text-green-500" : "text-red-500"
            }`}
          />
          <div>
            <p className="text-gray-800 font-medium">Status</p>
            <p
              className={` capitalize ${
                plan.status === "active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {plan.status}
            </p>
          </div>
        </div>

        {isExpiringSoon && (
          <div className="mt-6 text-left">
            <button
              onClick={() => navigate("/subscriptions")}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white  px-4 py-2 rounded-md transition"
            >
              <FiArrowRightCircle /> Extend / Upgrade Plan
            </button>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="lg:w-1/3 bg-indigo-50 px-6 py-6 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-xl  text-indigo-700">Grow Your Listings</h3>
          <p className="text-gray-700 text-sm">
            Manage your properties easily and reach more tenants by upgrading your
            lister plan.
          </p>
          <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
            <li>Increase property listing limit</li>
            <li>Boost listing visibility</li>
            <li>Access premium marketing tools</li>
            <li>Get verified owner badge</li>
          </ul>
        </div>
        <div className="mt-6">
          <Link
            to="/lister-subscription"
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white  px-4 py-2 rounded-md transition w-full"
          >
            View / Upgrade Plans <FiArrowRightCircle />
          </Link>
        </div>
      </div>
    </div>
  );
}
