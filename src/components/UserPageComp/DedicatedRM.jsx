import React, { useEffect, useState } from "react";
import { fetchMyRM } from "../../api/rmApi";
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
      <p className="text-gray-500 text-center mt-20 text-lg">Loading your dedicated RM...</p>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-indigo-700 mb-2 text-center">
        Welcome, Ultimate Member!
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        As an Ultimate subscriber, you have a dedicated Relationship Manager to assist you.
        You can reach out anytime for personalized support, guidance, or queries regarding your account and properties.
      </p>

      {!rm ? (
        <p className="text-gray-500 text-center text-lg">No RM has been assigned to you yet.</p>
      ) : (
        <div className="bg-indigo-50 p-5 rounded-lg shadow-inner space-y-3">
          <h3 className="text-2xl font-semibold text-indigo-800">Your Dedicated RM</h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Name:</strong> {rm.name}
            </p>
            <p>
              <strong>Email:</strong> {rm.email}
            </p>
            <p>
              <strong>Phone:</strong> {rm.phone}
            </p>
          </div>
          <p className="text-gray-500 mt-4 text-sm">
            Feel free to contact your RM for any assistance related to your subscriptions or properties.
          </p>
        </div>
      )}
    </div>
  );
}
