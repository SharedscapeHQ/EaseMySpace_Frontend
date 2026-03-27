import React, { useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

function LightboxViewer({ property, lightboxIdx, setLightboxIdx, stepLightbox }) {
  if (lightboxIdx === null || !property) return null;

  // ✅ Normalize + memoize media (VERY IMPORTANT)
  const media = useMemo(() => {
    const images = property.images || [];

    const videos = property.video
      ? property.video
          .replace(/[{}]/g, "") // remove { }
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v && v.startsWith("http")) // extra safety
      : [];

    return [...images, ...videos];
  }, [property]);

  const total = media.length;

  // ✅ Safe index (no crash / no mismatch)
  const index = total > 0
    ? ((lightboxIdx % total) + total) % total
    : 0;

  const current = media[index];

  // ✅ Better detection
  const isVideo =
    typeof current === "string" &&
    (current.includes(".mp4") || current.includes("video"));


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={() => setLightboxIdx(null)}
    >
      {/* LEFT */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          stepLightbox(-1);
        }}
        className="absolute z-50 left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
      >
        <FaChevronLeft />
      </button>

      {/* MEDIA */}
      <div key={current} className="relative">
        {isVideo ? (
          <video
            key={current} // 🔥 force reload
            src={current}
            controls
            autoPlay
            muted
            playsInline
            onLoadedData={(e) => {
              e.target.play().catch(() => {});
            }}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
        ) : (
          <img
            src={current}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
        )}

        {/* COUNTER */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          {index + 1} / {total}
        </div>
      </div>

      {/* RIGHT */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          stepLightbox(1);
        }}
        className="absolute z-50 right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
      >
        <FaChevronRight />
      </button>

      {/* CLOSE */}
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
  );
}

export default LightboxViewer;