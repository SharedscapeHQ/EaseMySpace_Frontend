import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserRole, deleteUserById } from "../../api/ownerApi";
import { toast } from "react-hot-toast";

export default function UserAccessControl() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalUser, setModalUser] = useState(null); // For modal

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await getAllUsers();
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
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
      toast.success("Role updated successfully");
    } catch (err) {
      console.error("Error updating user role", err);
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUserById(userId);
      fetchUsers();
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user", err);
      toast.error("Failed to delete user");
    }
  };

  // Filter users by role
  const filteredByRole = roleFilter === "all" ? users : users.filter(u => u.role === roleFilter);

  // Filter users by search term
  const filteredUsers = filteredByRole.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      {/* Header: Filter + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="flex gap-2 flex-wrap">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="RM">RM</option>
            <option value="HR">HR</option>
            <option value="owner">Owner</option>
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          />
        </div>
      </div>

      {/* Users Table */}
      {loadingUsers ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-center">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-indigo-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-indigo-700 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-xs font-medium text-indigo-700 uppercase tracking-wider">Referred By</th>
                <th className="px-6 py-3 text-xs font-medium text-indigo-700 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-xs font-medium text-indigo-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(u => (
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

                  {/* Referred By */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center align-middle">
                    {u.referred_by_name && u.referred_by_name !== "N/A" ? (
                      <button
                        onClick={() => {
                          const referredUser = users.find(user => user.id === u.referred_by);
                          setModalUser(
                            referredUser || {
                              firstName: u.referred_by_name,
                              lastName: "",
                              email: "N/A",
                              phone: "N/A",
                              role: "N/A",
                              referred_by_name: "N/A",
                            }
                          );
                        }}
                        className="text-indigo-600 hover:underline"
                      >
                        {u.referred_by_name}
                      </button>
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
                          onChange={e => handleRoleChange(u.id, e.target.value)}
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

      {/* Modal */}
     {modalUser && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-96 relative">
      
      {/* Close button (X) */}
      <button
        onClick={() => setModalUser(null)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95a1 1 0 011.414-1.414L10 8.586z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Header */}
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
        Referee Details
      </h3>

      {/* User Info */}
      <div className="space-y-3 text-gray-700 text-sm">
        <p><span className="font-medium">Name:</span> {modalUser.firstName} {modalUser.lastName}</p>
        <p><span className="font-medium">Email:</span> {modalUser.email}</p>
        <p><span className="font-medium">Phone:</span> {modalUser.phone}</p>
        <p><span className="font-medium">Role:</span> {modalUser.role}</p>
        <p><span className="font-medium">Referred By:</span> {modalUser.referred_by_name || "Self Signup"}</p>
      </div>

      
    </div>
  </div>
)}

    </section>
  );
}
