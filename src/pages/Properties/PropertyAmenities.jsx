import React from 'react';
import {
  FaWifi,
  FaParking,
  FaSnowflake,
  FaTv,
  FaChair,
  FaLock,
  FaGasPump,
  FaPuzzlePiece,
  FaShower,
} from 'react-icons/fa';
import { GiIceCube } from 'react-icons/gi';
import { FiEye } from 'react-icons/fi';
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
  cctv: <FiEye />,
  security: <FaLock />,
  geyser: <FaShower />,
  lift: <MdOutlineElevator />,
  'power backup': <MdOutlinePower />,
  furniture: <FaChair />,
  tv: <FaTv />,
  'gas connection': <FaGasPump />,
};

function PropertyAmenities({ amenities, property }) {
  const availableAmenities = amenities || [];

  return (
    <div>
      <h2 className="text-xl font-bold text-indigo-700 mt-8 mb-3">Amenities</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {knownAmenities.map((amenity, idx) => {
          const isAvailable = availableAmenities.some(
            (item) => item?.toLowerCase() === amenity.toLowerCase()
          );
          const IconComponent = amenityIcons[amenity.toLowerCase()] || <FaPuzzlePiece />;

          return (
            <div
              key={`known-${idx}`}
              className={`flex flex-col lg:flex-row justify-center text-center items-center gap-4 px-5 py-4 rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.03] ${
                isAvailable
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-gray-100 border-2 border-gray-200'
              }`}
            >
              <div
                className={`text-2xl ${
                  isAvailable ? 'text-green-600 animate-pulse' : 'text-gray-400'
                }`}
              >
                {IconComponent}
              </div>
              <span className="text-gray-800 font-normal capitalize">{amenity}</span>
            </div>
          );
        })}

        {(property?.amenities || [])
          .filter((item) => item && !knownAmenities.includes(item.toLowerCase()))
          .map((extra, idx) => (
            <div
              key={`extra-${idx}`}
              className="flex items-center flex-col lg:flex-row text-center justify-center gap-4 px-5 py-4 rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.03] bg-green-50 border border-green-200"
            >
              <div className="text-2xl text-green-600 animate-pulse">
                <FaPuzzlePiece />
              </div>
              <span className="text-gray-800 font-normal capitalize">{extra}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PropertyAmenities;
