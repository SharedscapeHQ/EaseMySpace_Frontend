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
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProps, setLoadingProps] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", location: "", price: "", image: "", status: "pending" });

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
    setEditForm({ title: property.title || "", location: property.location || "", price: property.price || "", image: property.image || "", status: property.status || "pending" });
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

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      const savedUser = localStorage.getItem("user");
      localStorage.removeItem("user");
      window.dispatchEvent(new StorageEvent("storage", { key: "user", oldValue: savedUser, newValue: null }));
      navigate("/");
    }
  };

  const filteredProperties = statusFilter === "all" ? properties : properties.filter((p) => p.status?.toLowerCase() === statusFilter);
  const approved = properties.filter((p) => p.status === "approved");
  const pending = properties.filter((p) => p.status === "pending");
  const rejected = properties.filter((p) => p.status === "rejected");

  const pieData = [
    { name: "Approved", value: approved.length, color: "#16a34a" },
    { name: "Pending", value: pending.length, color: "#facc15" },
    { name: "Rejected", value: rejected.length, color: "#dc2626" },
  ];

  const renderPieChart = () => (
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
          paddingAngle={5}
          label
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="flex flex-col lg:flex-row">
      <aside className="w-full lg:w-64 bg-white shadow-lg p-6 border-r">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          <button onClick={() => setActiveTab("users")} className={`text-left px-4 py-2 rounded ${activeTab === "users" ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100"}`}>Users</button>
          <button onClick={() => setActiveTab("properties")} className={`text-left px-4 py-2 rounded ${activeTab === "properties" ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100"}`}>Properties</button>
          <button onClick={() => setActiveTab("newly_listed")} className={`text-left px-4 py-2 rounded ${activeTab === "newly_listed" ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100"}`}>Newly Listed</button>
        </nav>
        <button onClick={handleLogout} className="mt-10 px-4 py-2 text-red-600 hover:bg-red-100 rounded">Logout</button>
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">Admin Dashboard</h1>

        {activeTab === "users" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Users</h2>
            {loadingUsers ? <p>Loading...</p> : (
              <div className="overflow-auto bg-white rounded shadow p-4">
                <table className="w-full text-sm">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{user.name}</td>
                        <td className="p-2">{user.email}</td>
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
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <h2 className="text-2xl font-semibold">Properties</h2>
              <div className="flex items-center gap-2">
                <label htmlFor="statusFilter">Filter:</label>
                <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-3 py-1">
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            {renderPieChart()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {filteredProperties.map((property) => (
                <div key={property.id} className="bg-white rounded shadow p-4">
                  <img src={property.image} alt={property.title} className="w-full h-48 object-cover rounded" />
                  <h3 className="text-lg font-semibold text-indigo-700 mt-2">{property.title}</h3>
                  <p className="text-gray-600">{property.location}</p>
                  <p className="text-indigo-900 font-bold">${property.price}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {property.status === "pending" && <button onClick={() => handleApprove(property.id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Approve</button>}
                    <button onClick={() => openEditModal(property)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Edit</button>
                    <button onClick={() => handleDelete(property.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "newly_listed" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Newly Listed Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approved.map((property) => (
                <div key={property.id} className="bg-white rounded shadow p-4">
                  <img src={property.image} alt={property.title} className="w-full h-48 object-cover rounded" />
                  <h3 className="text-lg font-semibold text-indigo-700 mt-2">{property.title}</h3>
                  <p className="text-gray-600">{property.location}</p>
                  <p className="text-indigo-900 font-bold">${property.price}</p>
                  <button onClick={() => markNewlyListed(property.id, true, 1).then(fetchProperties)} className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
                    Mark as Newly Listed
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
