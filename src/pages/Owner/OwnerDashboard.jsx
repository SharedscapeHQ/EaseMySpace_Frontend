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
import { getDeletedProperties, restorePropertyById } from "../../api/ownerApi";
import { logoutUser } from "../../api/authApi";
import { toast } from "react-hot-toast";

import Sidebar from "../../components/AdminPageComp/Sidebar";
import EditModal from "../../components/AdminPageComp/EditModal";
import PropertyCard from "../../components/AdminPageComp/PropertyCard";
import NewlyListedCard from "../../components/AdminPageComp/NewlyListedCard";
import LeadsTable from "../../components/AdminPageComp/LeadsTable";
import PendingQueries from "../../components/AdminPageComp/PendingQueries";
import DeletedPropertyCard from "../../components/OwnerPageComp/DeletedProperties";
import { FiSearch } from "react-icons/fi";
import ManageTopLocations from "../../components/AdminPageComp/ManageTopLocations";
import UserAccessControl from "../../components/OwnerPageComp/UserAccessControl";
import UltimateSubscribers from "../../components/AdminPageComp/UltimateSubscribers";
import CareersPage from "../../components/HrUserComp/CareersPage";
import OldProperties from "../../components/AdminPageComp/OldProperties";
import RequestsTable from "../../components/AdminPageComp/RequestsPage";
import RequirementReq from "../../components/AdminPageComp/RequirementReq";
import SendSMSForm from "../../components/AdminPageComp/SendSMSForm";
import RMAssignments from "../../components/OwnerPageComp/RMAssignments";
import VisitorsTable from "../../components/OwnerPageComp/VisitorsTable";
import Marketing from "../../components/AdminPageComp/Marketing";
import WithdrawalRequests from "../../components/OwnerPageComp/WithdrawalRequests";
import Maid_profiles from "../../components/AdminPageComp/Maid_profiles/Maid_profiles";
import WithdrawalRequestsAgent from "../../components/OwnerPageComp/WithdrawalRequestsAgent";
import AllMaidBookings from "../../components/AdminPageComp/Maid_profiles/AllMaidBookings";
import RentPaymentsDashboard from "../../components/OwnerPageComp/RentPaymentsDashboard";
import LandlordWithdrawals from "../../components/OwnerPageComp/LandlordWithdrawals";
import LandlordAgents from "../../components/AdminPageComp/LandlordAgents";
import LandlordLedgerSummary from "../../components/AdminPageComp/LandlordLedgerSummary";
import RequestsTableLandlord from "../../components/AdminPageComp/RequestPageLandlord";
import ContactSalesTable from "../../components/AdminPageComp/ContactSalesTable";
import PlatformRevenueTable from "../../components/OwnerPageComp/PlatformRevenueTable";
import ManagePropertyReport from "../../components/AdminPageComp/ManagePropertyReport"
import MyProfile from "../../components/UserPageComp/MyProfile";



export default function OwnerDashboard() {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const [activeTab, setActiveTab] = useState("MyProfile");

  // Leads state
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  // Properties state
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingProps, setLoadingProps] = useState(true);

  // Queries state
  const [pendingQueries, setPendingQueries] = useState([]);
  const [loadingQueries, setLoadingQueries] = useState(true);

  // Deleted properties state
  const [deletedProperties, setDeletedProperties] = useState([]);
  const [loadingDeletedProps, setLoadingDeletedProps] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  // Editing state
  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    price: "",
    status: "pending",
    is_newly_listed: false,
    newly_listed_position: "",
  });

  // Scroll to top when tab changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0 });
    }
  }, [activeTab]);

  // Fetch leads
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

  // Fetch properties
  useEffect(() => {
    fetchProperties();
  }, []);

  // Fetch queries
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

  // Fetch deleted properties only when needed
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

  const fetchProperties = async () => {
  try {
    setLoadingProps(true);

    const { data } = await getAllProperties();

    // Ensure always an array, and normalize pricing
    const safeData = Array.isArray(data)
      ? data.map((prop) => ({
          ...prop,
          pricing: Array.isArray(prop.pricing) ? prop.pricing : [],
        }))
      : [];

    setProperties(safeData);
  } catch (err) {
    console.error("Error loading properties:", err);
    toast.error("Error loading properties");
    setProperties([]);
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
    // Pull price and deposit from first pricing entry
    price: property.pricing?.[0]?.price ?? "",       // fallback to empty string
    deposit: property.pricing?.[0]?.deposit ?? "",   // fallback to empty string

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
          

          {activeTab === "Users" && <UserAccessControl />}

          {activeTab === "Leads" && (
            <section>
              <h2 style={{ fontFamily: "para_font" }} className="text-xl font-semibold mb-4">Leads</h2>
              {loadingLeads ? (
                <p>Loading leads...</p>
              ) : (
                <LeadsTable leads={leads} />
              )}
            </section>
          )}

           {activeTab === "Requests" && (
                      <section>
                        <RequestsTable />
                      </section>
                    )}

                    {activeTab === "RMAssignments" && (
                      <section>
                        <RMAssignments />
                      </section>
                    )}

                     {activeTab === "SendSMS" && (
                                <section> 
                                  <SendSMSForm />
                                </section>
                              )}

                    {activeTab === "PostRequirement" && (
            <section>
              <RequirementReq />
            </section>
          )}
          

          {activeTab === "Properties" && (
            <section>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 style={{ fontFamily: "para_font" }} className="text-xl font-semibold">Properties</h2>

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
              <h2
                style={{ fontFamily: "universal_font" }}
                className="text-xl mb-4"
              >
                Featured Listing
              </h2>
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
              <h2 style={{ fontFamily: "para_font" }} className="text-xl font-semibold mb-4">
                Manage Top Locations
              </h2>
              <ManageTopLocations />
            </section>
          )}

          {/* pending queries  */}
          {activeTab === "PendingQueries" && (
            <section>
              <h2 style={{ fontFamily: "para_font" }} className="text-xl font-semibold mb-4">
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
              <h2 style={{ fontFamily: "para_font" }} className="text-xl font-semibold mb-4">Deleted Properties</h2>
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

          {activeTab === "UltimateSubscribers" && (
            <section>
              <UltimateSubscribers />
            </section>
          )}
          {activeTab === "VisitTrack" && (
            <section>
              <VisitorsTable />
            </section>
          )}

          {activeTab === "Careers" && <CareersPage />}

           {activeTab === "OldProperties" && (
                      <section>
                        <OldProperties />
                      </section>
                    )}

                              {activeTab === "Marketing" && <Marketing />}
                              {activeTab === "Withdrawals" && <WithdrawalRequests />}
                                        {/* {activeTab === "allWorkerProfiles" && <Maid_profiles />}
                                        {activeTab === "AgentWithdrawals" && <WithdrawalRequestsAgent />}
                                        {activeTab === "maidBookings" && <AllMaidBookings />} */}
                                                  {activeTab === "allAccounts" && <LandlordAgents />}
                              
                 {activeTab === "RentPayments" && <RentPaymentsDashboard />}
          {activeTab === "RentWithdrawals" && <LandlordWithdrawals />}
                                        {activeTab === "TallyReports" && <LandlordLedgerSummary />}
                                        {activeTab === "RequestsLandlord" && <ContactSalesTable />}
                                        {activeTab === "ComplaintLandlord" && <RequestsTableLandlord />}
                                        {activeTab === "platformRevenue" && <PlatformRevenueTable />}
                                        {activeTab === "PropertyReports" && <ManagePropertyReport />}
                                        {activeTab === "MyProfile" && <MyProfile />}
                                        
                    

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
