import React from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

function LightboxViewer({ property, lightboxIdx, setLightboxIdx, stepLightbox }) {
  const total = property.images.length + (property.video ? 1 : 0);

  return (
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
          {lightboxIdx + 1} / {total}
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
  );
}

export default LightboxViewer;
