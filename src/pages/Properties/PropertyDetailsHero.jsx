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


  return (
    <div className="flex relative  bg-white rounded-xl border p-6 flex-col lg:flex-row  justify-center items-stretch gap-5 w-full">
      {/* Main Image + Mobile Thumbnails */}
      <div className="w-full lg:w-[32rem] ">
        <div
          className="w-full h-80 sm:h-[26rem] rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setLightboxIdx(0)}
        >
          <img
            src={property.cover}
            alt="main"
            className="w-full h-full object-cover"
            
          />
        </div>

       {/* Mobile Thumbnails */}
<div className="flex lg:hidden gap-3 mt-3">
  {[
    ...property.images.slice(1, 3), // next 2 images after main
    property.video ? "video" : null, // add video slot if exists
  ]
    .filter(Boolean)
    .slice(0, 3)
    .map((item, idx) => {
      if (item === "video") {
        return (
          <div
            key="video"
            className="h-24 w-1/3 relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setLightboxIdx(property.images.length)}
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
        );
      }

      return (
        <div
          key={idx}
          className="h-24 w-1/3 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setLightboxIdx(idx + 1)} // +1 because main image is index 0
        >
          <img
            src={item}
            alt={`thumb-${idx + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      );
    })}
</div>

      </div>

     {/* Desktop Thumbnails */}
<div className="hidden lg:flex flex-col justify-between gap-2 w-full lg:w-[16rem]">
  {/* First image slot */}
  <div
    className="h-24 w-full lg:h-48 rounded-lg overflow-hidden cursor-pointer"
    onClick={() => setLightboxIdx(1)}
  >
    {property.images[1] ? (
      <img
        src={property.images[1]}
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
        property.video
          ? property.images.length
          : property.images.length - 1
      )
    }
  >
    {property.video ? (
      <video
        src={property.video}
        muted
        loop
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
    ) : property.images[2] ? (
      <img
        src={property.images[2]}
        alt="preview"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full bg-gray-300" />
    )}
    <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-center px-2 text-sm sm:text-base">
      {property.video
        ? `📹 Video${property.images.length > 1 ? ` + ${property.images.length} Images` : ""}`
        : `${property.images.length} Images`}
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
