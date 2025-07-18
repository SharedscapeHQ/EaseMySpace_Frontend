import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllLeads,
  getAllProperties,
  deleteProperty,
  approveProperty,
  editProperty,
  markNewlyListed,
  fetchPendingQueries,
} from "../../API/adminApi";
import {
  getAllUsers,
  updateUserRole,
  deleteUserById,
  getDeletedProperties,
} from "../../API/ownerApi";
import { logoutUser } from "../../API/authAPI";
import { toast } from "react-hot-toast";

import Sidebar from "../../components/AdminPageComp/Sidebar";
import EditModal from "../../components/AdminPageComp/EditModal";
import PropertyCard from "../../components/AdminPageComp/PropertyCard";
import NewlyListedCard from "../../components/AdminPageComp/NewlyListedCard";
import LeadsTable from "../../components/AdminPageComp/LeadsTable";
import PropertyPieChart from "../../components/AdminPageComp/PropertyPieChart";
import PendingQueries from "../../components/AdminPageComp/PendingQueries";
import DeletedPropertyCard from "../../components/OwnerPageComp/DeletedProperties";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Users");

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingProps, setLoadingProps] = useState(true);

  const [pendingQueries, setPendingQueries] = useState([]);
  const [loadingQueries, setLoadingQueries] = useState(true);

  const [deletedProperties, setDeletedProperties] = useState([]);
const [loadingDeletedProps, setLoadingDeletedProps] = useState(false);

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
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0 });
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "Users") fetchUsers();
  }, [activeTab]);

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

  useEffect(() => {
    (async () => {
      try {
        setLoadingQueries(true);
        const { data } = await fetchPendingQueries();
        setPendingQueries(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Error loading edit queries");
      } finally {
        setLoadingQueries(false);
      }
    })();
  }, []);

  const fetchDeletedProperties = async () => {
  try {
    setLoadingDeletedProps(true);
    const { data } = await getDeletedProperties();
    setDeletedProperties(Array.isArray(data) ? data : []);
  } catch {
    toast.error("Error loading deleted properties");
  } finally {
    setLoadingDeletedProps(false);
  }
};
useEffect(() => {
  if (activeTab === "DeletedProperties") {
    fetchDeletedProperties();
  }
}, [activeTab]);
  useEffect(() => {
      if (mainRef.current) {
        mainRef.current.scrollTo({ top: 0 });
      }
    }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoadingUsers(false);
    }
  };

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
        ? property.amenities
        : (property.amenities || "").split(",").map((a) => a.trim()),
      is_newly_listed: property.is_newly_listed || false,
      verified: property.verified === true || property.verified === "true",
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
      const updateData = {
        ...editForm,
        deposit: editForm.deposit === "" ? null : Number(editForm.deposit),
        price: editForm.price === "" ? null : Number(editForm.price),
        newly_listed_position: editForm.is_newly_listed
          ? Number(editForm.newly_listed_position)
          : null,
        amenities: Array.isArray(editForm.amenities)
          ? editForm.amenities
          : (editForm.amenities || "").split(",").map((a) => a.trim()),
        remove_image_urls: editForm.remove_image_urls || [],
        remove_video_urls: editForm.remove_video_urls || [],
        image_base64: editForm.image_base64 || [],
        video_base64: editForm.video_base64 || [],
      };

      if (
        editForm.is_newly_listed &&
        updateData.newly_listed_position !== null
      ) {
        const conflict = properties.find(
          (p) =>
            p.is_newly_listed &&
            Number(p.newly_listed_position) ===
              Number(updateData.newly_listed_position) &&
            p.id !== editingProperty.id
        );

        if (conflict) {
          const confirmReplace = window.confirm(
            `Position ${updateData.newly_listed_position} is already assigned to "${conflict.title}". Replace it?`
          );
          if (!confirmReplace) return;
        }
      }

      await editProperty(editingProperty.id, updateData);
      toast.success("Property updated successfully");
      setEditingProperty(null);
      fetchProperties();
    } catch (err) {
      console.error("Edit submit error:", err);
      toast.error("Failed to update property");
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
      : properties.filter(
          (p) => p.status?.toLowerCase() === statusFilter.toLowerCase()
        );

  const approved = properties.filter((p) => p.status === "approved");

  const pieData = [
    { name: "Approved", value: approved.length, color: "#16a34a" },
    { name: "Pending", value: properties.filter((p) => p.status === "pending").length, color: "#facc15" },
    { name: "Rejected", value: properties.filter((p) => p.status === "rejected").length, color: "#dc2626" },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar
      role="Owner"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        pendingCount={pendingQueries.filter(q => q.resolved === false || q.resolved === "false").length}
      />
      <main ref={mainRef} className="flex-1 bg-gray-50 lg:ml-64">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-800 mb-6">
            Owner Dashboard
          </h1>

          {activeTab === "Users" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Users</h2>
              {loadingUsers ? (
                <p>Loading users...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {u.firstName} {u.lastName}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{u.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize ${u.role === "admin" ? "bg-red-100 text-red-700" : u.role === "owner" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                            {u.role !== "owner" ? (
                              <>
                                <select
                                  value={u.role}
                                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm"
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

          {activeTab === "Leads" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Leads</h2>
              {loadingLeads ? <p>Loading leads...</p> : <LeadsTable leads={leads} />}
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

              <PropertyPieChart data={pieData} />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onApprove={handleApprove}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {activeTab === "NewlyListed" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Newly Listed</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approved
                  .slice()
                  .sort((a, b) => {
                    if (a.is_newly_listed && b.is_newly_listed) {
                      return (a.newly_listed_position || 9999) - (b.newly_listed_position || 9999);
                    }
                    if (a.is_newly_listed) return -1;
                    if (b.is_newly_listed) return 1;
                    return 0;
                  })
                  .map((property) => (
                    <NewlyListedCard
                      key={property.id}
                      property={property}
                      markNewlyListed={markNewlyListed}
                      fetchProperties={fetchProperties}
                    />
                  ))}
              </div>
            </section>
          )}

          {activeTab === "PendingQueries" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Pending Edit Queries</h2>
              {loadingQueries ? <p>Loading queries...</p> : <PendingQueries queries={pendingQueries} />}
            </section>
          )}

          {activeTab === "DeletedProperties" && (
  <section>
    <h2 className="text-xl font-semibold mb-4">Deleted Properties</h2>
    {loadingDeletedProps ? (
      <p>Loading deleted properties...</p>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deletedProperties.map((property) => (
          <DeletedPropertyCard key={property.id} property={property} />
        ))}
      </div>
    )}
  </section>
)}


          <EditModal
            editForm={editForm}
            setEditForm={setEditForm}
            editingProperty={editingProperty}
            setEditingProperty={setEditingProperty}
            handleEditChange={handleEditChange}
            handleEditSubmit={handleEditSubmit}
          />
        </div>
      </main>
    </div>
  );
}