import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  getAllProperties,
  deleteProperty,
  approveProperty,
  editProperty,
  markNewlyListed,
} from "../../API/adminApi";
import { logoutUser } from "../../API/authAPI";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProps, setLoadingProps] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    price: "",
    image: "",
    status: "pending",
  });

  const [positions, setPositions] = useState({});

  // Fetch users
  useEffect(() => {
    (async () => {
      setLoadingUsers(true);
      try {
        const { data } = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users", err);
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  // Fetch properties
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoadingProps(true);
    try {
      const { data } = await getAllProperties();
      setProperties(data);
    } catch (err) {
      console.error("Error fetching properties", err);
    } finally {
      setLoadingProps(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveProperty(id);
      await fetchProperties();
    } catch (err) {
      console.error("Error approving property", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(id);
        await fetchProperties();
      } catch (err) {
        console.error("Error deleting property", err);
      }
    }
  };

  const openEditModal = (property) => {
    setEditingProperty(property);
    setEditForm({
      title: property.title || "",
      location: property.location || "",
      price: property.price || "",
      image: property.image || "",
      status: property.status || "pending",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("location", editForm.location);
      formData.append("price", editForm.price);
      formData.append("status", editForm.status);

      if (editForm.image instanceof File) {
        formData.append("image", editForm.image);
      }

      await editProperty(editingProperty.id, formData);
      setEditingProperty(null);
      await fetchProperties();
    } catch (err) {
      console.error("Error updating property", err);
    }
  };

  const filteredProperties =
    statusFilter === "all"
      ? properties
      : properties.filter((p) => p.status?.toLowerCase() === statusFilter);

  const approved = properties.filter((p) => p.status === "approved");

  // --- Updated logout handler ---
  const handleLogout = async () => {
    try {
      await logoutUser(); // call backend logout API
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      const savedUser = localStorage.getItem("user");
      localStorage.removeItem("user");

      // Dispatch manual storage event for same-tab updates
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "user",
          oldValue: savedUser,
          newValue: null,
        })
      );

      navigate("/"); // redirect to home/login
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed top-16 left-0 h-[calc(100vh-4rem)] z-20 flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-indigo-700 select-none">
            Admin Panel
          </h2>
        </div>
        <nav className="p-4 flex flex-col gap-2 flex-grow">
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-left px-4 py-3 rounded font-semibold transition-colors ${
              activeTab === "users"
                ? "bg-indigo-100 text-indigo-700 shadow"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            👤 Users
          </button>
          <button
            onClick={() => setActiveTab("properties")}
            className={`w-full text-left px-4 py-3 rounded font-semibold transition-colors ${
              activeTab === "properties"
                ? "bg-indigo-100 text-indigo-700 shadow"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            🏠 Properties
          </button>
          <button
            onClick={() => setActiveTab("newly_listed")}
            className={`w-full text-left px-4 py-3 rounded font-semibold transition-colors ${
              activeTab === "newly_listed"
                ? "bg-indigo-100 text-indigo-700 shadow"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            🏷️ Newly Listed
          </button>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded font-semibold text-red-600 hover:bg-red-100 transition-colors"
          >
            🔓 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 px-8 py-10">
        <h1 className="text-3xl font-bold text-indigo-800 mb-8">
          Admin Dashboard
        </h1>

        {/* Users Tab */}
        {activeTab === "users" && (
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
              Users
            </h2>
            {loadingUsers ? (
              <p className="text-indigo-600">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              <div className="overflow-auto bg-white rounded shadow p-4">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-indigo-50 text-indigo-700">
                      <th className="p-3 text-left font-medium">Name</th>
                      <th className="p-3 text-left font-medium">Email</th>
                      <th className="p-3 text-left font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3 capitalize">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-700"
                                : user.role === "owner"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <section>
            <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
              <h2 className="text-2xl font-semibold text-indigo-700">
                Properties
              </h2>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="statusFilter"
                  className="font-medium text-gray-700"
                >
                  Filter by status:
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {loadingProps ? (
              <p className="text-indigo-600">Loading properties...</p>
            ) : filteredProperties.length === 0 ? (
              <p className="text-gray-500">No properties found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded shadow p-4 flex flex-col gap-3"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-48 object-cover rounded"
                    />
                    <h3 className="font-bold text-lg text-indigo-700">
                      {property.title}
                    </h3>
                    <p className="text-gray-600">{property.location}</p>
                    <p className="font-semibold text-indigo-900">
                      ${property.price}
                    </p>
                    <p className="capitalize font-semibold">
                      Status:{" "}
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-white text-xs ${
                          property.status === "approved"
                            ? "bg-green-600"
                            : property.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-600"
                        }`}
                      >
                        {property.status}
                      </span>
                    </p>
                    <div className="flex gap-2 mt-auto">
                      {property.status === "pending" && (
                        <button
                          onClick={() => handleApprove(property.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded py-2"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(property)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded py-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded py-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Edit Modal */}
            {editingProperty && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setEditingProperty(null)}
              >
                <div
                  className="bg-white rounded shadow-lg p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Edit Property
                  </h3>
                  <div className="flex flex-col gap-3">
                    <label className="font-medium">
                      Title
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className="border rounded w-full px-3 py-2 mt-1"
                      />
                    </label>
                    <label className="font-medium">
                      Location
                      <input
                        type="text"
                        name="location"
                        value={editForm.location}
                        onChange={handleEditChange}
                        className="border rounded w-full px-3 py-2 mt-1"
                      />
                    </label>
                    <label className="font-medium">
                      Price
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        className="border rounded w-full px-3 py-2 mt-1"
                      />
                    </label>
                    <label className="font-medium">
                      Status
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        className="border rounded w-full px-3 py-2 mt-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </label>
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={() => setEditingProperty(null)}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleEditSubmit}
                        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Newly Listed Tab */}
       {activeTab === "newly_listed" && (
  <section>
    <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
      Newly Listed Properties
    </h2>
    {approved.length === 0 ? (
      <p className="text-gray-500">No approved properties.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {approved.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded shadow p-4 flex flex-col gap-3"
          >
            <img
              src={property.image}
              alt={property.title}
              className="h-48 object-cover rounded"
            />
            <h3 className="font-bold text-lg text-indigo-700">
              {property.title}
            </h3>
            <p className="text-gray-600">{property.location}</p>
            <p className="font-semibold text-indigo-900">
              ${property.price}
            </p>
          <button
  onClick={() =>
    markNewlyListed(property.id, true, 1).then(fetchProperties)
  }
  className="bg-yellow-500 hover:bg-yellow-600 text-white rounded py-2"
>
  Mark as Newly Listed
</button>

          </div>
        ))}
      </div>
    )}
  </section>
)}

      </main>
    </div>
  );
}