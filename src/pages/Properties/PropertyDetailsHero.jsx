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
  const isOwner =
    user?.owner_code &&
    property?.owner_code &&
    user.owner_code === property.owner_code;

  // --- Consolidate all images from different categories, remove duplicates ---
  const imageFields = [
    "images",
    "bedroom_images",
    "kitchen_images",
    "bathroom_images",
    "hall_images",
    "additional_images",
  ];

  const allImagesSet = new Set();

  imageFields.forEach((field) => {
    const arr = Array.isArray(property[field]) ? property[field] : [];
    arr.forEach((img) => img && allImagesSet.add(img));
  });

  const allImages = Array.from(allImagesSet);

  // --- Set main image ---
  const mainImage = property.cover || allImages[0] || '/default-property.jpg';

  // --- Thumbnails exclude main image to prevent double count ---
  const thumbnails = allImages.filter((img) => img !== mainImage);

  const hasVideo = !!property.video;

  // --- Total count for "+N" and lightbox navigation ---
  const totalCount = 1 + thumbnails.length + (hasVideo ? 1 : 0); // 1 for main

  return (
    <div className="flex relative lg:bg-white rounded-xl lg:border lg:p-6 flex-col lg:flex-row justify-center items-stretch gap-5 w-full">
      {/* Main Image + Mobile Thumbnails */}
      <div className="w-full lg:w-[32rem]">
        <div
          className="w-full h-80 sm:h-[26rem] rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setLightboxIdx(0)}
        >
          <img src={mainImage} alt="main" className="w-full h-full object-cover" />
        </div>

        {/* Mobile Thumbnails */}
        <div className="flex lg:hidden gap-3 mt-3">
          {thumbnails.slice(0, 2).map((item, idx) => (
            <div
              key={idx}
              className="h-24 w-1/3 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setLightboxIdx(idx + 1)}
            >
              <img src={item} alt={`thumb-${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}

          {hasVideo && thumbnails.length <= 2 && (
            <div
              className="h-24 w-1/3 relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setLightboxIdx(1 + thumbnails.length)} // after main + thumbnails
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

          {thumbnails.length > 2 && (
            <div
              className="h-24 w-1/3 relative rounded-lg overflow-hidden cursor-pointer bg-gray-200"
              onClick={() => setLightboxIdx(3)}
            >
              <img
                src={thumbnails[2]}
                alt="more"
                className="w-full h-full object-cover brightness-50"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white  text-sm sm:text-base">
                +{totalCount - 3} {/* main + 2 thumbnails visible */}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Thumbnails */}
      <div className="hidden lg:flex flex-col justify-between gap-2 w-full lg:w-[16rem]">
        <div
          className="h-24 w-full lg:h-48 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setLightboxIdx(1)}
        >
          {thumbnails[0] ? (
            <img src={thumbnails[0]} alt="thumb" className="w-full h-full object-cover" />
          ) : (
            <p className="flex items-center justify-center h-full bg-gray-200 text-sm">No Image</p>
          )}
        </div>

        <div
          className="h-24 w-full lg:h-52 relative rounded-lg overflow-hidden cursor-pointer"
          onClick={() =>
            setLightboxIdx(hasVideo ? 1 + thumbnails.length : 1 + thumbnails.length - 1)
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
            <img src={thumbnails[1]} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
          <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-center px-2 text-sm sm:text-base">
            {hasVideo ? `📹 Video + ${thumbnails.length} Images` : `${thumbnails.length} Images`}
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
