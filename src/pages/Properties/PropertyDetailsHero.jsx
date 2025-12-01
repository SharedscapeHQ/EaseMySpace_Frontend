import { useState } from 'react';
import InfoCard from './InfoCard';

function PropertyHeaderSection({
  property,
  setLightboxIdx,
  hasPaid,
  userMobile,
  setHasPaid,
  setShowPlanPopup,
}) {
  if (!property) return null;

  const user = JSON.parse(localStorage.getItem('user'));
  const isOwner = user?.owner_code && property?.owner_code && user.owner_code === property.owner_code;

  // --- Consolidate all images from different categories ---
  const allImages = [
    property.cover,
    ...(Array.isArray(property.images) ? property.images : []),
    ...(Array.isArray(property.bedroom_images) ? property.bedroom_images : []),
    ...(Array.isArray(property.kitchen_images) ? property.kitchen_images : []),
    ...(Array.isArray(property.bathroom_images) ? property.bathroom_images : []),
    ...(Array.isArray(property.additional_images) ? property.additional_images : []),
  ].filter(Boolean); // remove null/undefined

  const mainImage = allImages[0] || '/default-property.jpg';
  const thumbnails = allImages.slice(1); // for mobile & desktop thumbnails
  const hasVideo = !!property.video;

  return (
    <div className="flex relative  lg:bg-white rounded-xl lg:border lg:p-6 flex-col lg:flex-row  justify-center items-stretch gap-5 w-full">
      {/* Main Image + Mobile Thumbnails */}
      <div className="w-full lg:w-[32rem] ">
        {/* Main Image */}
        <div
          className="w-full h-80 sm:h-[26rem] rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setLightboxIdx(0)}
        >
          <img
            src={mainImage}
            alt="main"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Mobile Thumbnails */}
        <div className="flex lg:hidden gap-3 mt-3">
          {thumbnails.slice(0, 2).map((item, idx) => (
            <div
              key={idx}
              className="h-24 w-1/3 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setLightboxIdx(idx + 1)} // +1 because main is index 0
            >
              <img
                src={item}
                alt={`thumb-${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Show video if available */}
          {hasVideo && thumbnails.length <= 2 && (
            <div
              key="video"
              className="h-24 w-1/3 relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setLightboxIdx(thumbnails.length + 1)} // after last image
            >
              <video
                src={property.video}
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-xs sm:text-sm">
                📹 Video
              </div>
            </div>
          )}

          {/* "+N" if more images exist */}
          {thumbnails.length > 2 && (
            <div
              className="h-24 w-1/3 relative rounded-lg overflow-hidden cursor-pointer bg-gray-200"
              onClick={() => setLightboxIdx(3)} // open lightbox at 4th image
            >
              <img
                src={thumbnails[2]} // preview the 4th image as background
                alt="more"
                className="w-full h-full object-cover brightness-50"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                +{thumbnails.length - 2}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Thumbnails */}
      <div className="hidden lg:flex flex-col justify-between gap-2 w-full lg:w-[16rem]">
        {/* First image slot */}
        <div
          className="h-24 w-full lg:h-48 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setLightboxIdx(1)}
        >
          {thumbnails[0] ? (
            <img
              src={thumbnails[0]}
              alt="thumb"
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="flex items-center justify-center h-full bg-gray-200 text-sm">
              No Image
            </p>
          )}
        </div>

        {/* Second slot (video or last image) */}
        <div
          className="h-24 w-full lg:h-52 relative rounded-lg overflow-hidden cursor-pointer"
          onClick={() =>
            setLightboxIdx(
              hasVideo ? thumbnails.length + 1 : thumbnails.length
            )
          }
        >
          {hasVideo ? (
            <video
              src={property.video}
              muted
              loop
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : thumbnails[1] ? (
            <img
              src={thumbnails[1]}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
          <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-center px-2 text-sm sm:text-base">
            {hasVideo
              ? `📹 Video${thumbnails.length > 1 ? ` + ${thumbnails.length} Images` : ""}`
              : `${thumbnails.length} Images`}
          </div>
        </div>
      </div>

      <InfoCard
        property={property}
        user={user}
        isOwner={isOwner}
        hasPaid={hasPaid}
        setHasPaid={setHasPaid}
        setShowPlanPopup={setShowPlanPopup}
        userMobile={userMobile}
      />
    </div>
  );
}

export default PropertyHeaderSection;
