import { useState, useEffect, useContext } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import OtpPopup from "../../pages/Properties/OtpPopup";
import {
  saveLeadProperty,
  removeLeadProperty,
  fetchLeadSavedProperties,
} from "../../api/leadApi";
import axiosInstance, { saveProperty, removeSavedProperty, getSavedProperties } from "../../api/userApi";
import { AuthContext } from "../../context/AuthContextV1"; 

export default function LikeButton({ propertyId, initiallyLiked = false }) {
  const { user } = useContext(AuthContext); 
  const isLoggedIn = !!user;

  const [liked, setLiked] = useState(initiallyLiked);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [phone, setPhone] = useState(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  const [groups, setGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [newGroupName, setNewGroupName] = useState("");

  // ---- OTP / Phone ----
  useEffect(() => {
    const otpVerified = localStorage.getItem("otp_verified") === "true";
    setIsOtpVerified(otpVerified);

    const verifiedPhone = localStorage.getItem("user_verified_mobile") || null;
    setPhone(verifiedPhone);
  }, []);

  // ---- Check if property is liked ----
  useEffect(() => {
    async function checkLiked() {
      try {
        if (isLoggedIn) {
          const saved = await getSavedProperties();
          setLiked(saved.some((p) => String(p.id) === String(propertyId)));
        } else if (isOtpVerified && phone) {
          const saved = await fetchLeadSavedProperties(phone);
          setLiked(saved.some((p) => String(p.id) === String(propertyId)));
        }
      } catch (err) {
        console.error("Error checking liked property:", err);
      }
    }
    if (isLoggedIn !== null) checkLiked();
  }, [propertyId, isLoggedIn, isOtpVerified, phone]);

  // ---- Fetch groups for logged-in users ----
  useEffect(() => {
    async function fetchGroups() {
      if (!isLoggedIn) return;

      try {
        const res = await axiosInstance.get("/group");
        setGroups(res.data.groups || []);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    }
    if (isLoggedIn) fetchGroups();
  }, [isLoggedIn]);

  // ---- Handle click ----
  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn && !isOtpVerified) {
      setShowOtpPopup(true);
      return;
    }

    if (liked) {
      try {
        if (isLoggedIn) await removeSavedProperty(propertyId);
        else if (phone) await removeLeadProperty(phone, propertyId);
        setLiked(false);
      } catch (err) {
        console.error("Error removing property:", err);
      }
    } else {
      setShowGroupModal(true);
    }
  };

  const handleSaveToGroup = async () => {
    try {
      const groupPayload = selectedGroup || newGroupName.trim();
      if (!groupPayload) return alert("Please select or create a group.");

      if (isLoggedIn) {
        await saveProperty({ propertyId, groupName: groupPayload });
        const res = await axiosInstance.get("/group");
        setGroups(res.data.groups || []);
      } else if (phone) {
        await saveLeadProperty(phone, propertyId);
      }

      setLiked(true);
      setShowGroupModal(false);
      setSelectedGroup("");
      setNewGroupName("");
    } catch (err) {
      console.error("Error saving property to group:", err);
      alert("Failed to save property. Please try again.");
    }
  };

  return (
    <>
      {/* Heart Button */}
      {!showOtpPopup && !showGroupModal && (
        <motion.div
          onClick={handleClick}
          className="absolute top-2 right-2 cursor-pointer hover:scale-110 transition-transform z-10"
          whileTap={{ scale: 0.85 }}
        >
          <div className="relative text-[26px]">
            <AiFillHeart className="absolute inset-0 text-black/40" />
            <AnimatePresence mode="wait" initial={false}>
              {liked ? (
                <motion.span
                  key="heart-filled"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [1.4, 0.9, 1], opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <AiFillHeart className="relative text-red-500 drop-shadow-md transition-colors duration-300" />
                </motion.span>
              ) : (
                <motion.span
                  key="heart-outline"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [1.2, 0.95, 1], opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <AiOutlineHeart className="relative text-white drop-shadow-md transition-colors duration-300" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* OTP Modal */}
      {showOtpPopup && (
        <OtpPopup
          otpPurpose="save property"
          onVerified={(verifiedPhone) => {
            localStorage.setItem("otp_verified", "true");
            localStorage.setItem("user_verified_mobile", verifiedPhone);
            setPhone(verifiedPhone);
            setIsOtpVerified(true);
            setShowOtpPopup(false);
          }}
          onClose={() => setShowOtpPopup(false)}
        />
      )}

      {/* Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
            <h2 style={{ fontFamily: "para_font" }} className="text-lg mb-4">Select or Create Group</h2>
            {groups.length > 0 && (
              <div className="mb-4">
                <p className="text-sm mb-2">Existing Groups:</p>
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
              <p className="text-sm mb-2">Or create new group:</p>
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
}