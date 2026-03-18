function PropertyHeaderSection({ property, setLightboxIdx }) {
  if (!property) return null;

  const totalMedia = property.images.length + (property.video ? 1 : 0);

  return (
    <div className="flex flex-col lg:flex-row gap-5 w-full p-6 bg-white rounded-xl shadow-md border border-gray-200">
      
      {/* Left Big Image */}
      <div
        className="w-full lg:w-3/5 h-80 sm:h-[26rem] rounded-lg overflow-hidden cursor-pointer"
        onClick={() => setLightboxIdx(0)}
      >
        <img
          src={property.cover}
          alt="main"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Stacked Media */}
      <div className="hidden lg:flex flex-col w-full lg:w-2/5 gap-3 h-[26rem]">
        {/* Top Media */}
        {property.images[1] || property.video ? (
          <div
            className="flex-1 relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setLightboxIdx(1)}
          >
            {property.images[1] ? (
              <img
                src={property.images[1]}
                alt="media-1"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : property.video ? (
              <video
                src={property.video}
                muted
                loop
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
            ) : null}
          </div>
        ) : null}

        {/* Bottom Media / Overlay */}
        <div
          className="flex-1 relative rounded-lg overflow-hidden cursor-pointer"
          onClick={() =>
            setLightboxIdx(
              property.video ? property.images.length : property.images.length - 1
            )
          }
        >
          {property.images[2] ? (
            <img
              src={property.images[2]}
              alt="media-2"
              className="w-full h-full object-cover rounded-lg brightness-90"
            />
          ) : property.video ? (
            <video
              src={property.video}
              muted
              loop
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-lg" />
          )}

          {/* Overlay for additional media */}
          {totalMedia > 3 && (
            <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xl font-semibold rounded-lg">
              +{totalMedia - 3}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Thumbnails */}
      <div className="flex lg:hidden gap-3 mt-3 overflow-x-auto">
        {property.images.slice(1).map((item, idx) => (
          <div
            key={idx}
            className="h-24 w-1/3 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
            onClick={() => setLightboxIdx(idx + 1)}
          >
            <img
              src={item}
              alt={`thumb-${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {property.video && (
          <div
            key="video"
            className="h-24 w-1/3 relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
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
      </div>
    </div>
  );
}

export default PropertyHeaderSection;