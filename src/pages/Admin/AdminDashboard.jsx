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
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
    status: "pending",
  });

  useEffect(() => {
    (async () => {
      try {
        setLoadingUsers(true);
        const { data } = await getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching users", err);
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoadingProps(true);
      const { data } = await getAllProperties();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching properties", err);
    } finally {
      setLoadingProps(false);
    }
  };

  const handleApprove = async (id) => {
    await approveProperty(id);
    fetchProperties();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this property?")) {
      await deleteProperty(id);
      fetchProperties();
    }
  };

  const openEditModal = (property) => {
    setEditingProperty(property);
    setEditForm({
      title: property.title || "",
      location: property.location || "",
      price: property.price || "",
      status: property.status || "pending",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      await editProperty(editingProperty.id, {
        ...editForm,
        id: editingProperty.id,
      });
      alert("Property updated");
      setEditingProperty(null);
      await fetchProperties();
    } catch (err) {
      console.error("Error updating property", err.response?.data || err);
      alert("Error updating property");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const filteredProperties = Array.isArray(properties)
    ? statusFilter === "all"
      ? properties
      : properties.filter((p) => p.status?.toLowerCase() === statusFilter)
    : [];

  const approved = properties.filter((p) => p.status === "approved");
  const pending = properties.filter((p) => p.status === "pending");
  const rejected = properties.filter((p) => p.status === "rejected");

  const pieData = [
    { name: "Approved", value: approved.length, color: "#16a34a" },
    { name: "Pending", value: pending.length, color: "#facc15" },
    { name: "Rejected", value: rejected.length, color: "#dc2626" },
  ];

  return (
    <div className="flex flex-col lg:flex-row">
      <aside className="w-full lg:w-64 bg-white shadow-lg p-6 border-r">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          {["users", "properties", "newly_listed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-2 rounded ${
                activeTab === tab
                  ? "bg-indigo-100 text-indigo-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {tab.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-10 px-4 py-2 text-red-600 hover:bg-red-100 rounded"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">Admin Dashboard</h1>

        {activeTab === "users" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Users</h2>
            {loadingUsers ? (
              <p>Loading...</p>
            ) : (
              <div className="overflow-auto bg-white rounded shadow p-4">
                <table className="w-full text-sm">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Phone</th>
                      <th className="p-2 text-left">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{user.name}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.phone || "-"}</td>
                        <td className="p-2 capitalize">{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "properties" && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Properties</h2>
              <select
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

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {filteredProperties.map((property) => (
                <div key={property.id} className="bg-white p-4 rounded shadow">
                  <img
                    src={Array.isArray(property.image) ? property.image[0] : property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h3 className="text-lg font-bold text-indigo-700 mt-2">{property.title}</h3>
                  <p className="text-gray-600">{property.location}</p>
                  <p className="text-indigo-900 font-bold">₹{property.price}</p>
                  <p className="text-sm text-gray-500">Owner Code: {property.owner_code || "N/A"}</p>
                  <p className="text-sm text-gray-500">Name: {property.name || "N/A"}</p>
                  <p className="text-sm text-gray-500">Phone: {property.phone || "N/A"}</p>
                  <div className="mt-3 flex gap-2">
                    {property.status === "pending" && (
                      <button onClick={() => handleApprove(property.id)} className="bg-green-600 text-white px-3 py-1 rounded">
                        Approve
                      </button>
                    )}
                    <button onClick={() => openEditModal(property)} className="bg-blue-600 text-white px-3 py-1 rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(property.id)} className="bg-red-600 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "newly_listed" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Newly Listed</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {approved.map((property) => (
                <div key={property.id} className="bg-white p-4 rounded shadow">
                  <img
                    src={Array.isArray(property.image) ? property.image[0] : property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h3 className="text-lg font-semibold text-indigo-700 mt-2">{property.title}</h3>
                  <p className="text-gray-600">{property.location}</p>
                  <p className="text-indigo-900 font-bold">₹{property.price}</p>
                  <button
                    onClick={() => markNewlyListed(property.id, true, 1).then(fetchProperties)}
                    className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    Mark as Newly Listed
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {editingProperty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
              <h3 className="text-xl font-bold">Edit Property</h3>
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                placeholder="Title"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
                placeholder="Location"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                name="price"
                value={editForm.price}
                onChange={handleEditChange}
                placeholder="Price"
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setEditingProperty(null)} className="px-4 py-2 bg-gray-300 rounded">
                  Cancel
                </button>
                <button onClick={handleEditSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
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
