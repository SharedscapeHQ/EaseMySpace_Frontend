import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllLeads,
  getAllProperties,
  deleteProperty,
  approveProperty,
  editProperty,
  markNewlyListed,
  markTopPG,
  fetchPendingQueries,
} from "../../api/adminApi";
import { getAllUsers } from "../../api/ownerApi";
import { logoutUser } from "../../api/authApi";
import { toast } from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

// Components
import Sidebar from "../../components/AdminPageComp/Sidebar";
import EditModal from "../../components/AdminPageComp/EditModal";
import PropertyCard from "../../components/AdminPageComp/PropertyCard";
import LeadsTable from "../../components/AdminPageComp/LeadsTable";
import PendingQueries from "../../components/AdminPageComp/PendingQueries";
import ManageTopLocations from "../../components/AdminPageComp/ManageTopLocations";
import UltimateSubscribers from "../../components/AdminPageComp/UltimateSubscribers";
import OldProperties from "../../components/AdminPageComp/OldProperties";
import RequestsTable from "../../components/AdminPageComp/RequestsPage";
import RequirementReq from "../../components/AdminPageComp/RequirementReq";
import SendSMSForm from "../../components/AdminPageComp/SendSMSForm";
import Marketing from "../../components/AdminPageComp/Marketing";
import RentPaymentsDashboard from "../../components/OwnerPageComp/RentPaymentsDashboard";
import LandlordAgents from "../../components/AdminPageComp/LandlordAgents";
import LandlordLedgerSummary from "../../components/AdminPageComp/LandlordLedgerSummary";
import RequestsTableLandlord from "../../components/AdminPageComp/RequestPageLandlord";
import ContactSalesTable from "../../components/AdminPageComp/ContactSalesTable";
import ManagePropertyReport from "../../components/AdminPageComp/ManagePropertyReport";
import MyProfile from "../../components/UserPageComp/MyProfile";
import PostPermissionRequests from "../../components/AdminPageComp/PostPermissionRequests";
import BookingSchedule from "../../components/RmUserComp/BookingSchedule";
import UsersTable from "../../components/AdminPageComp/UsersTable";
import FeaturePropertySection from "../../components/AdminPageComp/FeaturePropertySection";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const mainRef = useRef(null);

  const [modalUser, setModalUser] = useState(null);

  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("MyProfile");

  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingProps, setLoadingProps] = useState(true);

  const [pendingQueries, setPendingQueries] = useState([]);
  const [loadingQueries, setLoadingQueries] = useState(true);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [users, setUsers] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [lookingForFilter, setLookingForFilter] = useState("all");

  const [editingProperty, setEditingProperty] = useState(null);
  const [removedOccupancies, setRemovedOccupancies] = useState([]);
  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    price: "",
    status: "pending",
    is_newly_listed: false,
    newly_listed_position: "",
    meals_included: false,
    additional_charges: "",
  });

  // Scroll to top on tab change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0 });
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "Users") {
      fetchUsers();
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

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await getAllUsers();

      const sortedUsers = [...data].sort((a, b) => b.id - a.id);

      setUsers(sortedUsers);
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

  const handleApprove = async (propertyId) => {
    try {
      await approveProperty(propertyId);

      toast.success("Property approved successfully");
      fetchProperties();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to approve property";

      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this property?")) {
      await deleteProperty(id);
      toast.success("Property deleted");
      fetchProperties();
    }
  };

  const openEditModal = (property) => {
    setRemovedOccupancies([]);

    // ✅ Group flat pricing rows by room_name
    const roomMap = {};
    if (Array.isArray(property.pricing)) {
      property.pricing.forEach((p) => {
        const key = p.room_name || "default";
        if (!roomMap[key]) {
          roomMap[key] = { room_name: key, occupancies: [] };
        }
        roomMap[key].occupancies.push({
          occupancy: p.occupancy,
          price: p.price,
          deposit: p.deposit,
          locking_options: (p.locking_options || []).map((l) => ({
            lockin: l.period, // 👈 IMPORTANT
            deduction: l.deduction ?? 0,
          })),
        });
      });
    }
    const groupedPricing = Object.values(roomMap);

    setEditingProperty(property);
    setEditForm({
      ...property,
      pricing: groupedPricing,
      price: property.pricing?.[0]?.price ?? "",
      deposit: property.pricing?.[0]?.deposit ?? "",
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
        removed_occupancies: removedOccupancies,
      };

      updateData.pricing = (editForm.pricing || []).map((room) => ({
  ...room,
  occupancies: (room.occupancies || []).map((occ) => ({
    ...occ,

    // ✅ ONLY send locking if it exists
    ...(occ.locking_options && occ.locking_options.length > 0
      ? {
          locking_options: occ.locking_options.map((lock) => ({
            period: lock.period || lock.lockin,

            // ✅ ONLY include deduction if it already exists
            ...(lock.deduction !== undefined && lock.deduction !== null
              ? { deduction: lock.deduction }
              : {}),
          })),
        }
      : {}), 
  })),
}));

      if (
        editForm.is_newly_listed &&
        updateData.newly_listed_position !== null
      ) {
        const conflict = properties.find(
          (p) =>
            p.is_newly_listed &&
            Number(p.newly_listed_position) ===
              Number(updateData.newly_listed_position) &&
            p.id !== editingProperty.id,
        );

        if (conflict) {
          const confirmReplace = window.confirm(
            `Position ${updateData.newly_listed_position} is already assigned to "${conflict.title}". Replace it?`,
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

  const searchedProperties = properties.filter((p) => {
    const query = searchQuery.toLowerCase();

    return (
      p.title?.toLowerCase().includes(query) ||
      p.location?.toLowerCase().includes(query)
    );
  });

  const finalProperties = searchedProperties
    .filter((p) => (statusFilter === "all" ? true : p.status === statusFilter))
    .filter((p) => (sourceFilter === "all" ? true : p.source === sourceFilter))
    .filter((p) =>
      lookingForFilter === "all"
        ? true
        : p.looking_for?.toLowerCase() === lookingForFilter,
    )
    .filter((p) => {
      if (ageFilter === "all") return true;

      const createdDate = new Date(p.created_at);
      const now = new Date();

      const monthsAgo = new Date();
      monthsAgo.setMonth(now.getMonth() - Number(ageFilter));

      return createdDate <= monthsAgo;
    });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar
        role="Admin"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        pendingCount={
          pendingQueries.filter(
            (q) => q.resolved === false || q.resolved === "false",
          ).length
        }
      />

      <main ref={mainRef} className="flex-1 bg-gray-50 lg:ml-64">
        <div className="p-6">
          {activeTab === "Users" && (
            <section className="mt-6">
              <h2
                style={{ fontFamily: "para_font" }}
                className="text-2xl  mb-6 text-gray-800"
              >
                Users
              </h2>

              {loadingUsers ? (
                <p className="text-gray-500">Loading users...</p>
              ) : (
                <UsersTable users={users} />
              )}

              {/* Referrer Modal */}
              {modalUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
                    <h3 className="text-lg  mb-4">Referrer Details</h3>
                    <p>
                      <strong>Name:</strong> {modalUser.firstName}{" "}
                      {modalUser.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {modalUser.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {modalUser.phone}
                    </p>
                    <p>
                      <strong>Role:</strong> {modalUser.role}
                    </p>
                    <p>
                      <strong>Referred By:</strong>{" "}
                      {modalUser.referred_by_name || "Self Signup"}
                    </p>
                    <button
                      onClick={() => setModalUser(null)}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-md"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {activeTab === "Leads" && (
            <section>
              <h2 style={{ fontFamily: "para_font" }} className="text-xl  mb-4">
                Leads
              </h2>
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
          {activeTab === "SendSMS" && (
            <section>
              <SendSMSForm />
            </section>
          )}

          {activeTab === "Properties" && (
            <section>
              <div className="flex flex-col md:flex-row flex-wrap md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <h2 style={{ fontFamily: "para_font" }} className="text-xl">
                    Properties
                  </h2>

                  <span className="bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full text-sm">
                    {finalProperties.length}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <FiSearch />
                    </span>
                    <input
                      type="text"
                      placeholder="Search by title, location..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setAgeFilter("all");
                      }}
                      className="pl-10 pr-3 py-1 border border-gray-300 rounded w-full outline-blue-500"
                    />
                  </div>

                  {/* Status Filter with Label */}
                  <div className="flex items-center gap-2">
                    <label className="text-gray-700 font-medium">Status:</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setAgeFilter("all");
                      }}
                      className="border rounded px-3 py-1"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-gray-700 font-medium">
                      Looking For:
                    </label>
                    <select
                      value={lookingForFilter}
                      onChange={(e) => setLookingForFilter(e.target.value)}
                      className="border rounded px-3 py-1"
                    >
                      <option value="all">All</option>
                      <option value="pg">PG</option>
                      <option value="flatmate">Flatmate</option>
                      <option value="vacant">Vacant</option>
                    </select>
                  </div>

                  {/* Source Filter with Label */}
                  <div className="flex items-center gap-2">
                    <label className="text-gray-700 font-medium">Source:</label>
                    <select
                      value={sourceFilter}
                      onChange={(e) => {
                        setSourceFilter(e.target.value);
                        setAgeFilter("all");
                      }}
                      className="border rounded px-3 py-1"
                    >
                      <option value="all">All</option>
                      <option value="mainwebsite">Main Website</option>
                      <option value="subdomain">Subdomain</option>
                      <option value="app">Mobile App</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-gray-700 font-medium">Age:</label>

                    <select
                      value={ageFilter}
                      onChange={(e) => setAgeFilter(e.target.value)}
                      className="border rounded px-3 py-1"
                    >
                      <option value="all">All</option>
                      <option value="1">Older than 1 Month</option>
                      <option value="2">Older than 2 Months</option>
                      <option value="3">Older than 3 Months</option>
                      <option value="4">Older than 4 Months</option>
                      <option value="5">Older than 5 Months</option>
                      <option value="6">Older than 6 Months</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Property Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {finalProperties.map((property) => (
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

          {activeTab === "AllBookings" && <BookingSchedule />}

          {activeTab === "NewlyListed" && (
            <>
              <FeaturePropertySection
                properties={properties}
                markFn={markNewlyListed}
                fetchProperties={fetchProperties}
                title="Newly Listed Properties"
                type="newly_listed"
              />

              <FeaturePropertySection
                properties={properties}
                markFn={markTopPG}
                fetchProperties={fetchProperties}
                title="Top PG Properties"
                type="top_pg"
              />
            </>
          )}

          {activeTab === "TopPG" && (
            <FeaturePropertySection
              properties={properties}
              markFn={markTopPG}
              fetchProperties={fetchProperties}
              title="Top PG Properties"
              type="top_pg"
            />
          )}

          {/* pending queries  */}
          {activeTab === "PendingQueries" && (
            <section>
              <h2 style={{ fontFamily: "para_font" }} className="text-xl  mb-4">
                Pending Edit Queries
              </h2>
              {loadingQueries ? (
                <p>Loading queries...</p>
              ) : (
                <PendingQueries queries={pendingQueries} />
              )}
            </section>
          )}

          {activeTab === "ManageLocations" && (
            <section>
              <ManageTopLocations />
            </section>
          )}
          {activeTab === "PostRequirement" && (
            <section>
              <RequirementReq />
            </section>
          )}

          {activeTab === "UltimateSubscribers" && (
            <section>
              <UltimateSubscribers />
            </section>
          )}
          {activeTab === "OldProperties" && (
            <section>
              <OldProperties />
            </section>
          )}

          {activeTab === "RentPayments" && <RentPaymentsDashboard />}
          {activeTab === "allAccounts" && <LandlordAgents />}
          {activeTab === "TallyReports" && <LandlordLedgerSummary />}
          {activeTab === "RequestsLandlord" && <ContactSalesTable />}
          {activeTab === "ComplaintLandlord" && <RequestsTableLandlord />}
          {activeTab === "PropertyReports" && <ManagePropertyReport />}
          {activeTab === "MyProfile" && <MyProfile />}
          {activeTab === "UserPosts" && <PostPermissionRequests />}

          {activeTab === "Marketing" && <Marketing />}
          {/* {activeTab === "allWorkerProfiles" && <Maid_profiles />}
          {activeTab === "maidQueries" && <AdminQueries />} */}

          <EditModal
            editForm={editForm}
            setEditForm={setEditForm}
            editingProperty={editingProperty}
            setEditingProperty={setEditingProperty}
            handleEditChange={handleEditChange}
            handleEditSubmit={handleEditSubmit}
            removedOccupancies={removedOccupancies}
            setRemovedOccupancies={setRemovedOccupancies}
          />
        </div>
      </main>
    </div>
  );
}
