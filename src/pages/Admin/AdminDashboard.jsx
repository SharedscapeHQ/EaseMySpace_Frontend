// Ensure `markNewlyListed` accepts (id, isNewlyListed: boolean, position: number | null)

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllLeads,
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
import { Toaster, toast } from "react-hot-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingProps, setLoadingProps] = useState(true);
  const [activeTab, setActiveTab] = useState("Leads");
  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    price: "",
    status: "pending",
    is_newly_listed: false,
    newly_listed_position: "",
  });

  useEffect(() => {
    (async () => {
      try {
        setLoadingLeads(true);
        const { data } = await getAllLeads();
        setLeads(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Error loading leads");
      } finally {
        setLoadingLeads(false);
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
    } catch {
      toast.error("Error loading properties");
    } finally {
      setLoadingProps(false);
    }
  };

  const handleApprove = async (id) => {
    await approveProperty(id);
    toast.success("Property approved");
    fetchProperties();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this property?")) {
      await deleteProperty(id);
      toast.success("Property deleted");
      fetchProperties();
    }
  };

  const openEditModal = (property) => {
  setEditingProperty(property);
  setEditForm({
    ...property,
    amenities: Array.isArray(property.amenities)
      ? property.amenities.join(", ")
      : property.amenities || "",
    is_newly_listed: property.is_newly_listed || false,
    newly_listed_position: property.newly_listed_position || "",
  });
};

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

 const handleEditSubmit = async () => {
  try {
    // Prepare update data
    const updateData = {
      ...editForm,
      amenities: editForm.amenities
        ? editForm.amenities.split(",").map((a) => a.trim())
        : [],
      newly_listed_position: editForm.is_newly_listed
        ? Number(editForm.newly_listed_position)
        : null,
    };

    await editProperty(editingProperty.id, updateData);
    toast.success("Property updated");
    setEditingProperty(null);
    fetchProperties();
  } catch (err) {
    toast.error("Update failed");
    console.error("Edit submit error:", err);
  }
};

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const filteredProperties =
    statusFilter === "all"
      ? properties
      : properties.filter((p) => p.status?.toLowerCase() === statusFilter);

  const approved = properties.filter((p) => p.status === "approved");
  const newlyListed = approved.filter((p) => p.is_newly_listed);

  const pieData = [
    { name: "Approved", value: approved.length, color: "#16a34a" },
    { name: "Pending", value: properties.filter((p) => p.status === "pending").length, color: "#facc15" },
    { name: "Rejected", value: properties.filter((p) => p.status === "rejected").length, color: "#dc2626" },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Toaster />
      <aside className="w-full lg:w-64 bg-white shadow-md p-6 border-r">
        <h2 className="text-xl font-bold text-indigo-700 mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {["Leads", "Properties", "Newly_listed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`block w-full text-left px-4 py-2 rounded transition ${
                activeTab === tab
                  ? "bg-indigo-100 text-indigo-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-10 w-full text-red-600 hover:bg-red-100 px-4 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h1 className="text-2xl font-bold text-indigo-800 mb-6">Admin Dashboard</h1>

        {activeTab === "Leads" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Leads</h2>
            {loadingLeads ? (
              <p>Loading leads...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm bg-white rounded shadow">
                  <thead className="bg-indigo-100">
                    <tr>
                      <th className="p-2 text-left">Phone</th>
                      <th className="p-2 text-left">Source</th>
                      <th className="p-2 text-left">First Seen</th>
                      <th className="p-2 text-left">Last Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{lead.phone}</td>
                        <td className="p-2">{lead.source || "-"}</td>
                        <td className="p-2">{lead.first_seen ? new Date(lead.first_seen).toLocaleString() : "-"}</td>
                        <td className="p-2">{lead.last_verified_at ? new Date(lead.last_verified_at).toLocaleString() : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "Properties" && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Properties</h2>
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredProperties.map((property) => (
                <div key={property.id} className="bg-white rounded shadow overflow-hidden">
                  <img
                    src={Array.isArray(property.image) ? property.image[0] : property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-1">
                    <h3 className="text-lg font-bold text-indigo-700">{property.title}</h3>
                    <p className="text-gray-600">{property.location}</p>
                    <p className="text-indigo-900 font-semibold">₹{property.price}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {property.status === "pending" && (
                        <button
                          onClick={() => handleApprove(property.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(property)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "Newly_listed" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Newly Listed</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {property.is_newly_listed ? (
                    <>
                      <p className="text-sm text-green-600 mt-2">Listed Position: {property.newly_listed_position || "-"}</p>
                      <button
                        onClick={() =>
                          markNewlyListed(property.id, false, null).then(fetchProperties)
                        }
                        className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                      >
                        Remove from Newly Listed
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        markNewlyListed(property.id, true, 1).then(fetchProperties)
                      }
                      className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    >
                      Mark as Newly Listed
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

     {editingProperty && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-bold mb-4">Edit Property</h3>

      {[
        ["title", "Title"],
        ["location", "Location"],
        ["price", "Price"],
        ["deposit", "Deposit"],
        ["flat_status", "Flat Status"],
        ["status", "Status", "select", ["pending", "approved", "rejected"]],
        ["bhk_type", "BHK Type", "select", ["1 BHK", "1.5 BHK", "2 BHK", "2.5 BHK", "3 BHK", "4 BHK"]],
        ["bhk", "BHK"],
        ["bathrooms", "Bathrooms"],
        ["floor_number", "Floor Number"],
        ["total_floors", "Total Floors"],
        ["property_size", "Property Size"],
        ["property_type", "Property Type"],
        ["furnishing", "Furnishing", "select", ["unfurnished", "semi-furnished", "fully-furnished"]],
        ["parking", "Parking"],
        ["facing", "Facing"],
        ["balcony", "Balcony"],
        ["age_of_property", "Age of Property"],
        ["owner_code", "Owner Code"],
        ["looking_for", "Looking For", "select", ["flatmate", "vacant"]],
        ["occupancy", "Occupancy", "select", ["single", "double", "triple"]],
        ["distance_from_station", "Distance from Station"],
        ["gender", "Gender", "select", ["male", "female", "others"]],
        ["owner_phone", "Owner Phone"]
      ].map(([field, label, type = "text", options = []]) => (
        <div key={field} className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          {type === "select" ? (
            <select
              name={field}
              value={editForm[field] || ""}
              onChange={handleEditChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={field}
              value={editForm[field] || ""}
              onChange={handleEditChange}
              className="w-full border px-3 py-2 rounded"
            />
          )}
        </div>
      ))}

      {/* ✅ Amenities Section before description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Amenities</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            "wifi",
            "parking",
            "air conditioning",
            "refrigerator",
            "washing machine",
            "cctv",
            "security",
            "geyser",
            "lift",
            "power backup",
            "furniture",
            "tv",
            "gas connection",
          ].map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={
                  Array.isArray(editForm.amenities)
                    ? editForm.amenities.includes(amenity)
                    : (editForm.amenities || "").split(",").map((a) => a.trim()).includes(amenity)
                }
                onChange={(e) => {
                  const selected = e.target.checked;
                  setEditForm((prev) => {
                    let current = Array.isArray(prev.amenities)
                      ? [...prev.amenities]
                      : (prev.amenities || "").split(",").map((a) => a.trim());

                    const updated = selected
                      ? [...new Set([...current, amenity])]
                      : current.filter((a) => a !== amenity);

                    return {
                      ...prev,
                      amenities: updated,
                    };
                  });
                }}
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      {/* ✅ Description comes after amenities */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={editForm.description || ""}
          onChange={handleEditChange}
          className="w-full border px-3 py-2 rounded"
          rows={3}
        />
      </div>

      {/* ✅ Newly Listed Toggle */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          name="is_newly_listed"
          checked={!!editForm.is_newly_listed}
          onChange={(e) =>
            setEditForm((prev) => ({
              ...prev,
              is_newly_listed: e.target.checked,
            }))
          }
        />
        <label className="text-sm">Mark as Newly Listed</label>
      </div>

      {editForm.is_newly_listed && (
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Newly Listed Position</label>
          <input
            type="number"
            name="newly_listed_position"
            value={editForm.newly_listed_position || ""}
            onChange={handleEditChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      )}

      {/* ✅ Action Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setEditingProperty(null)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleEditSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
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
