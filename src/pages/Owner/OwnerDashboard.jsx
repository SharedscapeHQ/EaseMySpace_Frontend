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
} from "../../api/adminApi";
import {
  getAllUsers,
  updateUserRole,
  deleteUserById,
  getDeletedProperties,
  restorePropertyById,
} from "../../api/ownerApi";
import { logoutUser } from "../../api/authAPI";
import { toast } from "react-hot-toast";

import Sidebar from "../../components/AdminPageComp/Sidebar";
import EditModal from "../../components/AdminPageComp/EditModal";
import PropertyCard from "../../components/AdminPageComp/PropertyCard";
import NewlyListedCard from "../../components/AdminPageComp/NewlyListedCard";
import LeadsTable from "../../components/AdminPageComp/LeadsTable";
import PropertyPieChart from "../../components/AdminPageComp/PropertyPieChart";
import PendingQueries from "../../components/AdminPageComp/PendingQueries";
import DeletedPropertyCard from "../../components/OwnerPageComp/DeletedProperties";
import { FiSearch } from "react-icons/fi";
import ManageTopLocations from "../../components/AdminPageComp/ManageTopLocations";

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

  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    if (activeTab === "DeletedProperties") fetchDeletedProperties();
  }, [activeTab]);

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

  const handleRestore = async (id) => {
    try {
      await restorePropertyById(id);
      toast.success("Property restored");
      fetchDeletedProperties();
      fetchProperties();
    } catch {
      toast.error("Failed to restore property");
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

  const searchedProperties = filteredProperties.filter((p) =>
    `${p.title} ${p.location} ${p.description || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const approved = properties.filter((p) => p.status === "approved");

  const pieData = [
    { name: "Approved", value: approved.length, color: "#16a34a" },
    {
      name: "Pending",
      value: properties.filter((p) => p.status === "pending").length,
      color: "#facc15",
    },
    {
      name: "Rejected",
      value: properties.filter((p) => p.status === "rejected").length,
      color: "#dc2626",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar
        role="Owner"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        pendingCount={
          pendingQueries.filter(
            (q) => q.resolved === false || q.resolved === "false"
          ).length
        }
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
        Subscription
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
    {users.map((u) => {
      const status = u.subscription_status?.trim().toLowerCase();
      const expiry = u.subscription_expiry;
      const formattedExpiry =
        expiry && !isNaN(new Date(expiry))
          ? new Date(expiry).toLocaleDateString()
          : "-";

      return (
        <tr key={u.id} className="hover:bg-gray-50">
          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center align-middle">
            {u.firstName} {u.lastName}
          </td>

          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center align-middle">
            <div>{u.email || <span className="italic text-gray-400">N/A</span>}</div>
            <div className="mt-1">{u.phone || <span className="italic text-gray-400">N/A</span>}</div>
          </td>

          <td className="px-6 py-4 whitespace-nowrap text-sm text-center align-middle">
            <div>
              {status === "paid" ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
                  Paid
                </span>
              ) : status === "unpaid" ? (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
                  Unpaid
                </span>
              ) : (
                <span className="text-gray-400 italic text-sm">N/A</span>
              )}
            </div>
            <div className="mt-1 text-gray-500">{formattedExpiry}</div>
          </td>

          <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
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
      );
    })}
  </tbody>
</table>



</div>

              )}
            </section>
          )}

          {activeTab === "Leads" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Leads</h2>
              {loadingLeads ? (
                <p>Loading leads...</p>
              ) : (
                <LeadsTable leads={leads} />
              )}
            </section>
          )}

          {activeTab === "Properties" && (
            <section>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold">Properties</h2>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <div className="relative w-full sm:w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <FiSearch />
                    </span>
                    <input
                      type="text"
                      placeholder="Search by title, location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-3 py-1 border border-gray-300 rounded w-full outline-blue-500"
                    />
                  </div>
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
              </div>

              <PropertyPieChart data={pieData} />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {searchedProperties.map((property) => (
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
                  .slice() // to avoid mutating original array
                  .sort((a, b) => {
                    const aListed = a.is_newly_listed;
                    const bListed = b.is_newly_listed;

                    if (aListed && bListed) {
                      return (
                        (a.newly_listed_position || 9999) -
                        (b.newly_listed_position || 9999)
                      );
                    }

                    if (aListed) return -1; // listed first
                    if (bListed) return 1;

                    return 0; // keep others as-is
                  })
                  .map((property) => (
                    <NewlyListedCard
                      key={property.id}
                      property={property}
                      markNewlyListed={markNewlyListed}
                      fetchProperties={fetchProperties}
                      allProperties={properties}
                    />
                  ))}
              </div>
            </section>
          )}

          {activeTab === "ManageLocations" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Manage Top Locations
              </h2>
              <ManageTopLocations />
            </section>
          )}

          {/* pending queries  */}
          {activeTab === "PendingQueries" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Pending Edit Queries
              </h2>
              {loadingQueries ? (
                <p>Loading queries...</p>
              ) : (
                <PendingQueries queries={pendingQueries} />
              )}
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
                    <DeletedPropertyCard
                      key={property.id}
                      property={property}
                      onRestore={handleRestore}
                    />
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
