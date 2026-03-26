import React, { useState, useEffect, useContext } from "react";
import { FaHeart, FaRegHeart, FaFlag } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import {
  saveProperty,
  removeSavedProperty,
  getSavedProperties,
} from "../../api/userApi";

import {
  saveLeadProperty,
  removeLeadProperty,
  fetchLeadSavedProperties,
} from "../../api/leadApi";

import OtpPopup from "../../pages/Properties/OtpPopup";
import ShareActions from "./ShareActions";
import ReportPropertyModal from "./ReportPropertyModal";
import { AuthContext } from "../../context/AuthContextV1";
import axiosInstance from "../../api/userApi";

const SavePropertyButton = ({ propertyId, property }) => {
  const { user, isVerified: isOtpVerified } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const [saved, setSaved] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [phone, setPhone] = useState(
    () => localStorage.getItem("user_verified_mobile") || null
  );

  // ---- Group modal states ----
  const [groups, setGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [newGroupName, setNewGroupName] = useState("");

  // ✅ Check if property is already saved
  useEffect(() => {
    async function checkSaved() {
      if (!propertyId) return;

      try {
        let savedList = [];

        if (isLoggedIn) {
          savedList = (await getSavedProperties()) || [];
        } else if (isOtpVerified && phone) {
          savedList = (await fetchLeadSavedProperties(phone)) || [];
        }

        setSaved(savedList.some((p) => String(p.id) === String(propertyId)));
      } catch (err) {
        console.error("❌ Error checking saved property:", err);
      }
    }

    checkSaved();
  }, [propertyId, isLoggedIn, isOtpVerified, phone]);

  useEffect(() => {
    async function fetchGroups() {
      if (!isLoggedIn) return;
      try {
        const res = await axiosInstance.get("/group");
        setGroups(res.data.groups || []);
      } catch (err) {
        console.error("❌ Error fetching groups:", err);
      }
    }
    if (isLoggedIn) fetchGroups();
  }, [isLoggedIn]);

  // ✅ Toggle Save
  const toggleSave = async () => {
    if (!isLoggedIn && !isOtpVerified) {
      setShowOtpPopup(true);
      return;
    }

    try {
      if (saved) {
        if (isLoggedIn) {
          await removeSavedProperty(propertyId);
        } else if (phone) {
          await removeLeadProperty(phone, propertyId);
        }
        setSaved(false);
      } else {
        if (isLoggedIn) {
          setShowGroupModal(true);
        } else if (phone) {
          await saveLeadProperty(phone, propertyId);
          setSaved(true);
        }
      }
    } catch (err) {
      console.error("❌ Error toggling save:", err);
    }
  };

  const handleSaveToGroup = async () => {
    try {
      const groupPayload = selectedGroup || newGroupName.trim();
      if (!groupPayload) return alert("Please select or create a group.");

      await saveProperty({ propertyId, groupName: groupPayload });

      // Refresh groups list
      const res = await axiosInstance.get("/group");
      setGroups(res.data.groups || []);

      setSaved(true);
      setShowGroupModal(false);
      setSelectedGroup("");
      setNewGroupName("");
    } catch (err) {
      console.error("❌ Error saving property to group:", err);
      alert("Failed to save property. Please try again.");
    }
  };

  const isButtonDisabled = isLoggedIn === null;

  return (
    <>
      <div className="flex items-center gap-2">
        {/* ✅ SHARE */}
        <ShareActions property={property} />

        {/* ✅ REPORT BUTTON */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowReport(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
        >
          <FaFlag />
        </motion.button>

        {/* ✅ SAVE BUTTON (icon only) */}
        <motion.button
          onClick={toggleSave}
          disabled={isButtonDisabled}
          whileTap={{ scale: 0.85 }}
          className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md transition
            ${saved ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700"}
            ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label={saved ? "Saved" : "Save"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {saved ? (
              <motion.span
                key="heart-filled"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1.4, 0.9, 1], opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <FaHeart />
              </motion.span>
            ) : (
              <motion.span
                key="heart-outline"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1.2, 0.95, 1], opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaRegHeart />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ✅ REPORT MODAL */}
      {showReport && (
        <ReportPropertyModal
          propertyId={propertyId}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* ✅ OTP POPUP */}
      {showOtpPopup && (
        <OtpPopup
          otpPurpose="save property"
          onVerified={(verifiedPhone) => {
            localStorage.setItem("otp_verified", "true");
            localStorage.setItem("user_verified_mobile", verifiedPhone);
            setPhone(verifiedPhone);
            setShowOtpPopup(false);
            toggleSave();
          }}
          onClose={() => setShowOtpPopup(false)}
        />
      )}

      {/* ✅ GROUP MODAL */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
            <h2 className="text-lg mb-4">Select or Create Group</h2>
            {groups.length > 0 && (
              <div className="mb-4">
                {groups.map((g) => (
                  <div key={g.id} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`group-${g.id}`}
                      name="group"
                      value={g.name}
                      checked={selectedGroup === g.name}
                      onChange={() => setSelectedGroup(g.name)}
                      className="mr-2"
                    />
                    <label htmlFor={`group-${g.id}`}>{g.name}</label>
                  </div>
                ))}
              </div>
            )}
            <div className="mb-4">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="New group name"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowGroupModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveToGroup}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SavePropertyButton;