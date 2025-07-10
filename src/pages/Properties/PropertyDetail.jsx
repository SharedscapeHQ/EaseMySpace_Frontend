import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getPropertyById } from "../../API/propertiesApi";
import { motion } from "framer-motion";
import { FiLock, FiUnlock } from "react-icons/fi";

const stripQuotes = (v) =>
  v == null ? "" : String(v).replace(/^"+|"+$/g, "").trim();

const parseImages = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(stripQuotes).filter(Boolean);
  if (typeof raw === "string" && raw.startsWith("{")) {
    return raw
      .slice(1, -1)
      .split(",")
      .map(stripQuotes)
      .filter(Boolean);
  }
  return [stripQuotes(raw)];
};

const pickCover = (arr = []) =>
  arr.find((u) => /\.(jpe?g|png|webp|gif)$/i.test(u)) || null;

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const init = useLocation().state?.property
    ? enrich(useLocation().state.property)
    : null;

  const [property, setProperty] = useState(init);
  const [loading, setLoading] = useState(!init);
  const [error, setError] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    if (property) return;
    getPropertyById(id)
      .then(({ data }) => setProperty(enrich(data)))
      .catch((e) =>
        setError(e.response?.data?.message || "Failed to fetch property")
      )
      .finally(() => setLoading(false));
  }, [id, property]);

  const stepLightbox = useCallback(
    (dir) => {
      if (!property) return;
      const total = property.images.length + (property.video ? 1 : 0);
      setLightboxIdx((idx) => (idx + dir + total) % total);
    },
    [property]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (lightboxIdx !== null && e.key === "ArrowLeft") stepLightbox(-1);
      if (lightboxIdx !== null && e.key === "ArrowRight") stepLightbox(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, stepLightbox]);

  function enrich(row) {
    const images = parseImages(row.image);
    return {
      ...row,
      images,
      video: stripQuotes(row.video),
      cover: pickCover(images),
    };
  }

  const badge = (st) => {
    if (!st) return null;
    const map = {
      available: "bg-green-100 text-green-700",
      booked: "bg-red-100 text-red-700",
    };
    const cls = map[st.toLowerCase()] || "bg-yellow-100 text-yellow-800";
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`px-3 py-[2px] text-sm font-medium rounded-full ${cls}`}
      >
        {st}
      </motion.span>
    );
  };

  const handlePayment = () => {
    alert("Redirecting to payment gateway – ₹ 1299");
    setHasPaid(true);
  };

  if (loading)
    return <p className="pt-28 text-center text-sky-600">Loading details…</p>;
  if (error)
    return (
      <div className="pt-28 text-center text-red-600">
        {error}
        <button
          onClick={() => navigate(-1)}
          className="underline ml-1 text-indigo-600"
        >
          go back
        </button>
      </div>
    );
  if (!property) return <p className="pt-28 text-center">Not found</p>;

  return (
    <>
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              stepLightbox(-1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
          >
            ‹
          </button>
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              stepLightbox(1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
          >
            ›
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx(null);
            }}
            className="absolute top-6 right-6 text-white text-4xl"
          >
            ×
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8 mt-6">
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-md aspect-[3/2] relative">
              <img
                src={property.cover || property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() =>
                  setLightboxIdx(
                    property.images.findIndex((i) => i === property.cover)
                  )
                }
              />
              <div className="absolute bottom-4 right-4 bg-white/90 px-5 py-2 rounded-xl">
                <p className="text-lg font-bold text-indigo-700">
                  ₹ {property.price?.toLocaleString()}
                </p>
                {badge(property.flat_status)}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {property.images.slice(0, 4).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setLightboxIdx(i)}
                  className="h-20 w-full object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-indigo-400"
                  alt=""
                />
              ))}
              {property.video && (
                <div
                  onClick={() => setLightboxIdx(property.images.length)}
                  className="bg-black text-white flex items-center justify-center text-xs rounded-lg cursor-pointer h-20"
                >
                  ▶ Video
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-indigo-900">
                {property.title}
              </h1>
              <p className="text-gray-600 text-lg">{property.location}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-indigo-50 border-l-4 border-indigo-500 px-6 py-4 rounded-xl shadow-sm"
            >
              <h2 className="text-xl font-bold text-indigo-700 mb-2">
                Property Description
              </h2>
              <blockquote className="text-gray-700 italic">
                “{property.description || "No description provided."}”
              </blockquote>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-white shadow rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">Built-up</p>
                <p className="text-lg font-semibold text-indigo-800">
                  {property.sqft || "-"} sqft
                </p>
              </div>
              <div className="bg-white shadow rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">Occupancy</p>
                <p className="text-lg font-semibold text-indigo-800">
                  {property.occupancy || "-"}
                </p>
              </div>
              <div className="bg-white shadow rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">BHK</p>
                <p className="text-lg font-semibold text-indigo-800">
                  {property.bhk || "-"}
                </p>
              </div>
              <div className="bg-white shadow rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">Bath</p>
                <p className="text-lg font-semibold text-indigo-800">
                  {property.attachedBath || "-"}
                </p>
              </div>
              <div className="bg-white shadow rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-semibold text-indigo-800">
                  {property.flat_status || "-"}
                </p>
              </div>
            </div>
            {property.location && (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="rounded-xl overflow-hidden shadow-lg mt-6"
  >
    <h2 className="text-xl font-bold text-indigo-700 mb-2">📍 Location Area</h2>
    <iframe
      title="Map View"
      width="100%"
      height="300"
      loading="lazy"
      allowFullScreen
      className="rounded-xl border"
      src={`https://www.google.com/maps?q=${encodeURIComponent(
        property.location
      )}&z=15&output=embed`}
    ></iframe>
  </motion.div>
)}

          </div>

          <aside className="sticky top-24 self-start">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl bg-white shadow-2xl p-6 space-y-5 overflow-hidden"
            >
              <motion.div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
              <div className="text-center">
                <p className="text-4xl font-extrabold text-indigo-700">₹1299</p>
                <p className="text-sm font-medium text-gray-500">
                  One-time service charge
                </p>
              </div>

              <div className="flex justify-center">{badge(property.flat_status)}</div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl backdrop-blur-lg bg-white/70 border border-indigo-100 p-4 shadow-inner"
              >
                <p className="text-xs font-semibold mb-2 text-indigo-600 uppercase">
                  Owner Phone
                </p>
                <div className="flex items-center gap-3">
                  {hasPaid ? (
                    <>
                      <FiUnlock className="text-green-600 text-lg" />
                      <span className="font-semibold text-gray-900 tracking-wide">
                        {property.owner_phone}
                      </span>
                    </>
                  ) : (
                    <>
                      <FiLock className="text-gray-500 text-lg" />
                      <span className="text-gray-600 font-semibold tracking-wider">
                        +91xxxxxxx
                      </span>
                    </>
                  )}
                </div>
              </motion.div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={handlePayment}
                disabled={hasPaid}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out ${
                  hasPaid
                    ? "bg-green-600 text-white cursor-default"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl"
                }`}
              >
                {hasPaid
                  ? "Owner Details Unlocked"
                  : "Pay ₹1299 & Get Owner Details"}
              </motion.button>
            </motion.div>
          </aside>
        </div>
      </div>
    </>
  );
}
