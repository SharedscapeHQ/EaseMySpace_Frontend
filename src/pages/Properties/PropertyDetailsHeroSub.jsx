function PropertyHeaderSection({ property, setLightboxIdx }) {
  if (!property) return null;

  // ✅ FIX: normalize videos
  const videos = property.video
    ? property.video
        .replace(/[{}]/g, "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

  const totalMedia = property.images.length + videos.length;

  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full rounded-xl">
      
      {/* LEFT */}
      <div
        className="w-full lg:w-3/5 h-80 sm:h-[26rem] rounded-lg overflow-hidden cursor-pointer"
        onClick={() => setLightboxIdx(0)}
      >
        <img src={property.cover} className="w-full h-full object-cover" />
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex flex-col w-full lg:w-2/5 gap-3 h-[26rem]">
        
        {/* TOP */}
        {(property.images[1] || videos[0]) && (
          <div
            className="flex-1 relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setLightboxIdx(1)}
          >
            {property.images[1] ? (
              <img src={property.images[1]} className="w-full h-full object-cover" />
            ) : (
              <video
                src={videos[0]}
                muted
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {/* BOTTOM */}
        <div
          className="flex-1 relative rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setLightboxIdx(property.images.length)}
        >
          {property.images[2] ? (
            <img src={property.images[2]} className="w-full h-full object-cover" />
          ) : videos[1] ? (
            <video
              src={videos[1]}
              muted
              autoPlay
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}

          {totalMedia > 3 && (
            <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xl">
              +{totalMedia - 3}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE */}
      <div className="flex lg:hidden gap-3 mt-3 overflow-x-auto">
        {property.images.slice(1).map((item, idx) => (
          <div
            key={idx}
            className="h-24 w-1/3 rounded-lg overflow-hidden"
            onClick={() => setLightboxIdx(idx + 1)}
          >
            <img src={item} className="w-full h-full object-cover" />
          </div>
        ))}

        {videos.map((vid, idx) => (
          <div
            key={idx}
            className="h-24 w-1/3 relative rounded-lg overflow-hidden"
            onClick={() => setLightboxIdx(property.images.length + idx)}
          >
            <video src={vid} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center">
              📹
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropertyHeaderSection;
