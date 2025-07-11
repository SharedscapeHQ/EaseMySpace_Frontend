import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getPropertyById } from '../../API/propertiesApi';
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaWifi,
  FaParking,
  FaSnowflake,
  FaTv,
  FaChair,
  FaLock,
  FaGasPump,
  FaCouch,
} from 'react-icons/fa';
import {
  MdOutlineSecurity,
  MdOutlineLocalLaundryService,
  MdOutlineElevator,
  MdOutlinePower,
} from 'react-icons/md';
import { FaShower } from 'react-icons/fa';

const knownAmenities = [
  'wifi',
  'parking',
  'air conditioning',
  'refrigerator',
  'washing machine',
  'cctv',
  'security',
  'geyser',
  'lift',
  'power backup',
  'furniture',
  'tv',
  'gas connection',
];

const amenityIcons = {
  wifi: <FaWifi />,
  parking: <FaParking />,
  'air conditioning': <FaSnowflake />,
  refrigerator: <FaCouch />,
  'washing machine': <MdOutlineLocalLaundryService />,
  cctv: <MdOutlineSecurity />,
  security: <FaLock />,
  geyser: <FaShower />,
  lift: <MdOutlineElevator />,
  'power backup': <MdOutlinePower />,
  furniture: <FaChair />,
  tv: <FaTv />,
  'gas connection': <FaGasPump />,
};

function PropertyDetail() {
  const stripQuotes = (v) =>
    v == null ? '' : String(v).replace(/^"+|"+$/g, '').trim();

  const parseImages = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map(stripQuotes).filter(Boolean);
    if (typeof raw === 'string' && raw.startsWith('{')) {
      return raw
        .slice(1, -1)
        .split(',')
        .map(stripQuotes)
        .filter(Boolean);
    }
    return [stripQuotes(raw)];
  };

  const enrich = (row) => {
    const images = parseImages(row.image);
    return {
      ...row,
      images,
      video: stripQuotes(row.video),
      cover: images[0],
    };
  };

  const { id } = useParams();
  const location = useLocation();
  const init = location.state?.property ? enrich(location.state.property) : null;

  const [property, setProperty] = useState(init);
  const [loading, setLoading] = useState(!init);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    if (!property) {
      getPropertyById(id)
        .then(({ data }) => setProperty(enrich(data)))
        .finally(() => setLoading(false));
    }
  }, [id, property]);

  const stepLightbox = useCallback(
    (dir) => {
      if (!property) return;
      const total = property.images.length + (property.video ? 1 : 0);
      setLightboxIdx((idx) => (idx + dir + total) % total);
    },
    [property]
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (lightboxIdx !== null && e.key === 'ArrowLeft') stepLightbox(-1);
      if (lightboxIdx !== null && e.key === 'ArrowRight') stepLightbox(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIdx, stepLightbox]);

  const generateTitle = (title) => {
    if (!title) return 'Property Listing';
    const firstWord = title.trim().split(' ')[0];
    const possessive = firstWord.endsWith('s') ? `${firstWord}'` : `${firstWord}'s`;
    return `${possessive} listed home`;
  };

  if (loading || !property)
    return <p className="text-center mt-20 text-indigo-600">Loading...</p>;

  return (
    <>
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setLightboxIdx(null)}>
          <button onClick={(e) => { e.stopPropagation(); stepLightbox(-1); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl">
            <FaChevronLeft />
          </button>
          <div className="relative">
            {lightboxIdx === property.images.length ? (
              <video src={property.video} controls autoPlay className="max-h-[90vh] max-w-[90vw] rounded-lg" />
            ) : (
              <img src={property.images[lightboxIdx]} alt="" className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain" />
            )}
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
              {lightboxIdx + 1} / {property.images.length + (property.video ? 1 : 0)}
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); stepLightbox(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl">
            <FaChevronRight />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }} className="absolute top-6 right-6 text-white text-4xl">
            <FaTimes />
          </button>
        </div>
      )}

      <main className="w-full min-h-screen bg-[#f2f2f2] py-5 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col bg-white p-5 rounded-2xl gap-4 max-w-6xl mx-auto">
          <div className="text-xl font-semibold text-gray-800">{generateTitle(property.title)}</div>

          {/* Cover image and side images */}
          <div className="flex flex-col lg:flex-row justify-center items-start gap-5 w-full">
            <div className="w-full lg:w-[32rem] h-80 sm:h-[26rem] rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightboxIdx(0)}>
              <img src={property.cover} alt="main" className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col gap-5 w-full lg:w-[16rem]">
              <div className="h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightboxIdx(1)}>
                {property.images[1] ? (
                  <img src={property.images[1]} alt="thumb" className="w-full h-full object-cover" />
                ) : (
                  <p className="flex items-center justify-center h-full bg-gray-200 text-sm">No Image</p>
                )}
              </div>
              <div className="h-40 sm:h-48 relative rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setLightboxIdx(property.video ? property.images.length : property.images.length - 1)}>
                {property.images[2] ? (
                  <img src={property.images[2]} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-center px-2 font-semibold text-sm sm:text-base">
                  {property.video ? `📹 Video + ${property.images.length} Images` : `${property.images.length} Images`}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-5 w-full lg:w-[24rem]">
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
                  <p className="text-gray-500 text-sm mb-1">One-time Service Fee</p>
                  <p className="text-xl font-bold text-indigo-700">₹1299</p>
                </div>
                <button
                  className={`mt-4 w-1/2 py-2 font-semibold rounded-xl transition-all ${hasPaid
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  disabled={hasPaid}
                  onClick={() => {
                    alert('Redirecting to payment gateway – ₹1299');
                    setHasPaid(true);
                  }}
                >
                  {hasPaid ? 'Owner Details Unlocked' : 'Pay ₹1299 & Unlock'}
                </button>
              </div>

              <div className="w-full">
                <div className="w-full bg-white border border-gray-300 rounded-2xl flex items-center justify-between p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                      <span className="text-blue-600 text-xl">📍</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">In {property.location || 'Unknown Location'}</span>
                      <span className="text-sm text-gray-700">
                        <span className="text-green-500 font-medium">{property.distance_from_station || 'N/A'}</span>
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

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-indigo-700 mb-3">Property Description</h2>
            <p className="text-gray-700 leading-relaxed">{property.description || 'No description available.'}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <InfoItem label="Rent" value={`₹${property.price || 'N/A'}`} />
              <InfoItem label="Flat Status" value={property.flat_status || 'N/A'} />
              <InfoItem label="BHK Type" value={property.bhk_type || 'N/A'} />
              <InfoItem label="Looking For" value={property.looking_for || 'N/A'} />
              <InfoItem label="Occupancy" value={property.occupancy || 'N/A'} />
              <InfoItem label="Gender" value={property.gender || 'N/A'} />
            </div>
          </div>

         
<div>
  <h2 className="text-xl font-bold text-indigo-700 mt-8 mb-3">Amenities</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {knownAmenities.map((amenity, idx) => {
      const isAvailable =
        property.amenities?.some(
          (item) => item?.toLowerCase() === amenity.toLowerCase()
        );

      return (
        <div
          key={idx}
          className={`flex items-center gap-4 px-5 py-4 rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.03] ${
            isAvailable
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-100 opacity-70'
          }`}
        >
          <div
            className={`text-2xl transition-colors duration-300 ${
              isAvailable
                ? 'text-green-600 animate-pulse'
                : 'text-red-400'
            }`}
          >
            {amenityIcons[amenity] || '🔲'}
          </div>
          <span
            className={`transition-colors duration-300 ${
              isAvailable
                ? 'text-gray-900 font-semibold'
                : 'text-red-500 italic font-medium'
            } capitalize`}
          >
            {isAvailable ? amenity : `${amenity} (Unavailable)`}
          </span>
        </div>
      );
    })}
  </div>
</div>

        </div>
      </main>
    </>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="bg-gray-50 px-4 py-3 rounded-xl shadow-sm">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  );
}

export default PropertyDetail;
