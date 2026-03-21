import React, { useState, useMemo } from "react";
import AdminKycUploadModal from "./AdminKycUploadModal";
import AdminKycViewModal from "./AdminKycViewModal";
import { adminUploadKycForm, getUserKYCDocs } from "../../Api/adminApi";

export default function UsersTable({ users }) {
  const [modalUser, setModalUser] = useState(null); 
  const [viewUser, setViewUser] = useState(null);   
  const [showKycModal, setShowKycModal] = useState(false);
  const [showKycViewModal, setShowKycViewModal] = useState(false);
  const [selectedKycData, setSelectedKycData] = useState(null);
  const [search, setSearch] = useState("");
  const [showKycUploaded, setShowKycUploaded] = useState(false);

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((u) => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        const email = (u.email || "").toLowerCase();
        const phone = (u.phone || "").toLowerCase();
        return (
          fullName.includes(lowerSearch) ||
          email.includes(lowerSearch) ||
          phone.includes(lowerSearch)
        );
      });
    }
    if (showKycUploaded) filtered = filtered.filter((u) => u.kyc_uploaded);
    return filtered;
  }, [users, search, showKycUploaded]);

  const handleUploadKyc = (user) => {
    setModalUser(user);
    setShowKycModal(true);
  };

  const handleKycSubmit = async ({ userId, files, workLocation }) => {
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("workLocation", workLocation);

      Object.keys(files).forEach((key) => {
        if (files[key]) formData.append(key, files[key]);
      });

      await adminUploadKycForm(formData);
      alert("KYC uploaded successfully!");
      setShowKycModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to upload KYC");
    }
  };

  const handleViewKyc = async (user) => {
    try {
      const res = await getUserKYCDocs(user.id); // ✅ use adminAxios helper
      setSelectedKycData(res.data.data); // adjust based on your API
      setViewUser(user);                 // set the correct user for view
      setShowKycViewModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch KYC documents");
    }
  };

  return (
    <div>
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={showKycUploaded}
            onChange={(e) => setShowKycUploaded(e.target.checked)}
            className="accent-indigo-600"
          />
          Show only users with KYC uploaded
        </label>
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-sm">No users found</p>
      ) : (
        <div className="overflow-x-auto shadow border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-3 py-2 text-indigo-700 uppercase">Name</th>
                <th className="px-3 py-2 text-indigo-700 uppercase">Contact</th>
                <th className="px-3 py-2 text-indigo-700 uppercase">Referred By</th>
                <th className="px-3 py-2 text-indigo-700 uppercase">KYC</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                    <div>{u.email || <span className="italic text-gray-400">N/A</span>}</div>
                    <div>{u.phone || <span className="italic text-gray-400">N/A</span>}</div>
                  </td>
                  <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                    {u.referred_by_name && u.referred_by_name !== "N/A" ? (
                      <span className="text-indigo-600 hover:underline text-sm cursor-pointer">
                        {u.referred_by_name}
                      </span>
                    ) : (
                      <span className="italic text-gray-400 text-sm">Self Signup</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm">
                    {u.kyc_uploaded ? (
                      <span
                        onClick={() => handleViewKyc(u)}
                        className="text-green-600 font-medium cursor-pointer hover:underline"
                      >
                        Received
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUploadKyc(u)}
                        className="text-indigo-600 hover:underline"
                      >
                        Upload
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin KYC Upload Modal */}
      {showKycModal && modalUser && (
        <AdminKycUploadModal
          user={modalUser}
          onClose={() => setShowKycModal(false)}
          onSubmit={handleKycSubmit}
        />
      )}

      {/* Admin KYC View Modal */}
      {showKycViewModal && selectedKycData && viewUser && (
        <AdminKycViewModal
          user={viewUser}
          kycData={selectedKycData}
          onClose={() => setShowKycViewModal(false)}
        />
      )}
    </div>
  );
}