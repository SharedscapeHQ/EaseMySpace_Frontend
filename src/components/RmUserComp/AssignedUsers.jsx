import React, { useEffect, useState } from "react";
import { getAssignedUsers } from "../../api/rmApi";

export default function AssignedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const rm = JSON.parse(localStorage.getItem("user"));
  const rmId = rm?.id;

  useEffect(() => {
    if (!rmId) return;

    const fetchUsers = async () => {
      try {
        const data = await getAssignedUsers(rmId);
        setUsers(data);
      } catch (err) {
        console.error("Error fetching assigned users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [rmId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-10 h-10 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Assigned Users</h1>

      {users.length === 0 ? (
        <p className="text-gray-500 text-center">No users assigned to you yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Gender</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.user_id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-indigo-700">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{user.email}</td>
                  <td className="px-4 py-3 text-gray-700">{user.phone}</td>
                  <td className="px-4 py-3 text-gray-700">{user.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
