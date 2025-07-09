import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getPropertyById } from "../../API/propertiesApi";

/* ---------- helpers ---------- */
const parseImages = (raw) =>
  !raw
    ? []
    : Array.isArray(raw)
    ? raw
    : raw.startsWith("{")
    ? raw
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""))
        .filter(Boolean)
    : [raw];

const pickCover = (arr = []) =>
  arr.find((u) => /\.(jpe?g|png|webp|gif)$/i.test(u)) || null;

/* ---------- component ---------- */
export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const init = useLocation().state?.property
    ? enrich(useLocation().state.property)
    : null;

  /* ------------ state ------------ */
  const [property, setProperty] = useState(init);
  const [loading, setLoading] = useState(!init);
  const [error, setError] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  /* ------------ effects ------------ */
  useEffect(() => {
    if (property) return;
    getPropertyById(id)
      .then(({ data }) => setProperty(enrich(data)))
      .catch((e) =>
        setError(e.response?.data?.message || "Failed to fetch property")
      )
      .finally(() => setLoading(false));
  }, [id, property]);

  /* ------------ utils ------------ */
  function enrich(row) {
    const images = parseImages(row.image);
    return { ...row, images, cover: pickCover(images) };
  }

  const badge = (st) => {
    if (!st) return null;
    const cls =
      st.toLowerCase() === "available"
        ? "bg-green-100 text-green-700"
        : st.toLowerCase() === "booked"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-800";
    return (
      <span className={`px-3 py-[2px] text-sm rounded-full font-medium ${cls}`}>
        {st}
      </span>
    );
  };

  const handlePayment = () => {
    // TODO: integrate real gateway
    alert("Redirecting to payment gateway – ₹ 1299");
    setHasPaid(true);
  };

  const ctaLabel = hasPaid
    ? "Owner Details Unlocked"
    : "Pay ₹ 1299 & Get Owner Details";

  /* ------------ guards ------------ */
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

  /* ------------ JSX ------------ */
  return (
    <>
      {/* ---------- Lightbox ---------- */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxIdx(null)}
        >
          {/* prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx(
                (lightboxIdx -
                  1 +
                  property.images.length +
                  (property.video ? 1 : 0)) %
                  (property.images.length + (property.video ? 1 : 0))
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl font-light select-none"
          >
            ‹
          </button>

          {/* media */}
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

          {/* next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx(
                (lightboxIdx + 1) %
                  (property.images.length + (property.video ? 1 : 0))
              );
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl font-light select-none"
          >
            ›
          </button>

          {/* close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx(null);
            }}
            className="absolute top-6 right-6 text-white text-4xl leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* ---------- Main ---------- */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        {/* hero */}
        <div className="relative aspect-video overflow-hidden rounded-3xl shadow-lg">
          <img
            src={property.cover || property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
            onClick={() =>
              setLightboxIdx(
                property.images.findIndex((i) => i === property.cover)
              )
            }
          />
          <div className="absolute bottom-4 right-4 bg-white/70 backdrop-blur px-6 py-4 rounded-xl space-y-1">
            <p className="text-xl sm:text-2xl font-bold text-indigo-800">
              ₹ {property.price?.toLocaleString()}
            </p>
            {badge(property.flat_status)}
          </div>
        </div>

        {/* thumbnails */}
        {(property.images.length > 1 || property.video) && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {property.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setLightboxIdx(i)}
                className="h-16 w-16 sm:h-24 sm:w-24 object-cover rounded-lg flex-none cursor-pointer hover:ring-2 hover:ring-indigo-400 transition"
              />
            ))}
            {property.video && (
              <div
                onClick={() => setLightboxIdx(property.images.length)}
                className="h-16 w-16 sm:h-24 sm:w-24 flex-none bg-black rounded-lg cursor-pointer flex items-center justify-center text-white text-xs sm:text-sm hover:ring-2 hover:ring-indigo-400 transition"
              >
                ▶ Video
              </div>
            )}
          </div>
        )}

        {/* info grid */}
        <div className="mt-10 grid md:grid-cols-[2fr_320px] gap-8">
          {/* left */}
          <section className="space-y-8">
            <header>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-indigo-900">
                {property.title}
              </h1>
              <p className="text-gray-600 text-lg">{property.location}</p>
            </header>

            {/* phone */}
            <div className="bg-white rounded-2xl shadow p-6">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Owner Phone
              </p>
              <p
                className={`text-lg font-medium ${
                  hasPaid
                    ? "text-gray-800"
                    : "text-gray-400 blur-sm select-none"
                }`}
              >
                {property.owner_phone?.trim() || "Not available"}
              </p>
              {!hasPaid && property.owner_phone && (
                <p className="text-xs text-gray-500 mt-1">
                  Pay ₹ 1299 to reveal full number
                </p>
              )}
            </div>

            {/* description */}
            <div>
              <h2 className="text-2xl font-semibold text-indigo-800 mb-2">
                Description
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-gray-700">
                {property.description || "No description provided."}
              </p>
            </div>
          </section>

          {/* sidebar */}
          <aside>
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl p-6 space-y-4">
              <p className="text-2xl font-bold text-indigo-800">
                ₹ 1299 Only/-
              </p>
              {badge(property.flat_status)}

              <p className="text-sm bg-indigo-50 text-indigo-700 rounded-lg px-3 py-2 font-medium flex items-center gap-2">
                💼 Our service charge&nbsp;
                <span className="text-xs font-semibold">(one‑time)</span>
              </p>

              <button
                onClick={handlePayment}
                disabled={hasPaid}
                className={`w-full py-3 rounded-xl shadow-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ${
                  hasPaid
                    ? "bg-green-600 text-white cursor-default"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:to-purple-700 text-white"
                }`}
              >
                {ctaLabel}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
