import { useState } from 'react';
import { MdHelpOutline } from 'react-icons/md';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

function PropertyHeaderSection({ property, setLightboxIdx }) {
  if (!property) return null;

  const [showHelpPopup, setShowHelpPopup] = useState(false);

  return (
    // Entire card container
    <div className="flex flex-col lg:flex-row gap-5 w-full p-6 bg-white rounded-xl shadow-md border border-gray-200">
      
      {/* Main Image + Mobile Thumbnails */}
      <div className="w-full lg:w-3/4 flex flex-col gap-3">
        {/* Main Image */}
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
        <div className="flex lg:hidden gap-3 mt-1">
          {property.images.slice(1, 3).map((item, idx) => (
            <div
              key={idx}
              className="h-24 w-1/3 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setLightboxIdx(idx + 1)}
            >
              <img
                src={item}
                alt={`thumb-${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {property.video && property.images.length <= 3 && (
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
          )}

          {property.images.length > 3 && (
            <div
              className="h-24 w-1/3 relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setLightboxIdx(3)}
            >
              <img
                src={property.images[3]}
                alt="more"
                className="w-full h-full object-cover brightness-50"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white  text-sm sm:text-base">
                +{property.images.length - 3}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Right Section */}
      <div className="hidden lg:flex flex-col justify-between w-full lg:w-[16rem] h-[26rem] gap-4">
        {/* Creative Help Card */}
        <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl shadow-xl p-6 flex flex-col gap-4 items-center w-full transform  transition-all duration-300">
          <div className="flex flex-col items-center gap-2 text-white">
            <MdHelpOutline className="text-3xl" />
            <h3 className="text-lg ">Need Help?</h3>
            <p className="text-sm text-center">Our support team is here for you</p>
          </div>
          <div className="flex gap-4 mt-2">
            <a
              href="tel:+919004463371"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white text-xl shadow-md"
            >
              <FaPhoneAlt />
            </a>
            <a
              href={`https://wa.me/919004463371?text=${encodeURIComponent(
                "I want help regarding"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white text-xl shadow-md"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Bottom Image / Video Placeholder */}
        <div
          className="flex-1 relative cursor-pointer overflow-hidden rounded-lg"
          onClick={() =>
            setLightboxIdx(
              property.video ? property.images.length : property.images.length - 1
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
              className="w-full h-full object-cover rounded-lg"
            />
          ) : property.images[2] ? (
            <img
              src={property.images[2]}
              alt="preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-lg" />
          )}
          <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-center px-2 text-sm sm:text-base rounded-lg">
            {property.video
              ? `📹 Video${property.images.length > 1 ? ` + ${property.images.length} Images` : ""}`
              : `${property.images.length} Images`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyHeaderSection;
