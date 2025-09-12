import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  newlyListedProperties,
} from "../../api/propertiesApi";
import { getCurrentUser } from "../../api/authApi";
import { FiCheckCircle } from "react-icons/fi";
import OtpPopup from "../../pages/Properties/OtpPopup";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoCall } from "react-icons/io5";



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
    return;
  }

  navigate(`/properties/${property.id}`);
};


  if (loading) {
    return (
      <section className="py-10 lg:px-10 px-3 max-w-7xl mx-auto">
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
        className="lg:py-10 mt-10 rounded-2xl lg:px-10 px-3 max-w-7xl mx-auto relative"
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            style={{ fontFamily: "heading_font" }}
            className="text-[16px] lg:text-3xl text-left text-black"
          >
           Top Sharing Rooms
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
                  className="min-w-[300px] max-w-[300px] group bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden shadow-md"
                >
                  {/* Image Section */}
                  <div className="relative w-full h-44 ">
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
                  <div className="p-4 flex flex-col gap-3">
                    {/* Owner Info */}
                    <p className="text-zinc-800">Owner's Contact</p>
                   <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center text-2xl justify-center text-blue-600 font-semibold">
                      {p.title?.charAt(0) || "U"}
                    </div>
                    <span className="font-medium text-sm text-gray-700">{p.title}</span>
                  </div>
                
                  <div className="flex gap-4 text-blue-500">
                    <IoChatboxEllipsesOutline className="text-2xl cursor-pointer" />
                    <IoCall className="text-2xl cursor-pointer" />
                  </div>
                </div>
                
                    {/* Book Now Button */}
                    <button style={{fontFamily:"heading_font"}} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-md mt-2">
                      Book Now
                    </button>
                
                    {/* Rent Info */}
                    <div className="text-center">
                      <p className="font-bold text-black text-base">
                       ₹ {Number(p.price).toLocaleString()}/month
                      </p>
                      <p className="text-gray-600 text-sm">
                        {p.bhk_type} in {p.location}
                      </p>
                    </div>
                
                    {/* Payment */}
                    <div className="flex items-center justify-center text-xs text-gray-500 mt-1 gap-2">
                  <span>Pay with</span>
                  <div className="flex items-center gap-2">
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google Pay"
                      className="h-4 object-contain"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png"
                      alt="Paytm"
                      className="h-4 object-contain"
                    />
                  </div>
                </div>
                
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
