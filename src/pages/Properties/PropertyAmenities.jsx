import React, { useState } from 'react';
import {
  FaWifi,
  FaParking,
  FaSnowflake,
  FaTv,
  FaChair,
  FaLock,
  FaPuzzlePiece,
  FaShower,
} from 'react-icons/fa';
import { FaFire } from "react-icons/fa6";
import { GiCctvCamera } from "react-icons/gi";
import { GiIceCube } from 'react-icons/gi';
import {
  MdOutlineLocalLaundryService,
  MdOutlineElevator,
  MdOutlinePower,
} from 'react-icons/md';

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
  refrigerator: <GiIceCube />,
  'washing machine': <MdOutlineLocalLaundryService />,
  cctv: <GiCctvCamera />,
  security: <FaLock />,
  geyser: <FaShower />,
  lift: <MdOutlineElevator />,
  'power backup': <MdOutlinePower />,
  furniture: <FaChair />,
  tv: <FaTv />,
  'gas connection': <FaFire />,
};

function PropertyAmenities({ amenities, property }) {
  const [showAllMobile, setShowAllMobile] = useState(false);

  const availableAmenities = amenities || [];

  const allAmenities = [
    ...knownAmenities.map((amenity) => ({
      name: amenity,
      isAvailable: availableAmenities.some(
        (item) => item?.toLowerCase() === amenity.toLowerCase()
      ),
      icon: amenityIcons[amenity.toLowerCase()] || <FaPuzzlePiece />,
    })),
    ...(property?.amenities || [])
      .filter((item) => item && !knownAmenities.includes(item.toLowerCase()))
      .map((extra) => ({
        name: extra,
        isAvailable: true,
        icon: <FaPuzzlePiece />,
      })),
  ];

  // Limit for mobile
  const mobileLimited = allAmenities.slice(0, 6);

  return (
    <div style={{ fontFamily: "universal_font" }} className="bg-white rounded-xl border p-6">
      <h2
        style={{ fontFamily: "para_font" }}
        className="text-[16px] lg:text-xl text-left text-black mb-3"
      >
        Amenities
      </h2>

      {/* Desktop: Show all */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
        {allAmenities.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className={`text-xl ${item.isAvailable ? 'text-green-500' : 'text-gray-400'}`}>
              {item.icon}
            </div>
            <span className="text-md text-gray-700">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Mobile: Show limited */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:hidden">
        {mobileLimited.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className={`text-xl ${item.isAvailable ? 'text-green-500' : 'text-gray-400'}`}>
              {item.icon}
            </div>
            <span className="text-md text-gray-700">{item.name}</span>
          </div>
        ))}
      </div>

      {/* More button on mobile */}
      {allAmenities.length > 6 && (
        <button
          className="mt-3 text-blue-600 text-sm md:hidden"
          onClick={() => setShowAllMobile(true)}
        >
          + More
        </button>
      )}

      {/* Popup for mobile */}
      {showAllMobile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-11/12 max-h-[80vh] overflow-y-auto shadow-lg">
            <h3
              style={{ fontFamily: "universal_font" }}
              className="text-lg  mb-4"
            >
              All Amenities
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {allAmenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`text-xl ${item.isAvailable ? 'text-green-500' : 'text-gray-400'}`}>
                    {item.icon}
                  </div>
                  <span className="text-md text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
            <button
              className="mt-4 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg w-full"
              onClick={() => setShowAllMobile(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyAmenities;
