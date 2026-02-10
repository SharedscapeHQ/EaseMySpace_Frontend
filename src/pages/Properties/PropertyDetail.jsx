import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FiEye, FiCheckCircle } from "react-icons/fi";
import { markPropertyAsViewed, getUnlockedLeads } from "../../api/userApi";
import {
  incrementPropertyView,
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
import LoginPromptModal from "./LoginPromptModal";
import EssentialDetails from "./EssentialDetails";
import EssentialDetailsSub from "./EssentailDetailsSub";
import SavePropertyButton from "./SavePropertyButton";
import PropertyHeaderSectionSub from "./PropertyDetailsHeroSub";

function PropertyDetail() {
  const { id } = useParams();
  const location = useLocation();

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
    const allImageFields = [
      "image",
      "bedroom_images",
      "kitchen_images",
      "bathroom_images",
      "hall_images",
      "additional_images",
    ];

    const images = allImageFields
      .map((field) => parseImages(row[field]))
      .flat(); // flatten array of arrays

    return {
      ...row,
      images,
      video: stripQuotes(row.video),
      cover: images[0], // first available image
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

  const init = location.state?.property
    ? enrich(location.state.property)
    : null;

  const [property, setProperty] = useState(init);
  const [loading, setLoading] = useState(!init);
  const [visitCount, setVisitCount] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [unlockedPropertyIds, setUnlockedPropertyIds] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        if (!user || !user.id) {
          setShowLoginPopup(true);
          setLoggedInUser(null);
        } else {
          setLoggedInUser(user);
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setShowLoginPopup(true);
        setLoggedInUser(null);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const isPrivileged = ["admin", "owner"].includes(loggedInUser?.role);
    const isSubscribed = loggedInUser?.subscription_status === "paid";
    const leadPaid = localStorage.getItem("has_paid_lead") === "true";
    setHasPaid(isPrivileged || isSubscribed || leadPaid);
  }, [loggedInUser]);

  useEffect(() => {
    setLoading(true);

    async function fetchProperty() {
      try {
        const res = await getPropertyById(id);

        const enriched = enrich(res.data);

        setProperty(enriched);
      } catch (err) {
        console.error("❌ Failed to fetch property:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (!loggedInUser) return;
    async function fetchUnlocked() {
      try {
        const leads = await getUnlockedLeads();
        setUnlockedPropertyIds(leads);
      } catch (err) {
        console.error("Failed to fetch unlocked properties", err);
      }
    }
    fetchUnlocked();
  }, [loggedInUser]);

  useEffect(() => {
    if (!property || !loggedInUser) return;
    const viewedProps = JSON.parse(
      sessionStorage.getItem("viewedProps") || "[]",
    );
    if (!viewedProps.includes(property.id)) {
      incrementPropertyView(property.id).catch(console.error);
      sessionStorage.setItem(
        "viewedProps",
        JSON.stringify([...viewedProps, property.id]),
      );
    }
    markPropertyAsViewed(property.id).catch(console.error);
  }, [property, loggedInUser]);

  useEffect(() => {
    if (!id) return;
    getPropertyVisitCount(id)
      .then((res) => setVisitCount(res?.data?.visitCount || 0))
      .catch((err) => {
        console.error("Failed to fetch visit count", err);
        setVisitCount(0);
      });
  }, [id]);

  const stepLightbox = useCallback(
    (dir) => {
      if (!property) return;
      const total = property.images.length + (property.video ? 1 : 0);
      setLightboxIdx((idx) => (idx + dir + total) % total);
    },
    [property],
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

  useMemo(() => {
    return (
      loggedInUser?.role === "admin" ||
      loggedInUser?.role === "owner" ||
      loggedInUser?.owner_code === property?.owner_code ||
      unlockedPropertyIds.some((pid) => String(pid) === String(property?.id))
    );
  }, [loggedInUser, unlockedPropertyIds, property?.id]);

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

      <main
        style={{ fontFamily: "universal_font" }}
        className="w-full bg-zinc-50 min-h-screen py-5 sm:px-6 md:px-8"
      >
        <div className="flex flex-col p-5 rounded-2xl gap-5 max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap">
            {/* Left side */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-base lg:text-2xl  text-gray-800">
                {generateTitle(property.title)}
              </div>
              {property.verified && (
                <span className="bg-green-500 text-white text-[8px] lg:text-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <FiCheckCircle className="text-xs lg:text-sm" /> Verified
                </span>
              )}
              {(() => {
                if (!property.created_at) return null;

                const created = new Date(property.created_at);
                const now = new Date();
                const diffDays = Math.floor(
                  (now - created) / (1000 * 60 * 60 * 24),
                );

                if (diffDays > 10) return null;

                let label = "";
                if (diffDays === 0) label = "Added today";
                else if (diffDays === 1) label = "Added 1 day ago";
                else label = `Added ${diffDays} days ago`;

                return (
                  <span className="bg-blue-500 text-white text-[8px] lg:text-sm px-2 py-1 rounded-full flex items-center gap-1">
                    {label}
                  </span>
                );
              })()}
              {/* {visitCount > 0 && (
      <span className="inline-flex items-center gap-1 lg:text-sm text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-md shadow-sm">
        <FiEye className="text-gray-500" /> {visitCount} Visits
      </span>
    )} */}
            </div>

            {/* Right side */}

            <SavePropertyButton propertyId={property.id} />
          </div>

          {property.owner_code === "subdomainEMS221" ? (
            <PropertyHeaderSectionSub
              property={property}
              setLightboxIdx={setLightboxIdx}
              hasPaid={hasPaid}
              userMobile={loggedInUser?.phone}
              setHasPaid={setHasPaid}
              setShowPlanPopup={setShowPlanPopup}
            />
          ) : (
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
          )}

          {property.owner_code === "subdomainEMS221" ? (
            <EssentialDetailsSub
              property={property}
              onPaymentSuccess={(roomLabel, occupancy) => {
                setProperty((prev) => ({
                  ...prev,
                  pricingOptions: prev.pricingOptions.map((room) =>
                    room.room_label === roomLabel
                      ? {
                          ...room,
                          occupancies: room.occupancies.map((o) =>
                            o.occupancy === occupancy
                              ? { ...o, availability: "occupied" }
                              : o,
                          ),
                        }
                      : room,
                  ),
                }));
              }}
            />
          ) : (
            <EssentialDetails
              property={property}
              onPaymentSuccess={(roomLabel, occupancy) => {
                setProperty((prev) => ({
                  ...prev,
                  pricingOptions: prev.pricingOptions.map((room) =>
                    room.room_label === roomLabel
                      ? {
                          ...room,
                          occupancies: room.occupancies.map((o) =>
                            o.occupancy === occupancy
                              ? { ...o, availability: "occupied" }
                              : o,
                          ),
                        }
                      : room,
                  ),
                }));
              }}
            />
          )}

          <div className="bg-white rounded-xl border p-6">
            <h2
              style={{ fontFamily: "para_font" }}
              className="text-[16px] lg:text-xl text-left text-black mb-3"
            >
              Property Description
            </h2>
            <p className="text-gray-700 text-sm lg:text-md leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          <PropertyAmenities
            amenities={property.amenities}
            property={property}
          />
          <PropertyMap
            location={property.location}
            pincode={property.pincode}
            title={property.title}
          />
        </div>

        <RelatedProperties currentProperty={property} />
      </main>

      {showLoginPopup && (
        <LoginPromptModal
          onClose={() => setShowLoginPopup(false)}
          onAction={() => (window.location.href = "/login")}
        />
      )}

      <Footer />
    </>
  );
}

export default PropertyDetail;
