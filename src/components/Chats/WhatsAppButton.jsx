import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const location = useLocation();
  // const [isMobile, setIsMobile] = useState(false);




  // if (location.pathname !== "/" || !isMobile) return null;

  const phoneNumber = "919004463371";
  const message = "Hello! I would like to know more.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-16 right-4 bg-green-500 text-white rounded-full shadow-lg p-3 flex items-center justify-center z-50"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
