import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import axios from "axios"; // Assuming axios is your API client
import { getCurrentUser } from "../../API/authAPI"; // Import getCurrentUser (assuming this path)
import { incrementPropertyView } from "../../API/propertiesApi"; // Import incrementPropertyView (assuming this path)
import OtpPopup from "../../pages/Properties/OtpPopup"; // Import the OtpPopup component (assuming this path)

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
  const navigate = useNavigate(); // Initialize useNavigate

  // OTP and Login state
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const otpVerified = localStorage.getItem("otp_verified") === "true";
  const [isOtpVerified, setIsOtpVerified] = useState(otpVerified);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const cache = localStorage.getItem("user");
    return !!cache; // True if 'user' item exists, false otherwise
  });

  // Fetch user login status on mount
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

  // Sync login status across tabs/windows
  useEffect(() => {
    const syncLogin = () => {
      const cache = localStorage.getItem("user");
      setIsLoggedIn(!!cache);
      // Also sync OTP verification status
      setIsOtpVerified(localStorage.getItem("otp_verified") === "true");
    };

    window.addEventListener("storage", syncLogin);
    window.addEventListener("auth-change", syncLogin); // Assuming you might dispatch a custom event on auth change
    return () => {
      window.removeEventListener("storage", syncLogin);
      window.removeEventListener("auth-change", syncLogin);
    };
  }, []);

  useEffect(() => {
    async function fetchRecent() {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "https://api.easemyspace.in/api/properties/all"
        );
        const sorted = data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 7)
          .map((p) => ({ ...p, images: parseImages(p.image) }));

        setRecentProperties(sorted);
      } catch (err) {
        console.error("Error fetching recent properties", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Function to handle click on property card
  const handlePropertyCardClick = (event, property) => {
    if (!isLoggedIn && !isOtpVerified) {
      event.preventDefault(); // Prevent the default Link navigation
      setSelectedPropertyId(property.id); // Store ID for navigation after OTP
      setShowOtpPopup(true); // Show OTP popup
    } else {
      // If already logged in or OTP verified, proceed with view increment
      const visited = JSON.parse(sessionStorage.getItem("viewedProps") || "[]");
      if (!visited.includes(property.id)) {
        incrementPropertyView(property.id);
        sessionStorage.setItem("viewedProps", JSON.stringify([...visited, property.id]));
      }
      // The <Link> component will handle the navigation to `/properties/${p.id}` naturally
      // No explicit navigate() call needed here, as the Link's default behavior is desired.
    }
  };

  if (loading) {
    return (
      <section className="py-10 md:px-10 px-6 max-w-7xl mx-auto">
        <h2
            style={{ fontFamily: "heading_font" }}
            className="text-lg lg:text-3xl mb-5 text-left text-black"
          >
            Discover the Latest Properties
          </h2>
        <div className="grid gap-12 mt-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-4 animate-pulse flex flex-col"
            >
              <div className="h-48 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-5 bg-gray-300 rounded w-1/3 mt-auto" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (recentProperties.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10">
        No recently added properties found.
      </p>
    );

  return (
    <div className="bg-zinc-50 pb-5">
      <section
      style={{ fontFamily: "para_font" }}
        className="md:px-10 px-6  rounded-2xl p-5 max-w-7xl mx-auto relative"
        aria-labelledby="new-properties-heading"
      >
        {/* Heading + Arrows */}
        <div className="flex justify-between items-center mb-6">
          <h2
            style={{ fontFamily: "heading_font" }}
            className="text-lg lg:text-3xl mb-5 text-left text-black"
          >
            Discover the Latest Properties
          </h2>
          <nav aria-label="Scroll featured properties">
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll Left"
                className="bg-white/80 backdrop-blur-md shadow-lg p-2 md:p-3 rounded-full hover:bg-gray-100 border"
              >
                <FaChevronLeft className="text-base md:text-xl text-blue-600" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll Right"
                className="bg-white/80 backdrop-blur-md shadow-lg p-2 md:p-3 rounded-full hover:bg-gray-100 border"
              >
                <FaChevronRight className="text-base md:text-xl text-blue-600" />
              </button>
            </div>
          </nav>
        </div>

        {/* Scrollable Cards */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-10 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
          >
            {recentProperties.map((p) => (
              <Link
                to={`/properties/${p.id}`}
                key={p.id}
                onClick={(e) => handlePropertyCardClick(e, p)}
                className="min-w-[270px] max-w-[270px] group bg-white rounded-2xl border border-zinc-200  transition-all duration-300 flex-shrink-0"
                aria-label={`View details of ${p.title}`}
              >
                <article className="rounded-2xl h-full flex flex-col">
                  {p.images && p.images.length > 0 ? (
                  <figure className="h-48 w-full p-3">
  <div className="h-full w-full rounded-xl overflow-hidden">
    {(() => {
      const url = p.images?.[0];
      if (!url) return null;

      const isImage = /\.(jpe?g|png|webp)$/i.test(url);
      const isVideo = /\.(mp4|mov|webm)$/i.test(url);

      return isImage ? (
        <img
          src={url}
          alt={`Property image`}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      ) : isVideo ? (
        <video
          src={url}
          controls
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : null;
    })()}
  </div>
</figure>


                  ) : (
                    <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400 italic rounded-t-2xl">
                      No Media
                    </div>
                  )}

                  <div className="p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-md text-blue-700 truncate">{p.title}</h3>
                      {p.verified && (
                        <span className="bg-green-500 text-white text-[8px] lg:text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <FiCheckCircle className="lg:text-sm text-xs" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs mb-1">{p.location}</p>
                    <p className="text-blue-600 font-bold mt-auto lg:text-base text-xs">
                      ₹ {Number(p.price).toLocaleString()}
                    </p>
                  </div>
                </article>
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