import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { newlyListedProperties, incrementPropertyView } from "../../API/propertiesApi"; // Import incrementPropertyView
import { getCurrentUser } from "../../API/authAPI"; // Import getCurrentUser
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import OtpPopup from "../../pages/Properties/OtpPopup"; // Import the OtpPopup component

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
    async function fetchNewlyListed() {
      setLoading(true);
      try {
        const { data } = await newlyListedProperties();
        const filtered = data
          .filter((p) => p.is_newly_listed && p.status === "approved")
          .sort((a, b) => {
            const posA = a.newly_listed_position || 9999;
            const posB = b.newly_listed_position || 9999;
            return posA - posB;
          })
          .map((p) => {
            const images = parseImages(p.image);
            return { ...p, images };
          });
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
      <section className="my-16 md:px-10 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6">
          Exclusive Featured Properties
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

  if (newlyListed.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10">
        No newly listed properties found.
      </p>
    );

  return (
    <div className="bg-zinc-100 py-10">
      <section
        className="my-16 rounded-2xl bg-white p-5 max-w-7xl mx-auto relative"
        aria-labelledby="exclusive-properties-heading"
      >
        {/* Heading + Arrows */}
        <div className="flex justify-between items-center mb-6">
          <h2
            id="exclusive-properties-heading"
            className=" text-md lg:text-3xl font-bold text-blue-600"
          >
            Exclusive Featured Properties
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
            className="flex gap-10 overflow-x-auto scroll-smooth pb-4 px-10 scrollbar-hide"
            role="list"
            aria-label="List of featured properties"
          >
            {newlyListed.map((p) => (
              <Link
                // The 'to' prop is always set to the actual property detail URL.
                // The handlePropertyCardClick will prevent default if OTP is needed.
                to={`/properties/${p.id}`}
                key={p.id}
                onClick={(e) => handlePropertyCardClick(e, p)} // Pass event and property to handler
                className="min-w-[270px] max-w-[270px] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex-shrink-0"
                role="listitem"
              >
                {p.images && p.images.length > 0 ? (
                  <div className="h-48 w-full rounded-t-2xl overflow-hidden">
                    {p.images.map((url, idx) => {
                      const isImage = /\.(jpe?g|png|webp)$/i.test(url);
                      const isVideo = /\.(mp4|mov|webm)$/i.test(url);
                      return isImage ? (
                        <img
                          key={idx}
                          src={url}
                          alt={p.title || `Property image ${idx + 1}`}
                          className="h-48 w-full object-cover"
                          loading="lazy"
                        />
                      ) : isVideo ? (
                        <video
                          key={idx}
                          src={url}
                          controls
                          className="h-48 w-full object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400 italic rounded-t-2xl">
                    No Media
                  </div>
                )}

                <div className="p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-indigo-800 truncate">
                      {p.title}
                    </h3>
                    {p.verified && (
                      <span
                        className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
                        aria-label="Verified property"
                      >
                        <FiCheckCircle className="text-sm" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{p.location}</p>
                  <p className="text-indigo-600 font-bold mt-auto">
                    ₹ {Number(p.price).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OTP Popup Modal */}
      {showOtpPopup && (
        <OtpPopup
          onVerified={() => {
            setIsOtpVerified(true);
            setShowOtpPopup(false);
            if (selectedPropertyId) {
              // After successful OTP, directly navigate to the property page.
              // The property detail page is expected to fetch its own data.
              navigate(`/properties/${selectedPropertyId}`);
            }
          }}
          onClose={() => {
            setShowOtpPopup(false);
            setSelectedPropertyId(null); // Clear selected property ID
          }}
        />
      )}
    </div>
  );
}