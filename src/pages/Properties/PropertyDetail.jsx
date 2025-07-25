import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import {
  getPropertyById,
  getPropertyVisitCount,
} from "../../API/propertiesApi";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { FiEye, FiCheckCircle } from "react-icons/fi";
import PropertyAmenities from "./PropertyAmenities";
import PropertyHeaderSection from "./PropertyDetailsHero";

import { getCurrentUser } from "../../API/authAPI";

function PropertyDetail() {
  const stripQuotes = (v) =>
    v == null
      ? ""
      : String(v)
          .replace(/^"+|"+$/g, "")
          .trim();

  const parseImages = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map(stripQuotes).filter(Boolean);
    if (typeof raw === "string" && raw.startsWith("{")) {
      return raw.slice(1, -1).split(",").map(stripQuotes).filter(Boolean);
    }
    return [stripQuotes(raw)];
  };

  const enrich = (row) => {
    const images = parseImages(row.image);
    return {
      ...row,
      images,
      video: stripQuotes(row.video),
      cover: images[0],
    };
  };

  const { id } = useParams();
  const location = useLocation();
  const init = location.state?.property
    ? enrich(location.state.property)
    : null;

  const [visitCount, setVisitCount] = useState(null);

  const [property, setProperty] = useState(init);
  const [loading, setLoading] = useState(!init);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

useEffect(() => {
  async function fetchUser() {
    try {
      const user = await getCurrentUser();
      console.log("Fetched user:", user);
      setLoggedInUser(user); // ✅ updates state
      localStorage.setItem("user", JSON.stringify(user)); // ✅ updates cache
    } catch (err) {
      console.error(err);
    }
  }

  fetchUser();
}, []);


const [hasPaid, setHasPaid] = useState(false);

useEffect(() => {
  const isPrivileged = loggedInUser?.role === "admin" || loggedInUser?.role === "owner";
  const isSubscribed = loggedInUser?.subscription_status === "paid";
  const leadPaid = localStorage.getItem("has_paid_lead") === "true";

  setHasPaid(isPrivileged || isSubscribed || leadPaid);
}, [loggedInUser]);

  const [showPlanPopup, setShowPlanPopup] = useState(false);

  // otp state management

  const [isOtpVerified, setIsOtpVerified] = useState(() => {
    return localStorage.getItem("otp_verified") === "true";
  });

  const [resending, setResending] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const cache = localStorage.getItem("user");
    return !!cache;
  });

  const [showFullDesc, setShowFullDesc] = useState(() => {
    return localStorage.getItem("otp_verified") === "true";
  });

  const [otpPopupPurpose, setOtpPopupPurpose] = useState("Read More");

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [userMobile, setUserMobile] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const syncLogin = () => {
      const cache = localStorage.getItem("user");
      setIsLoggedIn(!!cache);
    };

    window.addEventListener("storage", syncLogin);
    window.addEventListener("auth-change", syncLogin);
    return () => {
      window.removeEventListener("storage", syncLogin);
      window.removeEventListener("auth-change", syncLogin);
    };
  }, []);

  useEffect(() => {
    if (!property) {
      getPropertyById(id)
        .then(({ data }) => setProperty(enrich(data)))
        .finally(() => setLoading(false));
    }
  }, [id, property]);

  useEffect(() => {
    if (id) {
      getPropertyVisitCount(id)
        .then((res) => {
          setVisitCount(res?.data?.visitCount || 0);
        })
        .catch((err) => {
          console.error("Failed to fetch visit count", err);
          setVisitCount(0);
        });
    }
  }, [id]);

  const stepLightbox = useCallback(
    (dir) => {
      if (!property) return;
      const total = property.images.length + (property.video ? 1 : 0);
      setLightboxIdx((idx) => (idx + dir + total) % total);
    },
    [property]
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (lightboxIdx !== null && e.key === "ArrowLeft") stepLightbox(-1);
      if (lightboxIdx !== null && e.key === "ArrowRight") stepLightbox(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIdx, stepLightbox]);

  const generateTitle = (title) => {
    if (!title) return "Property Listing";
    const firstWord = title.trim().split(" ")[0];
    const possessive = firstWord.endsWith("s")
      ? `${firstWord}'`
      : `${firstWord}'s`;
    return `${possessive} listed home`;
  };

  useEffect(() => {
    if (otpSent) {
      const timeout = setTimeout(() => {
        const input = document.getElementById("otpInput");
        input?.focus();
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [otpSent]);

  const handleSendOtp = async () => {
    if (userMobile.length === 10) {
      try {
        setResending(true);

        const res = await axios.post(
          "https://api.easemyspace.in/api/leads/send-otp",
          {
            phone: userMobile,
          }
        );

        if (res.data.message === "otp_sent") {
          setOtpSent(true);
          alert("OTP sent successfully!");
        } else {
          alert(res.data.message || "Failed to send OTP.");
        }
      } catch (err) {
        alert("Error sending OTP. Please try again.");
      } finally {
        setResending(false);
      }
    } else {
      alert("Enter valid 10-digit mobile number");
    }
  };

  const handleVerifyOtp = async () => {
  const formattedPhone = userMobile.startsWith("+91")
    ? userMobile
    : `+91${userMobile}`;

  try {
    const res = await axios.post(
      "https://api.easemyspace.in/api/leads/verify-otp",
      {
        phone: formattedPhone,
        code: userOtp,
      }
    );

    if (res.data.verified === true) {
      console.log("📦 Verified Lead Data:", res.data.lead);
      setIsOtpVerified(true);
      localStorage.setItem("otp_verified", "true");
      setShowOtpPopup(false);
      setShowFullDesc(true);
      alert("OTP verified successfully!");

      // 👇 Check lead subscription status here
      const lead = res.data.lead;
      if (lead.subscription_status === "paid") {
        setHasPaid(true);
        localStorage.setItem("has_paid_lead", "true");
      } else {
        localStorage.setItem("has_paid_lead", "false");
      }

    } else {
      alert(res.data.message || "Invalid OTP.");
    }
  } catch (err) {
    alert("Error verifying OTP.");
  }
};


  if (loading || !property)
    return (
      <main className="w-full min-h-screen bg-[#f2f2f2] py-5 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col bg-white p-5 rounded-2xl gap-4 max-w-6xl mx-auto animate-pulse">
          {/* Title & Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-6 w-40 bg-gray-300 rounded" />
            <div className="h-5 w-20 bg-green-300 rounded" />
            <div className="h-5 w-16 bg-gray-300 rounded" />
          </div>

          {/* Images */}
          <div className="flex flex-col lg:flex-row justify-center items-start gap-5 w-full">
            <div className="w-full lg:w-[32rem] h-80 sm:h-[26rem] bg-gray-300 rounded-2xl" />
            <div className="flex flex-col gap-5 w-full lg:w-[16rem]">
              <div className="h-40 sm:h-48 bg-gray-300 rounded-2xl" />
              <div className="h-40 sm:h-48 bg-gray-300 rounded-2xl" />
            </div>
            <div className="flex flex-col gap-5 w-full lg:w-[24rem]">
              <div className="h-48 bg-gray-200 rounded-2xl p-6 flex flex-col justify-between gap-3">
                <div className="h-5 w-32 bg-gray-300 rounded" />
                <div className="h-5 w-24 bg-gray-300 rounded" />
                <div className="h-10 bg-indigo-300 rounded" />
              </div>
              <div className="h-24 bg-gray-200 rounded-2xl p-4" />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="h-6 w-48 bg-gray-300 rounded mb-3" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Info Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 px-4 py-3 rounded-xl shadow-sm h-16"
              />
            ))}
          </div>

          {/* Amenities */}
          <div>
            <div className="h-6 w-40 bg-gray-300 rounded mt-8 mb-3" />
          </div>
        </div>
      </main>
    );

  return (
    <>
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              stepLightbox(-1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
          >
            <FaChevronLeft />
          </button>
          <div className="relative">
            {lightboxIdx === property.images.length ? (
              <video
                src={property.video}
                controls
                autoPlay
                className="max-h-[90vh] max-w-[90vw] rounded-lg"
              />
            ) : (
              <img
                src={property.images[lightboxIdx]}
                alt=""
                className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              />
            )}
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
              {lightboxIdx + 1} /{" "}
              {property.images.length + (property.video ? 1 : 0)}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              stepLightbox(1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
          >
            <FaChevronRight />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx(null);
            }}
            className="absolute top-6 right-6 text-white text-4xl"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {showPlanPopup && (
        <PopupModal
          onClose={() => setShowPlanPopup(false)}
          hasPaid={hasPaid}
          isLoggedIn={isLoggedIn}
          isOtpVerified={isOtpVerified}
          userMobile={userMobile}
          setHasPaid={setHasPaid}
          setShowOtpPopup={setShowOtpPopup}
          setOtpPopupPurpose={setOtpPopupPurpose}
        />
      )}

      <main className="w-full min-h-screen bg-[#f2f2f2] py-5 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col bg-white p-5 rounded-2xl gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-xl font-semibold text-gray-800">
              {generateTitle(property.title)}
            </div>

            {property.verified && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                <FiCheckCircle className="text-sm" />
                Verified
              </span>
            )}
            {visitCount > 0 && (
              <span className="inline-flex items-center gap-1 text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-md shadow-sm">
                <FiEye className="text-gray-500" />
                {visitCount} Visits
              </span>
            )}
          </div>

          {/* Cover image and side images */}
          <PropertyHeaderSection
            property={property}
            lightboxIdx={lightboxIdx}
            setLightboxIdx={setLightboxIdx}
            stepLightbox={stepLightbox}
            hasPaid={hasPaid}
            isLoggedIn={isLoggedIn}
            isOtpVerified={isOtpVerified}
            userMobile={userMobile}
            setHasPaid={setHasPaid}
            setShowOtpPopup={setShowOtpPopup}
            setOtpPopupPurpose={setOtpPopupPurpose}
            setShowPlanPopup={setShowPlanPopup}
          />

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-indigo-700 mb-3">
              Property Description
            </h2>
            {showFullDesc || isLoggedIn ? (
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            ) : (
              <div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description?.slice(0, 180)}...
                </p>
                <button
                  className="mt-2 text-blue-600 hover:underline text-sm font-medium"
                  onClick={() => {
                    setOtpPopupPurpose("Read More");
                    setShowOtpPopup(true);
                  }}
                >
                  Read More
                </button>
              </div>
            )}

            {showOtpPopup && (
              <div
                key={otpSent ? "otp-mode" : "mobile-mode"}
                className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
              >
                <div className="bg-white rounded-xl p-6 w-80 shadow-lg relative">
                  <button
                    onClick={() => setShowOtpPopup(false)}
                    className="absolute top-2 right-3 text-gray-500 text-xl"
                  >
                    ×
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Verify to {otpPopupPurpose}
                  </h3>

                  <input
                    type="text"
                    placeholder="Enter your mobile number"
                    maxLength={10}
                    className="w-full mb-2 px-3 py-2 border border-gray-300 rounded"
                    value={userMobile}
                    onChange={(e) => setUserMobile(e.target.value)}
                  />

                  {otpSent && (
                    <>
                      <input
                        id="otpInput"
                        type="text"
                        placeholder="Enter OTP"
                        className="w-full mb-2 px-3 py-2 border border-gray-300 rounded"
                        value={userOtp}
                        onChange={(e) => setUserOtp(e.target.value)}
                      />
                      <button
                        onClick={handleSendOtp}
                        className="text-indigo-600 text-sm mb-2 hover:underline disabled:text-gray-400"
                        disabled={resending}
                      >
                        Resend OTP
                      </button>
                    </>
                  )}

                  {!otpSent ? (
                    <button
                      onClick={handleSendOtp}
                      className="w-full bg-indigo-600 text-white py-2 rounded mt-2 font-medium"
                    >
                      Send OTP
                    </button>
                  ) : (
                    <button
                      onClick={handleVerifyOtp}
                      className="w-full bg-green-600 text-white py-2 rounded mt-2 font-medium"
                    >
                      Verify OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <InfoItem label="Rent" value={`₹${property.price || "N/A"}`} />
              <InfoItem label="Deposit" value={`₹${property.deposit || "N/A"}`} />
              <InfoItem
                label="Flat Status"
                value={property.flat_status || "N/A"}
              />
              <InfoItem label="BHK Type" value={property.bhk_type || "N/A"} />
              <InfoItem
                label="Looking For"
                value={property.looking_for || "N/A"}
              />
              <InfoItem label="Occupancy" value={property.occupancy || "N/A"} />
              <InfoItem label="Gender" value={property.gender || "N/A"} />
            </div>
          </div>

          <PropertyAmenities
            amenities={property.amenities}
            property={property}
          />
        </div>
      </main>
    </>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="bg-gray-50 px-4 py-3 rounded-xl shadow-sm">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  );
}
function PopupModal({
  onClose,
  hasPaid,
  isLoggedIn,
  isOtpVerified,
  userMobile,
  setShowOtpPopup,
  setOtpPopupPurpose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative overflow-y-auto max-h-[90vh] animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-3xl text-gray-400 hover:text-red-500 transition"
        >
          ×
        </button>

        {/* Plan Badge */}
        <div className="text-sm font-semibold uppercase text-white bg-gradient-to-r from-emerald-500 to-emerald-600 w-fit px-4 py-1 rounded-full mb-6 shadow">
          EMS Starter Plan
        </div>

        {/* Pricing Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Freedom to Find Your Perfect Match
            </h2>
            <p className="text-base text-gray-600">
              Full access to verified owners & properties for 30 days.
            </p>
          </div>
          <div className="text-right mt-4 sm:mt-0">
            <div className="text-xl text-gray-400 line-through">₹1699</div>
            <div className="text-3xl font-bold text-indigo-700">
              ₹1499{" "}
              <span className="text-lg font-medium text-gray-500">+ GST</span>
            </div>
            <div className="text-sm text-green-600 font-semibold">
              Save ₹200!
            </div>
          </div>
        </div>

        {/* Features */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base text-gray-800 mb-8">
          {[
            "✅ Unlimited Contact Access for 30 days",
            "✅ Help in scheduling visit at convenient time",
            "✅ Priority WhatsApp & Call Support",
            "✅ 100% Verified Owner Listings",
            "✅ Smart Match Recommendations",
            "✅ Curated Property Suggestions",
            "✅ Save Hours - Match Within Days",
          ].map((feature, idx) => (
            <li
              key={idx}
              className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              {feature}
            </li>
          ))}
        </ul>

        {/* Call to Action */}
        <div className="text-center">
          <button
            className={`w-1/3 py-3 text-xl font-semibold rounded-xl transition-all ${
              hasPaid
                ? "bg-green-600 text-white cursor-default"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            disabled={hasPaid}
            onClick={() => {
              if (isLoggedIn || isOtpVerified) {
                const mobileToUse = isLoggedIn ? "9999999999" : userMobile;
                // Dispatch event with data
                const event = new CustomEvent("initiate-payment", {
                  detail: { amount: 1499, mobile: mobileToUse },
                });
                document.dispatchEvent(event);
              } else {
                setOtpPopupPurpose("Continue Payment");
                setShowOtpPopup(true);
              }
            }}
          >
            {hasPaid ? "Owner Details Unlocked" : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;
