import React, { useState, useRef, useEffect } from "react";
import { FaShare, FaWhatsapp, FaFacebookF, FaLink } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function ShareActions({ property }) {
  const [showShare, setShowShare] = useState(false);
  const dropdownRef = useRef(null);

  const buildUrl = () => `https://api.easemyspace.in/api/properties/share/${property?.id}`;

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(buildUrl());
    toast.success("Link copied");
    setShowShare(false);
  };

  const shareViaWhatsApp = () => {
    const msg = `${property.title || "Property"}\n${buildUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    setShowShare(false);
  };

  const shareViaFacebook = () => {
    const url = encodeURIComponent(buildUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    setShowShare(false);
  };

  // Close dropdown on outside click or scroll
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowShare(false);
      }
    };

    const handleScroll = () => {
      setShowShare(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true); // true for capturing

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Professional share button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowShare(!showShare)}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="Share property"
      >
        <FaShare />
      </motion.button>

      {/* Share options dropdown */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute mt-2 w-48 bg-white shadow-md rounded-lg border z-50"
          >
            <button
              onClick={copyUrlToClipboard}
              className="flex items-center gap-2 px-4 py-2 w-full text-sm hover:bg-gray-100"
            >
              <FaLink /> Copy Link
            </button>

            <button
              onClick={shareViaWhatsApp}
              className="flex items-center gap-2 px-4 py-2 w-full text-sm text-green-600 hover:bg-gray-100"
            >
              <FaWhatsapp /> WhatsApp
            </button>

            <button
              onClick={shareViaFacebook}
              className="flex items-center gap-2 px-4 py-2 w-full text-sm text-blue-600 hover:bg-gray-100"
            >
              <FaFacebookF /> Facebook
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}