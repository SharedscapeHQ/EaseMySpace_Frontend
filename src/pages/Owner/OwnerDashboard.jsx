import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserRole,
  deleteUserById,
} from "../../API/ownerApi.js";
import {
  getAllProperties,
  deleteProperty,
  approveProperty,
  editProperty,
} from "../../API/adminApi.js";

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const [editingProperty, setEditingProperty] = useState(null);
  const [editPropertyForm, setEditPropertyForm] = useState({
    title: "",
    description: "",
    price: "",
    approved: false,
  });

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "properties") fetchProperties();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchProperties = async () => {
    setLoadingProperties(true);
    try {
      const { data } = await getAllProperties();
      setProperties(data);
    } catch (err) {
      console.error("Error fetching properties", err);
    } finally {
      setLoadingProperties(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      await fetchUsers();
    } catch (err) {
      console.error("Error updating user role", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserById(userId);
        await fetchUsers();
      } catch (err) {
        console.error("Error deleting user", err);
      }
    }
  };

  const openEditPropertyModal = (property) => {
    setEditingProperty(property);
    setEditPropertyForm({
      title: property.title || "",
      description: property.description || "",
      price: property.price || "",
      approved: property.approved || false,
    });
  };

  const handleEditPropertyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditPropertyForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditPropertySubmit = async () => {
    try {
      await editProperty(editingProperty.id, editPropertyForm);
      await fetchProperties();
      setEditingProperty(null);
    } catch (err) {
      console.error("Error editing property", err);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        console.log('done deleteProperty');
        await deleteProperty(propertyId);
        await fetchProperties();
      } catch (err) {
        console.error("Error deleting property", err);
      }
    }
  };

  const handleApproveProperty = async (propertyId) => {
    try {
      await approveProperty(propertyId);
      await fetchProperties();
    } catch (err) {
      console.error("Error approving property", err);
    }
  };

  const filteredProperties =
    statusFilter === "all"
      ? properties
      : properties.filter((p) =>
          (p.approved === true ? "approved" : "pending") === statusFilter
        );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed top-16 left-0 h-[calc(100vh-4rem)] z-10">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-indigo-700">Owner Panel</h2>
        </div>
        <nav className="p-4">
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-left px-4 py-2 rounded mb-2 font-medium ${
              activeTab === "users"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            👤 Users
          </button>
          <button
            onClick={() => setActiveTab("properties")}
            className={`w-full text-left px-4 py-2 rounded mb-2 font-medium ${
              activeTab === "properties"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            🏠 Properties
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 px-8 py-8">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-900 tracking-wide">
            Owner Dashboard
          </h1>
          <p className="text-indigo-600 mt-1 text-lg">
            Manage users and properties here
          </p>
        </header>

        {/* USERS TAB */}
        {activeTab === "users" && (
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-indigo-700 mb-6">Users</h2>
            {loadingUsers ? (
              <p className="text-indigo-600 text-center text-lg">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-500 text-center text-lg">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                              u.role === "admin"
                                ? "bg-red-100 text-red-700"
                                : u.role === "owner"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                          {u.role !== "owner" ? (
                            <>
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm transition"
                              >
                                Delete
                              </button>
                            </>
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
        )}

        {/* PROPERTIES TAB */}
        {activeTab === "properties" && (
          <section>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 md:gap-0">
              <h2 className="text-2xl font-semibold text-indigo-700">Properties</h2>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="statusFilter"
                  className="font-medium text-gray-700 whitespace-nowrap"
                >
                  Filter by status:
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="all">All</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {loadingProperties ? (
              <p className="text-indigo-600">Loading properties...</p>
            ) : filteredProperties.length === 0 ? (
              <p className="text-gray-500">No properties found with the selected filter.</p>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProperties.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col"
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400 italic">
                        No Image
                      </div>
                    )}
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-semibold text-lg text-indigo-800 truncate mb-1">
                        {p.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-1">
                        {p.location || "Unknown Location"}
                      </p>
                      <p className="text-indigo-600 font-bold mt-auto">
                        ₹ {Number(p.price).toLocaleString()}
                      </p>
                      <span
                        className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full select-none ${
                          p.approved
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.approved ? "Approved" : "Pending"}
                      </span>
                      <div className="mt-4 flex gap-2">
                        {!p.approved && (
                          <button
                            onClick={() => handleApproveProperty(p.id)}
                            className="flex-1 text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => openEditPropertyModal(p)}
                          className="flex-1 text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(p.id)}
                          className="flex-1 text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Edit Modal */}
            {editingProperty && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-4">
                    Edit Property: {editingProperty.title}
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="title"
                      value={editPropertyForm.title}
                      onChange={handleEditPropertyChange}
                      className="w-full px-4 py-2 border rounded"
                      placeholder="Title"
                    />
                    <textarea
                      name="description"
                      value={editPropertyForm.description}
                      onChange={handleEditPropertyChange}
                      className="w-full px-4 py-2 border rounded"
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      name="price"
                      value={editPropertyForm.price}
                      onChange={handleEditPropertyChange}
                      className="w-full px-4 py-2 border rounded"
                      placeholder="Price"
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="approved"
                        checked={editPropertyForm.approved}
                        onChange={handleEditPropertyChange}
                      />
                      <span>Approved</span>
                    </label>
                  </div>
                  <div className="flex justify-end mt-6 space-x-3">
                    <button
                      onClick={() => setEditingProperty(null)}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditPropertySubmit}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
