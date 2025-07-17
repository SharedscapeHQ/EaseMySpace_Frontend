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
import { logoutUser } from "../../API/authAPI";
import { toast } from "react-hot-toast";

// Components
import Sidebar from "../../components/AdminPageComp/Sidebar";
import EditModal from "../../components/AdminPageComp/EditModal";
import PropertyCard from "../../components/AdminPageComp/PropertyCard";
import NewlyListedCard from "../../components/AdminPageComp/NewlyListedCard";
import LeadsTable from "../../components/AdminPageComp/LeadsTable";
import PropertyPieChart from "../../components/AdminPageComp/PropertyPieChart";
import PendingQueries from "../../components/AdminPageComp/PendingQueries"

export default function AdminDashboard() {
  const navigate = useNavigate();
  const mainRef = useRef(null);

  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("Leads");

  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingProps, setLoadingProps] = useState(true);

  const [pendingQueries, setPendingQueries] = useState([]);
const [loadingQueries, setLoadingQueries] = useState(true);

  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    price: "",
    status: "pending",
    is_newly_listed: false,
    newly_listed_position: "",
  });

  // Scroll to top on tab change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0 });
    }
  }, [activeTab]);

  // Load Leads
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

  // Load Properties
  useEffect(() => {
    fetchProperties();
  }, []);

  // Load raised queries 
  useEffect(() => {
  (async () => {
    try {
      setLoadingQueries(true);
      const { data } = await fetchPendingQueries(); // create this API
      setPendingQueries(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Error loading edit queries");
    } finally {
      setLoadingQueries(false);
    }
  })();
}, []);

  const fetchProperties = async () => {
    try {
      setLoadingProps(true);
      const { data } = await getAllProperties();
      setProperties(Array.isArray(data) ? data : []);
    //  console.log("Verified value:", data.map(p => p.verified));

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
    {
      name: "Approved",
      value: approved.length,
      color: "#16a34a",
    },
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
      role="Admin"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        pendingCount={pendingQueries.length}
      />

      <main
        ref={mainRef}
className="flex-1 bg-gray-50 lg:ml-64"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-800 mb-6">
            Admin Dashboard
          </h1>

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
  .slice() // to avoid mutating original array
  .sort((a, b) => {
    const aListed = a.is_newly_listed;
    const bListed = b.is_newly_listed;

    if (aListed && bListed) {
      return (a.newly_listed_position || 9999) - (b.newly_listed_position || 9999);
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
    />
))}

              </div>
            </section>
          )}

          {/* pending queries  */}
          {activeTab === "PendingQueries" && (
  <section>
    <h2 className="text-xl font-semibold mb-4">Pending Edit Queries</h2>
    {loadingQueries ? (
      <p>Loading queries...</p>
    ) : (
      <PendingQueries queries={pendingQueries} />
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
