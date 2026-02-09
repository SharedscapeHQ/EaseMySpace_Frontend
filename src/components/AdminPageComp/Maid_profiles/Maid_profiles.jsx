import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { getAllMaidProfiles, updateMaidProfile } from "../../../api/Maid_api/maidAdminApi";
import EditMaidModal from "./EditMaidModal";

export default function MaidProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [selectedMaid, setSelectedMaid] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getAllMaidProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching maid profiles:", error);
        toast.error("Failed to fetch maid profiles");
      }
    };
    fetchProfiles();
  }, []);

  const handleEditClick = (maid) => {
    setSelectedMaid(maid);
    setIsModalOpen(true);
  };

  const handleApproveClick = async (maid) => {
    try {
      const updatedMaid = { ...maid, kyc_status: true };
      const res = await updateMaidProfile(maid.id, updatedMaid);

      // Keep added_by info intact
      setProfiles((prev) =>
        prev.map((m) =>
          m.id === maid.id
            ? { ...res.data.worker, added_by_name: m.added_by_name, added_by_email: m.added_by_email, added_by_phone: m.added_by_phone }
            : m
        )
      );

      toast.success("Maid approved successfully!");
    } catch (err) {
      console.error("Failed to approve maid:", err);
      toast.error("Failed to approve maid!");
    }
  };

  const handleSave = async (updatedMaid) => {
    if (!updatedMaid.id) {
      console.error("Cannot update maid without ID");
      toast.error("Maid ID is missing!");
      return;
    }

    try {
      const res = await updateMaidProfile(updatedMaid.id, updatedMaid);

      setProfiles((prev) =>
        prev.map((m) =>
          m.id === updatedMaid.id
            ? { ...res.data.worker, added_by_name: m.added_by_name, added_by_email: m.added_by_email, added_by_phone: m.added_by_phone }
            : m
        )
      );

      toast.success("Maid profile updated successfully!");
    } catch (err) {
      console.error("Failed to update maid:", err);
      toast.error("Failed to update maid!");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((maid) => (
        <div
          key={maid.id}
          className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col"
        >
          <img
            src={maid.profile_photo}
            alt={`${maid.first_name} ${maid.last_name}`}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h2 style={{ fontFamily: "para_font" }} className="text-lg font-semibold text-gray-800">
                {maid.first_name} {maid.last_name}, {maid.age}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Skills: {maid.skills}</p>
              <p className="text-sm text-gray-600 mt-1">Experience: {maid.experience}</p>
              <p className="text-sm text-gray-600 mt-1">Location Served: {maid.location_served}</p>
              <p className="text-sm text-gray-800 mt-2 font-medium">
                Added By: {maid.added_by_name} ({maid.added_by_email})
              </p>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              <button
                onClick={() => handleEditClick(maid)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md"
              >
                Edit
              </button>

              {!maid.kyc_status && (
                <button
                  onClick={() => handleApproveClick(maid)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md"
                >
                  Approve
                </button>
              )}

              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                View Details
              </button>
            </div>

            <div className="flex gap-2 flex-wrap mt-2">
              {["aadhaar_front", "aadhaar_back", "pan"].map(
                (field) =>
                  maid[field] && (
                    <div key={field} className="flex flex-col items-center">
                      <img
                        src={maid[field]}
                        alt={field}
                        className="w-16 h-16 object-cover border rounded"
                      />
                      <a
                        href={maid[field]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-xs hover:underline"
                      >
                        View
                      </a>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      ))}

      <EditMaidModal
        maid={selectedMaid}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
