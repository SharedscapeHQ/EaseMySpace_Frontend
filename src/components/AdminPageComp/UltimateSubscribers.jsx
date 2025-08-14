import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getUltimateUsers, getAllRMs, assignRMToUser } from "../../api/rmApi";

export default function UltimateSubscribers() {
  const [users, setUsers] = useState([]);
  const [rms, setRms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState({}); // Track assignment per user

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
          name: capitalizeName(user.name),
          selectedRM: user.assigned_rm_id || "",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch users:", err);
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
      console.error("Failed to fetch RMs:", err);
      toast.error("Failed to fetch RMs");
    }
  };

  const assignRM = async (userId, rmId) => {
    if (!userId || !rmId) {
      toast.error("Please select an RM first");
      return;
    }

    try {
      setAssigning((prev) => ({ ...prev, [userId]: true }));
      await assignRMToUser(userId, rmId);
      toast.success("RM assigned successfully");

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, selectedRM: rmId } : u))
      );
    } catch (err) {
      console.error("Failed to assign RM:", err.response?.data || err.message);
      toast.error("Failed to assign RM");
    } finally {
      setAssigning((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const capitalizeName = (name) => {
    return name
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (loading)
    return (
      <p className="text-gray-500 text-center mt-12 text-lg animate-pulse">
        Loading ultimate subscribers...
      </p>
    );

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">
        Ultimate Subscribers
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              {["Name", "Email", "Phone", "Assign RM"].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-sm sm:text-base font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-4 py-3 whitespace-nowrap text-gray-900 font-medium text-sm sm:text-base">
                  {user.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-sm sm:text-base">
                  {user.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-sm sm:text-base">
                  {user.phone}
                </td>
                <td className="px-4 py-3 whitespace-nowrap flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
                  <select
                    className="border rounded px-3 py-2 text-gray-700 text-sm sm:text-base w-full sm:w-auto focus:ring-2 focus:ring-indigo-400 transition"
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
                        {capitalizeName(rm.name)} ({rm.email})
                      </option>
                    ))}
                  </select>

                  <button
                    className={`px-4 py-2 rounded text-white text-sm sm:text-base transition ${
                      user.selectedRM
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!user.selectedRM || assigning[user.id]}
                    onClick={() => assignRM(user.id, user.selectedRM)}
                  >
                    {assigning[user.id] ? "Assigning..." : "Assign"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-gray-500 text-center py-6">No ultimate subscribers found.</p>
        )}
      </div>
    </div>
  );
}
