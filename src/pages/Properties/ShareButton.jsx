import React, { useState, useEffect, useRef } from "react";
import { FaShareAlt, FaWhatsapp, FaLink } from "react-icons/fa";

const ShareButton = ({ property }) => {
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  // Determine current URL for sharing
  const getFullUrl = () => {
    if (typeof window === "undefined") return "";
    const url = window.location.href;
    // Use HTTPS prefix if missing
    return url.startsWith("http") ? url : "https://" + url;
  };

  const copyUrlToClipboard = () => {
    const url = getFullUrl();
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
    setShowOptions(false);
  };

  const shareViaWhatsApp = () => {
    const url = getFullUrl();
    const message = `Check out this property: ${property?.title || "Property"}${
      property?.location ? `\n${property.location}` : ""
    }\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setShowOptions(false);
  };

  // Auto-close dropdown on scroll or click outside
  useEffect(() => {
    const handleScroll = () => setShowOptions(false);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Share Button */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-md transition-all duration-200"
        title="Share"
      >
        <FaShareAlt />
      </button>

      {/* Dropdown Options */}
      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 flex flex-col py-1">
          <button
            onClick={copyUrlToClipboard}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-lg transition"
          >
            <FaLink /> Copy URL
          </button>
          <button
            onClick={shareViaWhatsApp}
            className="px-4 py-2 text-sm text-green-600 hover:bg-gray-100 flex items-center gap-2 rounded-lg transition"
          >
            <FaWhatsapp /> WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
