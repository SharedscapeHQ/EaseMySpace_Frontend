import React, { useEffect, useState } from "react";
import {
  getAllLandlordAgents,
  updateLandlordAgentVerification,
  getAllAccountAssignments,
} from "../../api/adminApi";
import { FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function LandlordAgents() {
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, assignmentsRes] = await Promise.all([
        getAllLandlordAgents(),
        getAllAccountAssignments(),
      ]);
      setUsers(usersRes.data || []);
      setAssignments(assignmentsRes.data.assignments || []);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await updateLandlordAgentVerification(id, newStatus);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, isVerified: newStatus } : user
        )
      );
    } catch {
      alert("Failed to update verification status");
    }
  };

  const filteredUsers = users
    .filter((u) =>
      filter === "all"
        ? true
        : filter === "verified"
        ? u.isVerified
        : !u.isVerified
    )
    .filter(
      (u) =>
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm)
    );

  const getAssignedManager = (userId) => {
    const assignment = assignments.find(
      (a) => String(a.landlord_id) === String(userId) && a.is_active
    );
    if (!assignment) return null;
    return {
      name: assignment.assigned_name,
      email: assignment.assigned_email,
      phone: assignment.assigned_phone,
      assignedAt: assignment.assigned_at,
    };
  };

  const docLabels = {
    landlordAadhaarFront: "Landlord Aadhaar Front",
    landlordAadhaarBack: "Landlord Aadhaar Back",
    landlordPan: "Landlord PAN",
    landlordAddress: "Landlord Address Proof",
    agentAadhaarFront: "Agent Aadhaar Front",
    agentAadhaarBack: "Agent Aadhaar Back",
    agentPan: "Agent PAN",
    agentAddress: "Agent Address Proof",
    nocDocument: "NOC Document",
  };

  const getRequiredDocs = (role) =>
    role === "agent"
      ? Object.keys(docLabels)
      : [
          "landlordAadhaarFront",
          "landlordAadhaarBack",
          "landlordPan",
          "landlordAddress",
        ];

  const statusBadge = (isVerified) => (
    <span
      className={`px-3 py-1 rounded-full text-sm  ${
        isVerified
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {isVerified ? "Verified" : "Pending Verification"}
    </span>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 🔍 Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm w-full sm:w-1/3">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none flex-1 text-sm text-gray-700"
          />
        </div>

        <div className="flex gap-2">
          {["all", "verified", "unverified"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                filter === f
                  ? f === "verified"
                    ? "bg-green-600 text-white"
                    : f === "unverified"
                    ? "bg-yellow-500 text-white"
                    : "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 👥 User List */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg py-10">Loading...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500 py-10 text-lg">
          No {filter} users found.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => {
            const isExpanded = expandedUserId === user.id;
            const manager = getAssignedManager(user.id);
            const requiredDocs = getRequiredDocs(user.role);

            return (
              <div
                key={user.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg border border-gray-200 transition"
              >
                {/* Compact Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      setExpandedUserId(isExpanded ? null : user.id)
                    }
                  >
                    <h2 style={{ fontFamily: "para_font" }} className="text-lg  text-blue-700 flex items-center gap-1">
                      {user.firstName} {user.lastName}
                      {isExpanded ? (
                        <FiChevronUp className="text-gray-500" />
                      ) : (
                        <FiChevronDown className="text-gray-500" />
                      )}
                    </h2>
                    <p className="text-sm text-gray-700">{user.email}</p>
                    <p className="text-sm text-gray-700">{user.phone}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {statusBadge(user.isVerified)}
                    <button
                      onClick={() =>
                        handleVerifyToggle(user.id, user.isVerified)
                      }
                      className={`px-4 py-2 rounded-md font-medium transition ${
                        user.isVerified
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {user.isVerified ? "Mark Unverified" : "Mark Verified"}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 border-t pt-4 space-y-4">
                    <p className="text-sm text-gray-600 capitalize">
                      Role: {user.role}
                    </p>

                    {user.role === "landlord" && (
                      <div className="text-sm text-gray-800">
                        {manager ? (
                          <>
                            <p>
                              <span className=" text-blue-700">
                                Assigned Manager:
                              </span>{" "}
                              {manager.name}
                            </p>
                            <p>Email: {manager.email}</p>
                            <p>Phone: {manager.phone}</p>
                            <p className="text-gray-500 text-xs">
                              Assigned on:{" "}
                              {new Date(manager.assignedAt).toLocaleString()}
                            </p>
                          </>
                        ) : (
                          <p className="italic text-gray-500">
                            No manager assigned
                          </p>
                        )}
                      </div>
                    )}

                    {/* KYC Documents */}
                    <div>
                      <p className="text-xs  text-gray-600 uppercase mb-2">
                        KYC Documents
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {requiredDocs.map((docKey) => {
                          const docUrl = user[docKey];
                          return docUrl ? (
                            <button
                              key={docKey}
                              onClick={() => setPreviewImage(docUrl)}
                              className="text-xs text-blue-600 underline hover:text-blue-800 text-left"
                            >
                              {docLabels[docKey]} ✅
                            </button>
                          ) : (
                            <span
                              key={docKey}
                              className="text-xs text-gray-500 italic"
                            >
                              {docLabels[docKey]} — Pending ❌
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 🖼️ Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="relative max-w-4xl w-full px-4">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-xl  hover:bg-gray-200"
            >
              ×
            </button>
            <img
              src={previewImage}
              alt="Document Preview"
              className="max-h-[90vh] w-auto mx-auto rounded-lg shadow-lg border border-gray-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}
