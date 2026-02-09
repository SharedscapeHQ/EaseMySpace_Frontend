import React, { useEffect, useState } from "react";
import { getRMAssignments } from "../../api/ownerApi";
import { toast } from "react-hot-toast";

export default function RMAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data } = await getRMAssignments();
      setAssignments(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch RM assignments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-gray-500 text-center mt-12 text-lg animate-pulse">
        Loading RM assignments...
      </p>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 style={{ fontFamily: "para_font" }} className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        RM Assignment History
      </h2>

      <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 text-base sm:text-base">
            <thead className="bg-indigo-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider">
                  RM
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider">
                  Assigned By
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider">
                  Assigned At
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500 text-base">
                    No RM assignments found.
                  </td>
                </tr>
              ) : (
                assignments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition">
                    {/* User */}
                    <td className="px-4 py-3 text-gray-900">
                      <div className="font-medium text-base">{a.user_name}</div>
                      <div className="text-gray-500 text-[13px]">{a.user_email}</div>
                    </td>

                    {/* RM */}
                    <td className="px-4 py-3 text-gray-700">
                      <div className="font-medium text-base">{a.rm_name}</div>
                      <div className="text-gray-500 text-[13px]">{a.rm_email}</div>
                    </td>

                    {/* Assigned By */}
                    <td className="px-4 py-3 text-gray-700">
                      <div className="font-medium text-base">{a.assigned_by_name || "N/A"}</div>
                      <div className="text-gray-500 text-[13px]">{a.assigned_by_email || "—"}</div>
                    </td>

                    {/* Assigned At */}
                    <td className="px-4 py-3 text-gray-700 text-base">
                      {new Date(a.assigned_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
