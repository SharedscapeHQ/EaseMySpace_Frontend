import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from "../../api/authApi";
import OtpPopup from "../../pages/Properties/OtpPopup";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoCall } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";


const parseImages = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string" && raw.startsWith("{"))
    return raw
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^"|"$/g, ""))
      .filter(Boolean);
  return [];
};

export default function RecentAddedProperties() {
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const otpVerified = localStorage.getItem("otp_verified") === "true";
  const [isOtpVerified, setIsOtpVerified] = useState(otpVerified);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("user"));

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("user");
          setIsLoggedIn(false);
        }
      } catch {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const syncLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("user"));
      setIsOtpVerified(localStorage.getItem("otp_verified") === "true");
    };
    window.addEventListener("storage", syncLogin);
    window.addEventListener("auth-change", syncLogin);
    return () => {
      window.removeEventListener("storage", syncLogin);
      window.removeEventListener("auth-change", syncLogin);
    };
  }, []);

  useEffect(() => {
    async function fetchRecent() {
      setLoading(true);
      try {
        const res = await axios.get("https://api.easemyspace.in/api/properties/all");
        const sorted = res.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 6)
          .map((p) => ({ ...p, images: parseImages(p.image) }));
        setRecentProperties(sorted);
      } catch {
        setRecentProperties([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

const handlePropertyCardClick = (e, property) => {
  if (!isLoggedIn && !isOtpVerified) {
    e.preventDefault();
    setSelectedPropertyId(property.id);
    setShowOtpPopup(true);
    return;
  }

  navigate(`/properties/${property.id}`);
};

  if (loading)
    return (
      <section className="py-10 mt-10 lg:px-10 px-3 max-w-7xl mx-auto">
        <h2 className="text-lg lg:text-3xl mb-0 text-black leading-tight" style={{ fontFamily: "heading_font" }}>
          Discover the Latest Properties
        </h2>
        <div className="flex gap-5 overflow-x-auto scroll-smooth pb-4 scrollbar-hide mt-10">
          {Array(4).fill(0).map((_, i) => (
            <div
              key={i}
              className="min-w-[270px] max-w-[270px] group bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden animate-pulse"
            >
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded-t-2xl" />
              <div className="p-4 flex flex-col gap-1">
                <div className="h-4 bg-gray-200 rounded w-[60%] mb-2" />
                <div className="h-4 bg-gray-300 rounded w-[30%] mb-2" />
                <div className="h-3 bg-gray-200 rounded w-[40%] mb-2" />
                <div className="h-3 bg-gray-300 rounded w-[70%]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );

  if (recentProperties.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10" style={{ fontFamily: "para_font" }}>
        No recently added properties found.
      </p>
    );

  return (
    <div className="bg-zinc-50 pb-5">
      <section className="lg:px-10 px-3 rounded-2xl max-w-7xl mx-auto relative" style={{ fontFamily: "para_font" }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] lg:text-3xl text-left text-black" style={{ fontFamily: "heading_font" }}>
            Recently Listed Shared Rooms
          </h2>
          <Link to="/view-properties" className="text-blue-600 text-[13px] lg:text-base font-medium hover:underline">
            View All
          </Link>
        </div>

        <div className="relative">
          <div ref={scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth pb-4 scrollbar-hide">
            {recentProperties.map((p) => (
           <Link
            to={`/properties/${p.id}`}
            key={p.id}
            onClick={(e) => handlePropertyCardClick(e, p)}
            className="min-w-[300px] max-w-[300px] group bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden shadow-md"
          >
            {/* Image Section */}
            <div className="relative w-full h-44">
              {p.images?.length > 0 ? (
                <img
                  src={p.images[0]}
                  alt={p.title || "Property image"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 italic">
                  No Image
                </div>
              )}
              {p.verified && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                  Verified
                </span>
              )}
            </div>
          
            {/* Details Section */}
            <div className="p-4 flex flex-col gap-4">
              {/* Location + Looking For */}
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-600 text-sm gap-1">
                  <FiMapPin className="text-gray-500" />
                  {p.location ? p.location.split(" ").slice(-2).join(" ") : "Unknown"}
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    p.looking_for
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {p.looking_for
                    ? p.looking_for === "flatmate"
                      ? "Flatmate"
                      : p.looking_for === "pg"
                      ? "PG"
                      : "Vacant Flat"
                    : "N/A"}
                </span>
              </div>
          
              {/* Rent | Deposit | BHK */}
              <div className="flex  border-gray-200 text-sm text-gray-700 py-2">
                {/** Rent */}
                <div className="flex-1 text-center py-2">
                  <div className="text-gray-900 font-semibold">
                    ₹{p.price?.toLocaleString() || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">Rent</div>
                </div>
                <div className="w-[1px] bg-gray-300"></div>
          
                {/** Deposit */}
                <div className="flex-1 text-center py-2">
                  <div className="text-gray-900 font-semibold">
                    {p.deposit ? `₹${Number(p.deposit).toLocaleString()}` : "-"}
                  </div>
                  <div className="text-xs text-gray-500">Deposit</div>
                </div>
                <div className="w-[1px] bg-gray-300"></div>
          
                {/** BHK */}
                <div className="flex-1 text-center py-2">
                  <div className="text-gray-900 font-semibold">{p.bhk_type || "-"}</div>
                  <div className="text-xs text-gray-500">BHK</div>
                </div>
              </div>
          
              {/* Title + Actions */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xl">
                    {p.title?.charAt(0) || "U"}
                  </div>
                  <span className="font-medium text-sm text-gray-700">{p.title}</span>
                </div>
                <div className="flex gap-3 text-blue-500">
                  <IoChatboxEllipsesOutline className="text-2xl cursor-pointer" />
                  <IoCall className="text-2xl cursor-pointer" />
                </div>
              </div>
          
              {/* Book Now Button */}
              <button
                style={{ fontFamily: "heading_font" }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-md mt-2"
              >
                Book Visit Now
              </button>
            </div>
          </Link>

            ))}
          </div>
        </div>
      </section>

      {showOtpPopup && (
        <OtpPopup
          otpPurpose="view property"
          onVerified={() => {
            setIsOtpVerified(true);
            setShowOtpPopup(false);
            if (selectedPropertyId) {
              navigate(`/properties/${selectedPropertyId}`);
            }
          }}
          onClose={() => {
            setShowOtpPopup(false);
            setSelectedPropertyId(null);
          }}
        />
      )}
    </div>
  );
}
