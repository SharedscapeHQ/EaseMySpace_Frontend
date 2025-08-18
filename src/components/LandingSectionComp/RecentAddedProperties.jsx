import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from "../../api/authApi";
import OtpPopup from "../../pages/Properties/OtpPopup";

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
            Discover the Latest Properties
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
  className="min-w-[270px] max-w-[270px] bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden group relative transition-all duration-300"
>
  {/* Blue Fill Overlay */}
    <div className="hidden lg:block absolute inset-x-0 bottom-0 bg-blue-500 h-0 group-hover:h-full transition-all duration-300 ease-in-out z-0 rounded-2xl"></div>


  <article className="flex flex-col h-full relative z-10">
    <div className="relative h-48 w-full p-3 z-10">
      <div className="absolute top-4 left-4 z-20 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-lg shadow-md">
        New
      </div>

      <div className="h-full w-full rounded-xl overflow-hidden">
        {(() => {
          const url = p.images[0];
          if (!url) return null;
          const isImage = /\.(jpe?g|png|webp)$/i.test(url);
          const isVideo = /\.(mp4|mov|webm)$/i.test(url);
          if (isImage)
            return (
              <img
                src={url}
                alt="Property"
                className="h-full w-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-transform duration-300"
                loading="lazy"
              />
            );
          if (isVideo)
            return (
              <video
                src={url}
                controls
                className="h-full w-full object-cover"
                loading="lazy"
              />
            );
          return null;
        })()}
      </div>
    </div>

    <div className="p-4 flex flex-col gap-1 z-10 relative lg:group-hover:text-white transition-colors duration-300">
      <h3 className="font-semibold text-md truncate">{p.bhk_type || p.title}</h3>
      <p style={{ fontFamily: "heading_font" }} className="font-bold text-xs lg:text-base whitespace-nowrap">
        ₹ {Number(p.price).toLocaleString()}/mo
      </p>
      <p className="text-gray-600 lg:group-hover:text-white text-xs truncate">{p.location}</p>
    </div>
  </article>
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
