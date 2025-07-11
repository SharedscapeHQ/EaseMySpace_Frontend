import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getPropertyById } from '../../API/propertiesApi';
import {
  FaWifi,
  FaBed,
  FaShower,
  FaTv,
  FaHome,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from 'react-icons/fa';

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
      {/* Lightbox */}
      {lightboxIdx !== null && (
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
              {lightboxIdx + 1} / {property.images.length + (property.video ? 1 : 0)}
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
      )}

      <main className="w-full min-h-screen bg-[#f2f2f2] py-5 px-4">
        <div className="flex flex-col bg-white p-5 rounded-2xl gap-4 max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-xl font-semibold text-gray-800">{generateTitle(property.title)}</div>

          <div className="flex flex-col lg:flex-row justify-center items-start gap-5">
            {/* Main Image */}
            <div
              className="w-full lg:w-[32rem] h-80 sm:h-[26rem] rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setLightboxIdx(0)}
            >
              <img
                src={property.cover}
                alt="main"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Side Images */}
            <div className="flex flex-col gap-5 w-full lg:w-[16rem]">
              <div
                className="h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer"
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
              <div
                className="h-40 sm:h-48 relative rounded-2xl overflow-hidden cursor-pointer"
                onClick={() =>
                  setLightboxIdx(
                    property.video ? property.images.length : property.images.length - 1
                  )
                }
              >
                {property.images[2] ? (
                  <img
                    src={property.images[2]}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
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

            {/* Right Column */}
            <div className="flex flex-col justify-between gap-5 h-full min-h-[24rem]">
              {/* Contact Card */}
              <div className="w-[24rem] h-[15rem] bg-white border border-zinc-200 rounded-2xl overflow-hidden p-6 shadow-lg flex flex-col justify-between">
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
                  className={`mt-4 w-full py-2 font-semibold rounded-xl transition-all ${
                    hasPaid
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

              {/* Location Card */}
              <div className="w-96 flex-grow flex flex-col justify-end">
                <div className="w-full bg-white border border-gray-300 rounded-2xl flex items-center justify-between p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                      <span className="text-blue-600 text-xl">📍</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        In {property.location || 'Unknown Location'}
                      </span>
                      <span className="text-sm text-gray-700">
                        <span className="text-green-500 font-medium  ">
                          {property.distance_from_station || 'N/A'}
                        </span>{' '}
                       
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
            <p className="text-gray-700 leading-relaxed">
              {property.description || 'No description available.'}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

function Amenity({ icon, label }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl shadow-sm text-gray-700">
      <span className="text-indigo-600 text-lg">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
}

export default PropertyDetail;
