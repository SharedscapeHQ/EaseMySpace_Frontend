import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { saveProperty, removeSavedProperty, getSavedProperties } from "../../api/userApi";
import { getCurrentUser } from "../../api/authApi";
import OtpPopup from "../../pages/Properties/OtpPopup";
import { saveLeadProperty, removeLeadProperty, fetchLeadSavedProperties } from "../../api/leadApi";
import ShareButton from "./ShareButton";

const SavePropertyButton = ({ propertyId }) => {
  const [saved, setSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [phone, setPhone] = useState(null); // For guest/lead users

  // Fetch current user / OTP status
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        setIsLoggedIn(!!user);

        const otpVerified = localStorage.getItem("otp_verified") === "true";
        setIsOtpVerified(otpVerified);

        // Use verified phone for guest users
        const verifiedPhone = localStorage.getItem("user_verified_mobile") || null;
        setPhone(verifiedPhone);

        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
      } catch {
        setIsLoggedIn(false);
        setIsOtpVerified(localStorage.getItem("otp_verified") === "true");
        setPhone(localStorage.getItem("user_verified_mobile") || null);
        localStorage.removeItem("user");
      }
    }
    fetchUser();
  }, []);

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
    if (isLoggedIn !== null) checkSaved();
  }, [propertyId, isLoggedIn, isOtpVerified, phone]);

  // Listen for login / OTP changes
  useEffect(() => {
    const syncLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("user"));
      setIsOtpVerified(localStorage.getItem("otp_verified") === "true");
      setPhone(localStorage.getItem("user_verified_mobile") || null);
    };
    window.addEventListener("storage", syncLogin);
    window.addEventListener("auth-change", syncLogin);
    return () => {
      window.removeEventListener("storage", syncLogin);
      window.removeEventListener("auth-change", syncLogin);
    };
  }, []);

  const toggleSave = async () => {
    if (isLoggedIn === null) return;

    // Show OTP popup if neither logged in nor OTP verified
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
      {/* Share Button on the left */}
      {/* <ShareButton /> */}

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
          setIsOtpVerified(true);
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
