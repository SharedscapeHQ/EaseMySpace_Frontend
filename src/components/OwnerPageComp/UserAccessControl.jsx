import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserRole, deleteUserById } from "../../api/ownerApi";
import { toast } from "react-hot-toast";

export default function UserAccessControl() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await getAllUsers(); 

      // ✅ Show recently added first (sort by id desc or created_at desc if available)
     const sortedUsers = [...data].sort((a, b) => b.id - a.id);

      setUsers(sortedUsers);
    } catch (err) {
      console.error("Error fetching users", err);
      toast.error("Error loading users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      toast.success("Role updated successfully");
    } catch (err) {
      console.error("Error updating user role", err);
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserById(userId);
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user", err);
        toast.error("Failed to delete user");
      }
    }
  };

  const filteredUsers =
    roleFilter === "all" ? users : users.filter((u) => u.role === roleFilter);

  return (
    <section>
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Users</h2>

    {/* ✅ Role Filter */}
    <select
      value={roleFilter}
      onChange={(e) => setRoleFilter(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-1 text-sm"
    >
      <option value="all">All Roles</option>
      <option value="user">User</option>
      <option value="admin">Admin</option>
      <option value="RM">RM</option>
      <option value="HR">HR</option>
      <option value="owner">Owner</option>
    </select>
  </div>

  {loadingUsers ? (
    <p>Loading users...</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-center">
        <thead className="bg-indigo-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium text-indigo-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-xs font-medium text-indigo-700 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-xs font-medium text-indigo-700 uppercase tracking-wider">
              Referred By
            </th>
            <th className="px-6 py-3 text-xs font-medium text-indigo-700 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-xs font-medium text-indigo-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              {/* Name */}
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center align-middle">
                {u.firstName} {u.lastName}
              </td>

              {/* Contact */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center align-middle">
                <div>{u.email || <span className="italic text-gray-400">N/A</span>}</div>
                <div className="mt-1">{u.phone || <span className="italic text-gray-400">N/A</span>}</div>
              </td>

              {/* ✅ Referred By */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center align-middle">
                {u.referred_by_name && u.referred_by_name !== "N/A" ? (
                  <span className="text-gray-800">{u.referred_by_name}</span>
                ) : (
                  <span className="italic text-gray-400">Self Signup</span>
                )}
              </td>

              {/* Role */}
              <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                    u.role === "admin"
                      ? "bg-red-100 text-red-700"
                      : u.role === "owner"
                      ? "bg-yellow-100 text-yellow-700"
                      : u.role === "RM"
                      ? "bg-purple-100 text-purple-700"
                      : u.role === "HR"
                      ? "bg-pink-100 text-pink-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {u.role}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                {u.role !== "owner" ? (
                  <div className="flex justify-center items-center gap-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="RM">RM</option>
                      <option value="HR">HR</option>
                    </select>

                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <span className="italic text-gray-400 text-sm">Owner (locked)</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>

  );
}
