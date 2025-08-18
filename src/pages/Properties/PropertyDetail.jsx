import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FiEye, FiCheckCircle } from "react-icons/fi";
import { markPropertyAsViewed } from "../../api/userApi";
import { incrementPropertyView } from "../../api/propertiesApi";

import {
  getPropertyById,
  getPropertyVisitCount,
} from "../../api/propertiesApi";
import { getCurrentUser } from "../../api/authApi";

import PropertyAmenities from "./PropertyAmenities";
import PropertyHeaderSection from "./PropertyDetailsHero";
import LightboxViewer from "./LightboxViewer";
import PopupModal from "./PopupModal";
import PropertySkeleton from "./PropertySkeleton";
import PropertyMap from "./PropertyMap";
import RelatedProperties from "./RelatedProperties";
import Footer from "../../components/Footer";

function PropertyDetail() {
  const { id } = useParams();
  const location = useLocation();

  // ---------------- Utility Functions ----------------
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
    const possessive = firstWord.endsWith("s") ? `${firstWord}'` : `${firstWord}'s`;
    return `${possessive} listed home`;
  };

  // ---------------- Component State ----------------
  const init = location.state?.property ? enrich(location.state.property) : null;

  const [property, setProperty] = useState(init);
  const [loading, setLoading] = useState(!init);
  const [visitCount, setVisitCount] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPlanPopup, setShowPlanPopup] = useState(false);

  // ---------------- Fetch Logged-In User ----------------
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

  // ---------------- Set Paid Access ----------------
  useEffect(() => {
    const isPrivileged = ["admin", "owner"].includes(loggedInUser?.role);
    const isSubscribed = loggedInUser?.subscription_status === "paid";
    const leadPaid = localStorage.getItem("has_paid_lead") === "true";

    setHasPaid(isPrivileged || isSubscribed || leadPaid);
  }, [loggedInUser]);

  // ---------------- Fetch Property by ID ----------------
  useEffect(() => {
    setLoading(true);
    async function fetchProperty() {
      try {
        const { data } = await getPropertyById(id);
        setProperty(enrich(data));
      } catch (err) {
        console.error("Failed to fetch property:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

// recently viewed and visit trigger 

useEffect(() => {
  if (!property || !loggedInUser) return;

  const viewedProps = JSON.parse(sessionStorage.getItem("viewedProps") || "[]");

  // Increment property view only if not already counted in this session
  if (!viewedProps.includes(property.id)) {
    incrementPropertyView(property.id).catch(console.error);
    sessionStorage.setItem(
      "viewedProps",
      JSON.stringify([...viewedProps, property.id])
    );
  }

  // Always mark as viewed to update timestamp
  markPropertyAsViewed(property.id).catch(console.error);
}, [property, loggedInUser]);



  // ---------------- Fetch Property Visit Count ----------------
  useEffect(() => {
    if (!id) return;
    getPropertyVisitCount(id)
      .then((res) => setVisitCount(res?.data?.visitCount || 0))
      .catch((err) => {
        console.error("Failed to fetch visit count", err);
        setVisitCount(0);
      });
  }, [id]);

  // ---------------- Lightbox Handlers ----------------
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

  // ---------------- Render ----------------
  if (loading || !property) return <PropertySkeleton />;

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

      <main style={{ fontFamily: "para_font" }} className="w-full bg-zinc-50 min-h-screen py-5 sm:px-6 md:px-8">
        <div className="flex flex-col p-5 rounded-2xl gap-5 max-w-6xl mx-auto">

          {/* Title & Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-base lg:text-xl font-semibold text-gray-800">
              {generateTitle(property.title)}
            </div>
            {property.verified && (
              <span className="bg-green-500 text-white text-[8px] px-2 py-1 rounded-full flex items-center gap-1">
                <FiCheckCircle className="text-xs" /> Verified
              </span>
            )}
            {visitCount > 0 && (
              <span className="inline-flex items-center gap-1 lg:text-sm text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-md shadow-sm">
                <FiEye className="text-gray-500" /> {visitCount} Visits
              </span>
            )}
          </div>

          {/* Property Header Section */}
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

          {/* Essential Details */}
          <div className="mt-6 border border-gray-300 p-6 rounded-lg bg-white">
            <h2 style={{ fontFamily: "heading_font" }} className="text-[16px] lg:text-xl text-left text-black mb-4">
              Essential Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
              {[
                { label: "Rent", value: `₹${property.price || "N/A"}` },
                { label: "Deposit", value: `₹${property.deposit || "N/A"}` },
                { label: "Flat Status", value: property.flat_status || "N/A" },
                { label: "BHK Type", value: property.bhk_type || "N/A" },
                { label: "Looking For", value: property.looking_for || "N/A" },
                { label: "Occupancy", value: property.occupancy || "N/A" },
                { label: "Gender", value: property.gender || "N/A" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center text-center px-2 py-3 bg-white rounded-md lg:shadow-none lg:border-l border-b lg:border-b-0">
                  <span className="text-xs lg:text-base text-gray-600 font-medium">{item.label}</span>
                  <span className="text-xs lg:text-base text-gray-900 font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border p-6">
            <h2 style={{ fontFamily: "heading_font" }} className="text-[16px] lg:text-xl text-left text-black mb-3">
              Property Description
            </h2>
            <p className="text-gray-700 text-sm lg:text-md leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <PropertyAmenities amenities={property.amenities} property={property} />

          {/* Map */}
          <PropertyMap address={property.location} title={property.title} />
        </div>

        {/* Related Properties */}
        <RelatedProperties currentProperty={property} />
      </main>

      <Footer />
    </>
  );
}

export default PropertyDetail;
