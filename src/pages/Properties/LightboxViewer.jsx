import React from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

function LightboxViewer({ property, lightboxIdx, setLightboxIdx, stepLightbox }) {
  if (lightboxIdx === null || !property?.images?.length) return null;

  const media = [...(property.images || [])];
if (property.video) {
  media.push(property.video);
}

  const index = lightboxIdx;
  const total = media.length;


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={() => setLightboxIdx(null)}
    >
      {/* LEFT BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          stepLightbox(-1);
        }}
        className="absolute z-50 left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
      >
        <FaChevronLeft />
      </button>

      <div className="relative">
       {media[index].endsWith(".mp4") ? (
  <video
    src={media[index]}
    controls
    autoPlay
    className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
  />
) : (
  <img
    src={media[index]}
    alt=""
    className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
  />
)}


        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          {index + 1} / {total}
        </div>
      </div>

      {/* RIGHT BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          stepLightbox(1);
        }}
        className="absolute z-50 right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
      >
        <FaChevronRight />
      </button>

      {/* CLOSE BUTTON */}
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
