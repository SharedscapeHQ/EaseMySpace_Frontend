import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiHome, FiPlus, FiPhoneCall, FiUser, FiCalendar } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { saveRequest } from "../../api/requestApi";
import gsap from "gsap";

const dashRoute = (user, isVerified) => {
  if (!user && isVerified) return "/lead-dashboard";
  if (!user) return "/login";
  switch (user.role) {
    case "admin":
      return "/admin-dashboard";
    case "owner":
      return "/owner-dashboard";
    case "RM":
      return "/rm-dashboard";
    case "HR":
      return "/hr-dashboard";
    default:
      return "/dashboard";
  }
};

export default function BottomNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for user and OTP verification
  const [user, setUser] = useState(() => {
    const cache = localStorage.getItem("user");
    return cache ? JSON.parse(cache) : null;
  });
  const [isVerified, setIsVerified] = useState(localStorage.getItem("otp_verified") === "true");

  const syncUser = useCallback(() => {
    const cache = localStorage.getItem("user");
    setUser(cache ? JSON.parse(cache) : null);
    setIsVerified(localStorage.getItem("otp_verified") === "true");
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-change", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-change", syncUser);
    };
  }, [syncUser]);

  const popupRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // GSAP popup animation
  useEffect(() => {
    if (isOpen && popupRef.current) {
      gsap.fromTo(
        popupRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.35, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  // GSAP modal animation
  useEffect(() => {
    if (callbackOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out" }
      );
    }
  }, [callbackOpen]);

  // Close popup/modal on outside click or scroll
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target) && !e.target.closest("button")) {
        setIsOpen(false);
      }
      if (modalRef.current && !modalRef.current.contains(e.target) && callbackOpen) {
        setCallbackOpen(false);
      }
    };
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
      if (callbackOpen) setCallbackOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, callbackOpen]);

  // Handle form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const phonePattern = /^[0-9]{10}$/;
    const invalidNumbers = ["1111111111","0000000000","1234567890","0987654321","2222222222","3333333333","4444444444","5555555555","6666666666","7777777777","8888888888","9999999999","1212121212","1122334455","1020304050","9876543210","1357913579","2468246824","1231231231","3213213210"];
    if (!phonePattern.test(formData.phone) || invalidNumbers.includes(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      setLoading(false);
      return;
    }
    try {
      await saveRequest(formData);
      setSubmitted(true);
      setFormData({ name: "", phone: "", email: "" });
      setTimeout(() => {
        setSubmitted(false);
        setCallbackOpen(false);
      }, 2500);
    } catch (err) {
      console.error("❌ Failed to save request:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Custom navigate for Bookings button
  const handleBookingsClick = () => {
    if (!user && isVerified) {
      navigate("/lead-dashboard");
    } else {
      navigate("/dashboard?tab=MyBookings");
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t-2 flex justify-between items-center px-6 py-2 md:hidden z-50 rounded-t-2xl">
        {/* Home */}
        <button onClick={() => navigate("/")} className={`flex flex-col items-center ${location.pathname === "/" ? "text-blue-600" : "text-gray-600"} hover:text-blue-600`}>
          <FiHome size={22} />
          <span className="text-xs">Home</span>
        </button>

        {/* Bookings */}
        <button onClick={handleBookingsClick} className={`flex flex-col items-center ${location.pathname === "/dashboard" ? "text-blue-600" : "text-gray-600"} hover:text-blue-600`}>
          <FiCalendar size={22} />
          <span className="text-xs">Bookings</span>
        </button>

        {/* Center Floating Action Button */}
        <div className="relative">
          <button onClick={() => setIsOpen(!isOpen)} className={`bg-blue-600 text-white p-4 rounded-full -mt-6 shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? "rotate-45" : "rotate-0"}`}>
            <FiPlus size={22} />
          </button>

          {isOpen && (
            <div ref={popupRef} className="absolute bg-white p-4 rounded-xl bottom-14 left-1/2 -translate-x-1/2 flex flex-col gap-3 items-center">
              <Link to="/add-properties" className="bg-blue-600 text-white px-3 py-2 rounded-md shadow-md text-sm w-40 hover:bg-blue-700 text-center">List your Property</Link>
              <Link to="/demand-form" className="bg-blue-600 text-white px-3 py-2 rounded-md shadow-md text-sm w-40 hover:bg-blue-700 text-center">Post Requirement</Link>
            </div>
          )}
        </div>

        {/* Callback */}
        <button onClick={() => setCallbackOpen(true)} className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <FiPhoneCall size={22} />
          <span className="text-xs">Callback</span>
        </button>

        {/* Profile */}
        <button onClick={() => navigate(dashRoute(user, isVerified))} className={`flex flex-col items-center ${location.pathname.includes("dashboard") ? "text-blue-600" : "text-gray-600"} hover:text-blue-600`}>
          <FiUser size={22} />
          <span className="text-xs">Profile</span>
        </button>
      </div>

      {/* Callback Modal */}
      {callbackOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 px-4">
          <div ref={modalRef} className="bg-white rounded-xl shadow-xl w-full max-w-3xl relative overflow-hidden flex flex-col md:flex-row">
            <button onClick={() => setCallbackOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg">✕</button>
            <div className="bg-blue-50 p-6 md:w-1/2 border-r border-gray-200 flex flex-col justify-center text-center md:text-left">
              <h3 className="text-gray-800 font-semibold text-lg mb-4">Why Choose EaseMySpace? ✨</h3>
              <ul className="space-y-2 text-sm text-gray-600 text-left mx-auto md:mx-0 w-fit">
                <li>✅ Zero Brokerage – Direct Connect with Owners</li>
                <li>✅ Largest Network of Flatmates & Vacant Rooms</li>
                <li>✅ Verified & Active Listings Only</li>
                <li>✅ Personalized Assistance by EMS Experts</li>
              </ul>
              <div className="mt-6 text-sm text-gray-500 text-center md:text-left">🌟 India’s Fastest Growing Urban Living Platform 🌟</div>
            </div>
            <div className="p-6 md:w-1/2 flex flex-col justify-center items-center text-center">
              {!submitted ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">How can we help you?</h2>
                  <p className="text-sm text-gray-600 mb-4">Speak with a space solution expert.</p>
                  <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-sm">
                    <input type="text" name="name" placeholder="*Enter your name" value={formData.name} onChange={handleChange} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                    <input type="tel" name="phone" placeholder="*Enter your mobile number" value={formData.phone} onChange={(e)=>{const onlyNums=e.target.value.replace(/\D/g,"");setFormData({...formData,phone:onlyNums});}} maxLength={10} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                    <input type="email" name="email" placeholder="*Enter your email" value={formData.email} onChange={handleChange} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                    <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50">{loading ? "Submitting..." : "Request Callback"}</button>
                  </form>
                </>
              ) : (
                <div className="text-center text-green-600 font-medium text-lg">
                  ✅ We’ve received your request!
                  <p className="text-gray-600 text-sm mt-2">Our team will contact you shortly.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
