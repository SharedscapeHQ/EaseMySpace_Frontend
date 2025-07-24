import PaymentButton from './PaymentButton';

function PropertyHeaderSection({
  property,
  setLightboxIdx,
  hasPaid,
  isLoggedIn,
  isOtpVerified,
  userMobile,
  setHasPaid,
  setShowOtpPopup,
  setOtpPopupPurpose,
  setShowPlanPopup
}) {
  if (!property) return null;

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start gap-5 w-full">
      {/* Main image */}
      <div
        className="w-full lg:w-[32rem] h-80 sm:h-[26rem] rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => setLightboxIdx(0)}
      >
        <img src={property.cover} alt="main" className="w-full h-full object-cover" />
      </div>

      {/* Thumbnails */}
      <div className="flex flex-col gap-5 w-full lg:w-[16rem]">
        <div
          className="h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => setLightboxIdx(1)}
        >
          {property.images[1] ? (
            <img src={property.images[1]} alt="thumb" className="w-full h-full object-cover" />
          ) : (
            <p className="flex items-center justify-center h-full bg-gray-200 text-sm">No Image</p>
          )}
        </div>

        <div
          className="h-40 sm:h-48 relative rounded-2xl overflow-hidden cursor-pointer"
          onClick={() =>
            setLightboxIdx(property.video ? property.images.length : property.images.length - 1)
          }
        >
          {property.images[2] ? (
            <img src={property.images[2]} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
          <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-center px-2 font-semibold text-sm sm:text-base">
            {property.video
              ? `📹 Video + ${property.images.length} Images`
              : `${property.images.length} Images`}
          </div>
        </div>
      </div>

      {/* Owner contact and location */}
      <div className="flex flex-col justify-between gap-5 w-full lg:w-[24rem]">
        {/* Owner Contact + Payment */}
        <div className="w-full h-auto bg-white border border-zinc-200 rounded-2xl overflow-hidden p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Owner's Contact</h2>
            <div className="text-gray-700 text-base">
              {hasPaid ? (
                <span className="font-medium">📞 {property.owner_phone || 'Unavailable'}</span>
              ) : (
                <span className="font-medium">📞 +91xxxxxxx</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-gray-600 text-sm mb-1">
              One-time Service Fee
              <button
                onClick={() => setShowPlanPopup(true)}
                className="text-sm text-blue-600 ml-2 hover:text-blue-800 transition"
              >
                <span className="inline-flex items-center underline space-x-1">
                  What’s included?
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </span>
              </button>
            </p>
          </div>

          <PaymentButton
            hasPaid={hasPaid}
            isLoggedIn={isLoggedIn}
            isOtpVerified={isOtpVerified}
            userMobile={userMobile}
            setHasPaid={setHasPaid}
            setShowOtpPopup={setShowOtpPopup}
            setOtpPopupPurpose={setOtpPopupPurpose}
          />
        </div>

        {/* Location Box */}
        <div className="w-full">
          <div className="w-full bg-zinc-100 border border-gray-300 rounded-2xl flex items-center justify-between p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl">📍</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">
                  In {property.location || 'Unknown Location'}
                </span>
                <span className="text-sm text-gray-700">
                  <span className="text-green-500 font-medium">
                    {property.distance_from_station || 'N/A'}
                  </span>
                </span>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps?q=${encodeURIComponent(property.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              See on Map
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyHeaderSection;
