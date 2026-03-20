import React, { useState, useContext } from "react";
import {
  FaWifi, FaParking, FaSnowflake, FaTv, FaChair, FaLock, FaPuzzlePiece, FaShower
} from "react-icons/fa";
import { FaFire } from "react-icons/fa6";
import { GiCctvCamera, GiIceCube } from "react-icons/gi";
import { MdOutlineLocalLaundryService, MdOutlineElevator, MdOutlinePower } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import BookingCalendar from "./BookingCalendar";
import { createBooking } from "../../api/userApi";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContextV1"; 

const knownAmenities = [
  "wifi","parking","air conditioning","refrigerator","washing machine",
  "cctv","security","geyser","lift","power backup","furniture","tv","gas connection"
];

const amenityIcons = {
  wifi: <FaWifi />, parking: <FaParking />, "air conditioning": <FaSnowflake />,
  refrigerator: <GiIceCube />, "washing machine": <MdOutlineLocalLaundryService />,
  cctv: <GiCctvCamera />, security: <FaLock />, geyser: <FaShower />,
  lift: <MdOutlineElevator />, "power backup": <MdOutlinePower />,
  furniture: <FaChair />, tv: <FaTv />, "gas connection": <FaFire />
};

// Reusable Amenity Item
function AmenityItem({ item }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`text-xl ${item.isAvailable ? "text-green-500" : "text-gray-400"}`}>
        {item.icon}
      </div>
      <span className="text-sm text-gray-700">{item.name}</span>
    </div>
  );
}

// Modal to show all amenities
function AmenitiesModal({ amenities, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-11/12 max-h-[80vh] overflow-y-auto shadow-md">
        <h3 className="text-lg mb-4">All Amenities</h3>
        <div className="grid grid-cols-2 gap-3">
          {amenities.map((item, idx) => <AmenityItem key={idx} item={item} />)}
        </div>
        <button
          className="mt-4 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg w-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Build full amenities list with icons
function buildAmenities(propertyAmenities, amenities) {
  return [
    ...knownAmenities.map((amenity) => ({
      name: amenity,
      isAvailable: amenities.some(item => item?.toLowerCase() === amenity.toLowerCase()),
      icon: amenityIcons[amenity.toLowerCase()] || <FaPuzzlePiece />
    })),
    ...(propertyAmenities || []).filter(item => item && !knownAmenities.includes(item.toLowerCase()))
      .map(extra => ({ name: extra, isAvailable: true, icon: <FaPuzzlePiece /> }))
  ];
}

function PropertyAmenities({ amenities = [], property }) {
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [confirmBooking, setConfirmBooking] = useState(null);

  const { user } = useContext(AuthContext); // Get user from global AuthContext
  const navigate = useNavigate();

  const handleBooking = (dateTime) => {
    if (!user?.id) {
      setShowLoginPopup(true);
      return;
    }
    setConfirmBooking(dateTime);
  };

  const confirmBookingSubmit = async () => {
    try {
      setLoading(true);
      const booking_date = confirmBooking.toISOString().split("T")[0];
      const booking_time = confirmBooking.toTimeString().slice(0, 5);

      const res = await createBooking(property.id, booking_date, booking_time);
      console.log("Booking created:", res);
      toast.success("Visit scheduled successfully");
      setConfirmBooking(null);
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("❌ Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    const currentPath = window.location.pathname + window.location.search;
    navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  const allAmenities = buildAmenities(property?.amenities, amenities);
  const mobileLimited = allAmenities.slice(0, 6);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">

      {/* Amenities */}
      <div className="bg-white rounded-xl border p-4 shadow-md flex-1">
        <h2 className="text-xl font-semibold mb-4">Amenities</h2>

        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {allAmenities.map((item, idx) => <AmenityItem key={idx} item={item} />)}
        </div>

        <div className="grid grid-cols-2 gap-3 md:hidden">
          {mobileLimited.map((item, idx) => <AmenityItem key={idx} item={item} />)}
          {allAmenities.length > 6 && (
            <button className="col-span-2 text-blue-600 text-sm mt-2"
              onClick={() => setShowAllMobile(true)}
            >
              + More
            </button>
          )}
        </div>

        {showAllMobile && (
          <AmenitiesModal
            amenities={allAmenities}
            onClose={() => setShowAllMobile(false)}
          />
        )}
      </div>

      {/* Booking Calendar */}
      <div className="flex-1">
        <BookingCalendar
          onConfirm={handleBooking}
          loading={loading}
        />
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
            <h2 className="text-lg text-gray-800 mb-4 text-center" style={{ fontFamily: "para_font" }}>Login Required</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">Please login to continue with booking.</p>
            <div className="flex gap-4">
              <button onClick={handleLoginRedirect} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium">Login</button>
              <button onClick={() => setShowLoginPopup(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Booking Modal */}
      {confirmBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold text-center mb-3">Confirm Visit</h2>
            <p className="text-sm text-gray-600 text-center mb-4">Please confirm your visit time</p>

            <div className="bg-gray-100 rounded-lg p-3 text-center mb-4">
              <p className="text-sm font-medium">{confirmBooking.toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">
                {confirmBooking.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setConfirmBooking(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg">Cancel</button>
              <button onClick={confirmBookingSubmit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">Confirm</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PropertyAmenities;