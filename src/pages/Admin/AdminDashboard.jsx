import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  getAllProperties,
  deleteProperty,
  approveProperty,
  editProperty,
  markNewlyListed, // 🆕 newly listed API
} from "../../API/adminApi";

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

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed top-16 left-0 h-[calc(100vh-4rem)] z-20 flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-indigo-700 select-none">Admin Panel</h2>
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 px-8 py-10">
        <h1 className="text-3xl font-bold text-indigo-800 mb-8">Admin Dashboard</h1>

        {/* Users Tab */}
        {activeTab === "users" && (
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Users</h2>
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
                      <tr key={user.id} className="border-b hover:bg-gray-50">
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
              <h2 className="text-2xl font-semibold text-indigo-700">Properties</h2>
              <div className="flex items-center gap-2">
                <label htmlFor="statusFilter" className="font-medium text-gray-700">
                  Filter by status:
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded shadow-sm focus:ring-indigo-400"
                >
                  <option value="all">All</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {loadingProps ? (
              <p className="text-indigo-600">Loading properties...</p>
            ) : filteredProperties.length === 0 ? (
              <p className="text-gray-500">No properties found.</p>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProperties.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col overflow-hidden"
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-40 w-full object-cover"
                        onClick={() => navigate(`/admin/property/${p.id}`)}
                      />
                    ) : (
                      <div
                        className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400 italic"
                        onClick={() => navigate(`/admin/property/${p.id}`)}
                      >
                        No Image
                      </div>
                    )}
                    <div className="p-4 flex-grow flex flex-col">
                      <h3
                        className="font-semibold text-lg text-indigo-800 truncate mb-1 cursor-pointer"
                        title={p.title}
                        onClick={() => navigate(`/admin/property/${p.id}`)}
                      >
                        {p.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-1">{p.location}</p>
                      <p className="text-indigo-600 font-bold mt-auto">
                        ₹ {Number(p.price).toLocaleString()}
                      </p>
                      <span
                        className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full select-none ${
                          p.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.status}
                      </span>
                      <div className="mt-4 flex gap-2">
                        {p.status === "pending" && (
                          <button
                            onClick={() => handleApprove(p.id)}
                            className="flex-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition py-1"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(p)}
                          className="flex-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="flex-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Newly Listed Tab */}
        {activeTab === "newly_listed" && (
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Newly Listed Properties</h2>

            {loadingProps ? (
              <p className="text-indigo-600">Loading properties...</p>
            ) : approved.length === 0 ? (
              <p className="text-gray-500">No approved properties found.</p>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {approved.map((prop) => {
                  // Use inner component for local state
                  return (
                    <NewlyListedPropertyCard
                      key={prop.id}
                      prop={prop}
                      positions={positions}
                      setPositions={setPositions}
                      markNewlyListed={markNewlyListed}
                      fetchProperties={fetchProperties}
                    />
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Edit Modal */}
        {editingProperty && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            onClick={() => setEditingProperty(null)}
          >
            <div
              className="bg-white rounded p-6 w-96 max-w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Edit Property</h3>
              <label className="block mb-2 font-medium text-gray-700">Title</label>
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded mb-3"
              />
              <label className="block mb-2 font-medium text-gray-700">Location</label>
              <input
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded mb-3"
              />
              <label className="block mb-2 font-medium text-gray-700">Price</label>
              <input
                name="price"
                type="number"
                value={editForm.price}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded mb-3"
              />
              <label className="block mb-2 font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded mb-3"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
              <label className="block mb-2 font-medium text-gray-700">Image (URL or Upload)</label>
              <input
                type="text"
                name="image"
                value={typeof editForm.image === "string" ? editForm.image : ""}
                onChange={handleEditChange}
                placeholder="Image URL"
                className="w-full border px-3 py-2 rounded mb-3"
              />
              {/* Image file upload (optional) */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setEditForm((prev) => ({ ...prev, image: file }));
                  }
                }}
                className="mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
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
        )}
      </main>
    </div>
  );
}

// Newly Listed Property Card component with controlled inputs fixed
function NewlyListedPropertyCard({ prop, positions, setPositions, markNewlyListed, fetchProperties }) {
  // Ensure position is always a number, default 0
  const initialPosition = positions[prop.id] ?? 0;
  const [position, setPosition] = useState(initialPosition);
  const [isNewlyListed, setIsNewlyListed] = useState(false);

  // Update position in parent state on change
  const handlePositionChange = (e) => {
    const val = e.target.value;
    const numVal = val === "" ? "" : Number(val);
    // Accept only numbers or empty string (for clearing input)
    if (val === "" || (!isNaN(numVal) && numVal >= 0)) {
      setPosition(numVal);
      setPositions((prev) => ({ ...prev, [prop.id]: numVal }));
    }
  };

  const handleCheckboxChange = (e) => {
    setIsNewlyListed(e.target.checked);
  };

  const handleSubmit = async () => {
    if (!isNewlyListed) {
      alert("Please check the box to mark as newly listed.");
      return;
    }
    if (position === "" || position < 0) {
      alert("Please enter a valid non-negative position number.");
      return;
    }
    try {
      await markNewlyListed(prop.id, { position });
      alert("Property marked as newly listed!");
      setIsNewlyListed(false);
      setPosition(0);
      setPositions((prev) => ({ ...prev, [prop.id]: 0 }));
      fetchProperties();
    } catch (err) {
      console.error("Error marking newly listed property", err);
      alert("Failed to mark newly listed.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
      {prop.image ? (
        <img
          src={prop.image}
          alt={prop.title}
          className="h-40 w-full object-cover rounded"
        />
      ) : (
        <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400 italic rounded">
          No Image
        </div>
      )}
      <h3 className="font-semibold text-lg text-indigo-700 truncate">{prop.title}</h3>
      <p className="text-gray-600">{prop.location}</p>
      <p className="text-indigo-600 font-bold">₹ {Number(prop.price).toLocaleString()}</p>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`newly-listed-${prop.id}`}
          checked={isNewlyListed}
          onChange={handleCheckboxChange}
          className="w-4 h-4 cursor-pointer"
        />
        <label htmlFor={`newly-listed-${prop.id}`} className="cursor-pointer select-none">
          Mark as Newly Listed
        </label>
      </div>
      <div>
        <label htmlFor={`position-${prop.id}`} className="block text-sm font-medium text-gray-700 mb-1">
          Position:
        </label>
        <input
          id={`position-${prop.id}`}
          type="number"
          min={0}
          value={position === "" ? "" : position}
          onChange={handlePositionChange}
          className="w-full border rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!isNewlyListed || position === "" || position < 0}
        className={`w-full py-2 mt-2 rounded text-white font-semibold ${
          isNewlyListed && position !== "" && position >= 0
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Submit
      </button>
    </div>
  );
}
