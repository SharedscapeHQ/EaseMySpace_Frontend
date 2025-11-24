import React, { useEffect, useState } from "react";
import { fetchMyRM } from "../../api/rmApi";
import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiArrowRightCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function DedicatedRM({ userId }) {
  const [rm, setRm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRM = async () => {
      try {
        const data = await fetchMyRM(userId);
        setRm(data);
      } catch (err) {
        toast.error("Failed to fetch your RM");
      } finally {
        setLoading(false);
      }
    };
    getRM();
  }, [userId]);

  if (loading)
    return (
      <p className="text-gray-500 text-center mt-20 text-lg" style={{ fontFamily: "para_font" }}>
        Loading your dedicated RM...
      </p>
    );

  if (!rm)
    return (
      <p className="text-gray-500 text-center mt-20 text-lg" style={{ fontFamily: "para_font" }}>
        No RM has been assigned to you yet.
      </p>
    );

  return (
    <div className="max-w-full ">

      {/* Two-column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        {/* Left Column: RM Card */}
        <div className="lg:w-2/3 bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-6 space-y-6" style={{ fontFamily: "para_font" }}>
            <p className="text-gray-600">
              Reach out to your Relationship Manager directly for personalized support, guidance, or queries regarding your account and properties.
            </p>

            <div className="bg-indigo-50 p-5 rounded-lg shadow-sm space-y-4">
              <h3 className="text-2xl font-semibold text-indigo-800">{rm.name}</h3>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <FiPhone className="text-indigo-500" /> 
                  <a href={`tel:${rm.phone}`} className="hover:underline">{rm.phone}</a>
                </p>
                <p className="flex items-center gap-2">
                  <FiMail className="text-indigo-500" /> 
                  <a href={`mailto:${rm.email}`} className="hover:underline">{rm.email}</a>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <a
                  href={`tel:${rm.phone}`}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md transition w-full sm:w-auto"
                >
                  Call Now <FiPhone />
                </a>
                <a
                  href={`mailto:${rm.email}`}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition w-full sm:w-auto"
                >
                  Email <FiMail />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: General Content / CTA */}
        <div className="lg:w-1/3 bg-indigo-50 px-6 py-6 flex flex-col justify-between rounded-tr-2xl rounded-br-2xl" style={{ fontFamily: "para_font" }}>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-indigo-700">Make the Most of Your RM</h3>
            <p className="text-gray-700 text-sm">
              Your Relationship Manager is here to help you:
            </p>
            <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
              <li>Get personalized property recommendations</li>
              <li>Resolve queries faster</li>
              <li>Assist with subscription benefits</li>
              <li>Priority support for bookings</li>
            </ul>
          </div>
          <div className="mt-6">
            <Link
              to="/subscription"
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md transition w-full"
            >
              Upgrade / Extend Plan <FiArrowRightCircle />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
