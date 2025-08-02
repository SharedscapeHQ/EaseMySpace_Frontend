import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  newlyListedProperties,
  incrementPropertyView,
} from "../../api/propertiesApi";
import { getCurrentUser } from "../../api/authApi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
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

export default function NewlyListedProperties() {
  const [newlyListed, setNewlyListed] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const otpVerified = localStorage.getItem("otp_verified") === "true";
  const [isOtpVerified, setIsOtpVerified] = useState(otpVerified);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const cache = localStorage.getItem("user");
    return !!cache;
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setIsLoggedIn(false);
        localStorage.removeItem("user");
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const syncLogin = () => {
      const cache = localStorage.getItem("user");
      setIsLoggedIn(!!cache);
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
    async function fetchNewlyListed() {
      setLoading(true);
      try {
        const { data } = await newlyListedProperties();
        const filtered = data
          .filter((p) => p.is_newly_listed && p.status === "approved")
          .sort(
            (a, b) =>
              (a.newly_listed_position || 9999) -
              (b.newly_listed_position || 9999)
          )
          .map((p) => ({ ...p, images: parseImages(p.image) }));
        setNewlyListed(filtered);
      } catch (err) {
        console.error("Error fetching newly listed properties", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNewlyListed();
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const handlePropertyCardClick = (event, property) => {
    if (!isLoggedIn && !isOtpVerified) {
      event.preventDefault();
      setSelectedPropertyId(property.id);
      setShowOtpPopup(true);
    } else {
      const visited = JSON.parse(sessionStorage.getItem("viewedProps") || "[]");
      if (!visited.includes(property.id)) {
        incrementPropertyView(property.id);
        sessionStorage.setItem(
          "viewedProps",
          JSON.stringify([...visited, property.id])
        );
      }
    }
  };

  if (loading) {
    return (
      <section className="py-10 mt-10 lg:px-10 px-3 max-w-7xl mx-auto">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-lg lg:text-3xl mb-0 text-black leading-tight"
        >
          Exclusive <span className="">Featured</span>
          <span className=" block lg:hidden">Properties</span>
          <span className=" hidden lg:inline"> Properties</span>
        </h2>

        <div className="flex gap-5 overflow-x-auto scroll-smooth pb-4 scrollbar-hide mt-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[270px] max-w-[270px] group bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded-t-2xl" />

              {/* Content Skeleton */}
              <div className="p-4 flex flex-col gap-1">
                {/* Title + Verified + Price Row */}
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 bg-gray-200 rounded w-[60%]" />
                  <div className="h-4 bg-gray-300 rounded w-[30%]" />
                </div>

                {/* Verified Badge */}
                <div className="h-3 bg-gray-200 rounded w-[40%] mb-2" />

                {/* Location */}
                <div className="h-3 bg-gray-300 rounded w-[70%]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (newlyListed.length === 0)
    return (
      <p
        style={{ fontFamily: "para_font" }}
        className="text-center text-gray-500 mt-10"
      >
        No newly listed properties found.
      </p>
    );

  return (
    <div className="bg-zinc-50 ">
      <section
        style={{ fontFamily: "para_font" }}
        className="lg:py-10 mt-10 rounded-2xl lg:px-10 px-3 py-6 max-w-7xl mx-auto relative"
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            style={{ fontFamily: "heading_font" }}
            className="text-[16px] lg:text-3xl text-left text-black"
          >
            Exclusive Featured Properties
          </h2>

          <Link
            to="/view-properties"
            className="text-blue-600 text-[13px] lg:text-base font-medium hover:underline"
            style={{ fontFamily: "para_font" }}
          >
            View All
          </Link>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
            role="list"
          >
            {newlyListed.map((p) => (
              <Link
                to={`/properties/${p.id}`}
                key={p.id}
                onClick={(e) => handlePropertyCardClick(e, p)}
                className="min-w-[270px] max-w-[270px] group bg-gradient-to-r from-white to-[#cbe0fd] rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden transition-all duration-300"
              >
                {p.images?.length > 0 ? (
                  <div className="h-48 w-full p-3 pt-3 pb-0">
                    <div className="h-full w-full overflow-hidden rounded-xl">
                      {(() => {
                        const url = p.images?.[0];
                        if (!url) return null;

                        const isImage = /\.(jpe?g|png|webp)$/i.test(url);
                        const isVideo = /\.(mp4|mov|webm)$/i.test(url);

                        return isImage ? (
                          <img
                            src={url}
                            alt={p.title || `Property image`}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : isVideo ? (
                          <video
                            src={url}
                            controls
                            className="h-full w-full object-cover"
                          />
                        ) : null;
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400 italic rounded-t-2xl">
                    No Media
                  </div>
                )}

                <div className="p-4 flex flex-col gap-1">
                  {/* Top row: Title + Verified | Price */}
                  <div className="flex justify-between items-start gap-2">
                    {/* Title + Verified */}
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-md text-blue-600 truncate max-w-[160px]">
                        {p.title}
                      </h3>
                      {p.verified && (
                        <span className="bg-green-500 text-white text-[8px] px-2 py-1 rounded-full flex items-center gap-1">
                          <FiCheckCircle className="text-[10px]" />
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <p className="text-blue-600 font-bold text-xs lg:text-base whitespace-nowrap">
                      ₹ {Number(p.price).toLocaleString()}
                    </p>
                  </div>

                  {/* Location */}
                  <p className="text-gray-600 text-xs">
                    {p.location?.trim().split(/\s+/).slice(-2).join(" ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {showOtpPopup && (
        <OtpPopup
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
