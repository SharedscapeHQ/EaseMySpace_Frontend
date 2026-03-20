import React, { useState, useEffect, useContext } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { saveProperty, removeSavedProperty, getSavedProperties } from "../../api/userApi";
import OtpPopup from "../../pages/Properties/OtpPopup";
import { saveLeadProperty, removeLeadProperty, fetchLeadSavedProperties } from "../../api/leadApi";
import ShareReportActions from "./ShareReportActions";
import { AuthContext } from "../../context/AuthContextV1";

const SavePropertyButton = ({ propertyId }) => {
  const { user, isVerified: isOtpVerified } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const [saved, setSaved] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [phone, setPhone] = useState(() => localStorage.getItem("user_verified_mobile") || null);

  // Check if property is already saved
  useEffect(() => {
    async function checkSaved() {
      if (!propertyId) return;
      try {
        if (isLoggedIn) {
          const savedList = await getSavedProperties();
          setSaved(savedList.some((p) => String(p.id) === String(propertyId)));
        } else if (isOtpVerified && phone) {
          const savedList = await fetchLeadSavedProperties(phone);
          setSaved(savedList.some((p) => String(p.id) === String(propertyId)));
        }
      } catch (err) {
        console.error("❌ Error checking saved property:", err);
      }
    }
    checkSaved();
  }, [propertyId, isLoggedIn, isOtpVerified, phone]);

  const toggleSave = async () => {
    if (isLoggedIn === null) return;

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
          await saveProperty(propertyId);
        } else if (phone) {
          await saveLeadProperty(phone, propertyId);
        }
        setSaved(true);
      }
    } catch (err) {
      console.error("❌ Error toggling save:", err);
    }
  };

  const isButtonDisabled = isLoggedIn === null;

  return (
    <>
      <div className="flex items-center gap-2">
        <ShareReportActions propertyId={propertyId} />

        {/* Save Button */}
        <motion.button
          onClick={toggleSave}
          disabled={isButtonDisabled}
          whileTap={{ scale: 0.85 }}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium shadow-md transition
            ${saved ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700"}
            ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {saved ? (
              <motion.span
                key="heart-filled"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1.4, 0.9, 1], opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <FaHeart className="text-red-500" />
              </motion.span>
            ) : (
              <motion.span
                key="heart-outline"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1.2, 0.95, 1], opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <FaRegHeart />
              </motion.span>
            )}
          </AnimatePresence>
          {saved ? "Saved" : "Save"}
        </motion.button>
      </div>

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
    </>
  );
};

export default SavePropertyButton;