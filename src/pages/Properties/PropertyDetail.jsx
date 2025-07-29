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
import InfoItem from "./InfoItem";
import PopupModal from "./PopupModal";
import PropertySkeleton from "./PropertySkeleton";
import { getCurrentUser } from "../../API/authAPI";

function PropertyDetail() {
  const stripQuotes = (v) =>
    v == null
      ? ""
      : String(v).replace(/^"+|"+$/g, "").trim();

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

  const { id } = useParams();
  const location = useLocation();
  const init = location.state?.property ? enrich(location.state.property) : null;

  const [property, setProperty] = useState(init);
  const [loading, setLoading] = useState(!init);
  const [visitCount, setVisitCount] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPlanPopup, setShowPlanPopup] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        setLoggedInUser(user);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const isPrivileged = loggedInUser?.role === "admin" || loggedInUser?.role === "owner";
    const isSubscribed = loggedInUser?.subscription_status === "paid";
    const leadPaid = localStorage.getItem("has_paid_lead") === "true";

    setHasPaid(isPrivileged || isSubscribed || leadPaid);
  }, [loggedInUser]);

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
        .then((res) => setVisitCount(res?.data?.visitCount || 0))
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
          setHasPaid={setHasPaid}
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

          <PropertyHeaderSection
            property={property}
            lightboxIdx={lightboxIdx}
            setLightboxIdx={setLightboxIdx}
            stepLightbox={stepLightbox}
            hasPaid={hasPaid}
            userMobile={loggedInUser?.phone}
            setHasPaid={setHasPaid}
            setShowPlanPopup={setShowPlanPopup}
          />

          <div>
  <h2 className="text-xl font-bold text-indigo-700 mb-3">
    Property Description
  </h2>
  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
    {property.description}
  </p>
</div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <InfoItem label="Rent" value={`₹${property.price || "N/A"}`} />
            <InfoItem label="Deposit" value={`₹${property.deposit || "N/A"}`} />
            <InfoItem label="Flat Status" value={property.flat_status || "N/A"} />
            <InfoItem label="BHK Type" value={property.bhk_type || "N/A"} />
            <InfoItem label="Looking For" value={property.looking_for || "N/A"} />
            <InfoItem label="Occupancy" value={property.occupancy || "N/A"} />
            <InfoItem label="Gender" value={property.gender || "N/A"} />
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
