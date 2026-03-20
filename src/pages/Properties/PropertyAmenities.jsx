import React, { useState } from "react";
import {
  FaWifi, FaParking, FaSnowflake, FaTv, FaChair, FaLock, FaPuzzlePiece, FaShower
} from "react-icons/fa";
import { FaFire } from "react-icons/fa6";
import { GiCctvCamera, GiIceCube } from "react-icons/gi";
import { MdOutlineLocalLaundryService, MdOutlineElevator, MdOutlinePower } from "react-icons/md";
import BookingCalendar from "./BookingCalendar";

const knownAmenities = [
  "wifi", "parking", "air conditioning", "refrigerator", "washing machine",
  "cctv", "security", "geyser", "lift", "power backup", "furniture", "tv", "gas connection"
];

const amenityIcons = {
  wifi: <FaWifi />, parking: <FaParking />, "air conditioning": <FaSnowflake />,
  refrigerator: <GiIceCube />, "washing machine": <MdOutlineLocalLaundryService />,
  cctv: <GiCctvCamera />, security: <FaLock />, geyser: <FaShower />,
  lift: <MdOutlineElevator />, "power backup": <MdOutlinePower />,
  furniture: <FaChair />, tv: <FaTv />, "gas connection": <FaFire />
};

function PropertyAmenities({ amenities = [], property }) {
  const [showAllMobile, setShowAllMobile] = useState(false);

  const allAmenities = [
    ...knownAmenities.map((amenity) => ({
      name: amenity,
      isAvailable: amenities.some(item => item?.toLowerCase() === amenity.toLowerCase()),
      icon: amenityIcons[amenity.toLowerCase()] || <FaPuzzlePiece />
    })),
    ...(property?.amenities || [])
      .filter(item => item && !knownAmenities.includes(item.toLowerCase()))
      .map(extra => ({ name: extra, isAvailable: true, icon: <FaPuzzlePiece /> }))
  ];

  const mobileLimited = allAmenities.slice(0, 6);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">

      {/* Amenities Section */}
      <div className="bg-white rounded-xl border p-4 shadow-md flex-1">
        <h2 className="text-xl font-semibold mb-4">Amenities</h2>

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {allAmenities.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`text-xl ${item.isAvailable ? "text-green-500" : "text-gray-400"}`}>{item.icon}</div>
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {mobileLimited.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`text-lg ${item.isAvailable ? "text-green-500" : "text-gray-400"}`}>{item.icon}</div>
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
          ))}
          {allAmenities.length > 6 && (
            <button
              className="col-span-2 text-blue-600 text-sm mt-2"
              onClick={() => setShowAllMobile(true)}
            >
              + More
            </button>
          )}
        </div>

        {/* Mobile popup */}
        {showAllMobile && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-11/12 max-h-[80vh] overflow-y-auto shadow-md">
              <h3 className="text-lg mb-4">All Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {allAmenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`text-xl ${item.isAvailable ? "text-green-500" : "text-gray-400"}`}>{item.icon}</div>
                    <span className="text-sm text-gray-700">{item.name}</span>
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

      {/* Booking Section */}
      <div className="flex-1 ">
        <BookingCalendar onConfirm={(dt) => console.log("Scheduled visit:", dt)} />
      </div>

    </div>
  );
}

export default PropertyAmenities;