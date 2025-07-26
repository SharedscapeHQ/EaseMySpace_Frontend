import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  getPropertyById,
  getPropertyVisitCount,
} from "../../API/propertiesApi";
import { FiEye, FiCheckCircle } from "react-icons/fi";
import PropertyAmenities from "./PropertyAmenities";
import PropertyHeaderSection from "./PropertyDetailsHero";
import LightboxViewer from "./LightboxViewer";
import OtpPopup from "./OtpPopup";
import InfoItem from "./InfoItem";
import PopupModal from "./PopupModal";
import PropertySkeleton from "./PropertySkeleton";



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

  const generateTitle = (title) => {
    if (!title) return "Property Listing";
    const firstWord = title.trim().split(" ")[0];
    const possessive = firstWord.endsWith("s")
      ? `${firstWord}'`
      : `${firstWord}'s`;
    return `${possessive} listed home`;
  };

  // ─── Params and Initial State ───────────────────────────────────────
  const { id } = useParams();
  const location = useLocation();
  const init = location.state?.property ? enrich(location.state.property) : null;

  // ─── Component State ────────────────────────────────────────────────
  const [property, setProperty] = useState(init);
  const [loading, setLoading] = useState(!init);
  const [visitCount, setVisitCount] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);

  const otpVerified = localStorage.getItem("otp_verified") === "true";
  const [isOtpVerified, setIsOtpVerified] = useState(otpVerified);
  const [showFullDesc, setShowFullDesc] = useState(otpVerified);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const cache = localStorage.getItem("user");
    return !!cache;
  });

  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpPopupPurpose, setOtpPopupPurpose] = useState("Read More");



  // ─── Effects ────────────────────────────────────────────────────────

  // Fetch logged-in user on load
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        setLoggedInUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (err) {
        console.error(err);
      }
    }

    fetchUser();
  }, []);

  // Determine if user or lead has paid access
  useEffect(() => {
    const isPrivileged = loggedInUser?.role === "admin" || loggedInUser?.role === "owner";
    const isSubscribed = loggedInUser?.subscription_status === "paid";
    const leadPaid = localStorage.getItem("has_paid_lead") === "true";

    setHasPaid(isPrivileged || isSubscribed || leadPaid);
  }, [loggedInUser]);

  // Sync login state on storage or auth changes
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

  // Fetch property by ID if not already set
  useEffect(() => {
    if (!property) {
      getPropertyById(id)
        .then(({ data }) => setProperty(enrich(data)))
        .finally(() => setLoading(false));
    }
  }, [id, property]);

  // Fetch visit count
  useEffect(() => {
    if (id) {
      getPropertyVisitCount(id)
        .then((res) => setVisitCount(res?.data?.visitCount || 0))
        .catch((err) => {
          console.error("Failed to fetch visit count", err);
          setVisitCount(0);
        });
    }
  }, [id]);

  // Handle keyboard navigation in lightbox
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

 
  if (loading || !property) {
  return <PropertySkeleton />;
}

  return (
    <>
     {lightboxIdx !== null && (
  <LightboxViewer
    property={property}
    lightboxIdx={lightboxIdx}
    setLightboxIdx={setLightboxIdx}
    stepLightbox={stepLightbox}
  />
)}

      {showPlanPopup && (
        <PopupModal
          onClose={() => setShowPlanPopup(false)}
          hasPaid={hasPaid}
          isLoggedIn={isLoggedIn}
          isOtpVerified={isOtpVerified}
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
  <OtpPopup
    otpPopupPurpose={otpPopupPurpose}
    onVerified={(hasPaidStatus) => {
      setIsOtpVerified(true);
      setHasPaid(hasPaidStatus);
      setShowFullDesc(true);
    }}
    onClose={() => setShowOtpPopup(false)}
  />
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



export default PropertyDetail;
