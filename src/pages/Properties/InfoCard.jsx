import { useEffect, useMemo, useState } from "react";
import { FaPhoneAlt, FaUserCircle, FaCalendarAlt } from "react-icons/fa";
import { SiGooglepay, SiPaytm } from "react-icons/si";
import { RiInformation2Line } from "react-icons/ri";
import { MdOutlineCardMembership } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PaymentButton from "./PaymentButton";
import {
  getUnlockedLeads,
  unlockContact,
  fetchUserContactStatus,
  fetchBookingLimitInfo,
  createBooking,
  getMyBookings,
} from "../../api/userApi";
import toast from "react-hot-toast";

export default function ContactCard({ property, hasPaid, setHasPaid, setShowPlanPopup, userMobile }) {
  const [unlockedPropertyIds, setUnlockedPropertyIds] = useState([]);
  const [contactStatus, setContactStatus] = useState({ remaining: 0 });
  const [bookingStatus, setBookingStatus] = useState({ remaining: 0 });
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [existingBookingDateTime, setExistingBookingDateTime] = useState(null);
  const [selectedBookingDateTime, setSelectedBookingDateTime] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  const isUnlocked = useMemo(() => {
    return (
      userRole === "admin" ||
      userRole === "owner" ||
      unlockedPropertyIds.some((id) => String(id) === String(property?.id))
    );
  }, [userRole, unlockedPropertyIds, property?.id]);

  const contactLimitReached = contactStatus.remaining <= 0;

  // Fetch all relevant info on mount
  useEffect(() => {
    if (!property || !hasPaid) return;

    const fetchAll = async () => {
      try {
        const [leads, contact, bookingsData, bookingInfo] = await Promise.all([
          getUnlockedLeads(),
          fetchUserContactStatus(),
          getMyBookings(),
          fetchBookingLimitInfo(),
        ]);

        setUnlockedPropertyIds(leads);
        setContactStatus(contact);
        setBookingStatus(bookingInfo);

        const booking = (bookingsData || []).find(b => String(b.property_id) === String(property.id));
        if (booking && booking.booking_date && booking.booking_time) {
          const datePart = booking.booking_date.split("T")[0];
          const dt = new Date(`${datePart}T${booking.booking_time}`);
          if (!isNaN(dt)) setExistingBookingDateTime(dt);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchAll();
  }, [hasPaid, property?.id]);

  const displayPhone = () => {
    if (userRole === "admin" || userRole === "owner") {
      return <span className="flex items-center gap-2"><FaPhoneAlt className="text-indigo-600" />{property.owner_phone || "Unavailable"}</span>;
    }
    if (isUnlocked) {
      if (!property.phone_visible) return <span className="flex items-center gap-2 text-red-500"><FaPhoneAlt className="text-indigo-600" />Hidden by owner</span>;
      return <span className="flex items-center gap-2"><FaPhoneAlt className="text-indigo-600" />{property.owner_phone || "Unavailable"}</span>;
    }
    return <span className="flex items-center gap-2"><FaPhoneAlt className="text-indigo-600" />+91xxxxxxx</span>;
  };

  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      const res = await unlockContact(property.id);
      if (res.msg === "Contact unlocked successfully") {
        const status = await fetchUserContactStatus();
        setContactStatus(status);
        setUnlockedPropertyIds(prev => [...prev, property.id]);
        toast.success("Contact unlocked!");
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (err) {
      const msg = err?.response?.data?.msg;
      if (msg === "Contact already unlocked") {
        const [status, leads] = await Promise.all([fetchUserContactStatus(), getUnlockedLeads()]);
        setContactStatus(status);
        setUnlockedPropertyIds(leads);
        toast.success("Contact already unlocked.");
      } else {
        toast.error("Unlock limit reached. Please upgrade.");
        setShowPlanPopup(true);
      }
    } finally {
      setIsUnlocking(false);
      setShowConfirmPopup(false);
    }
  };

  const handleBookingSave = async () => {
    if (!selectedBookingDateTime) return toast.error("Please select date & time");

    try {
      const dateStr = selectedBookingDateTime.toISOString().split("T")[0];
      const timeStr = selectedBookingDateTime.toTimeString().split(" ")[0];

      await createBooking(property.id, dateStr, timeStr);
      toast.success("Booking saved successfully!");
      setExistingBookingDateTime(selectedBookingDateTime);
      setSelectedBookingDateTime(null);

      // REFRESH booking info after booking
      const updatedBookingInfo = await fetchBookingLimitInfo();
      setBookingStatus(updatedBookingInfo);

    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to save booking.");
    }
  };

  const remainingBookings = bookingStatus?.remaining ?? 0;

  return (
    <div className="flex justify-between flex-col w-full lg:w-[23rem]" style={{ fontFamily: "para_font" }}>
      {/* Contact Card */}
      <div className="bg-white border rounded-xl p-5 shadow-sm w-full">
        <h2 className="text-lg text-gray-900 flex items-center gap-2 mb-3" style={{ fontFamily: "heading_font" }}>
          <FaUserCircle className="text-indigo-600 text-2xl" /> Owner's Contact
        </h2>
        {isUnlocked ? displayPhone() : user && hasPaid ? (
          <div className="flex justify-between items-center gap-3">
            <span className="font-medium flex items-center gap-2"><FaPhoneAlt className="text-indigo-600" />+91xxxxxxx</span>
            {contactLimitReached ? (
              <div className="px-4 py-2 text-center bg-yellow-500 text-white text-sm rounded-lg">Upgrade Plan</div>
            ) : (
              <button
                onClick={() => setShowConfirmPopup(true)}
                disabled={isUnlocking}
                className={`px-4 py-2 text-white text-sm rounded-lg ${isUnlocking ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              >{isUnlocking ? "Unlocking..." : "Unlock Contact"}</button>
            )}
          </div>
        ) : displayPhone()}
      </div>

      {/* Booking Card */}
      <div className="bg-white border rounded-xl p-5 shadow-sm w-full mt-4">
        <h2 className="text-lg flex items-center gap-2 mb-3" style={{ fontFamily: "heading_font" }}>
          {!existingBookingDateTime && <FaCalendarAlt className="text-indigo-600" />} Booking Schedule
        </h2>

        <p className="text-sm text-gray-500 mb-2">Bookings remaining: {remainingBookings}</p>

        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-2 w-full">
            {hasPaid ? (
              existingBookingDateTime ? (
                <span className="text-green-600 font-medium flex items-center gap-1">
                  ✅ {existingBookingDateTime.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}
                </span>
              ) : (
                <DatePicker
                  selected={selectedBookingDateTime}
                  onChange={setSelectedBookingDateTime}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="dd MMM yyyy, h:mm aa"
                  minDate={new Date()}
                  className="border rounded-md px-2 py-1 text-sm w-full"
                  placeholderText="Select date & time"
                />
              )
            ) : <span className="text-gray-500 text-sm">Subscribe to enable booking</span>}
          </div>

          {hasPaid && !existingBookingDateTime && (
            <button
              className={`bg-indigo-600 px-2 hover:bg-indigo-700 text-white text-sm py-1 rounded-md ${!selectedBookingDateTime || remainingBookings <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleBookingSave}
              disabled={!selectedBookingDateTime || remainingBookings <= 0}
            >Schedule</button>
          )}
        </div>
      </div>

      {/* Active Plan Card */}
      {hasPaid && user?.activePlan && (
        <div className="bg-white border rounded-xl p-5 shadow-sm w-full mt-4">
          <h2 className="text-lg flex items-center gap-2 mb-3" style={{ fontFamily: "heading_font" }}>
            <MdOutlineCardMembership className="text-indigo-600" /> Active Plan
          </h2>
          <p className="text-gray-800 font-medium">Plan Name: <span className="text-indigo-600">{user.activePlan.name}</span></p>
          <p className="text-green-600 font-semibold mt-1">Status: Active</p>
        </div>
      )}

      {/* Payment Card */}
      <div className="bg-white border rounded-xl p-3 shadow-sm w-full mt-4">
        <div className="text-gray-600 text-xs mb-3 flex items-center gap-2">
          One-time Service Fee
          <div className="flex justify-center items-center ml-2">
            <RiInformation2Line className="text-blue-600 text-base hover:text-blue-800" />
            <button onClick={() => setShowPlanPopup(true)} className="text-blue-600 text-sm hover:text-blue-800">What’s included?</button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <SiGooglepay className="text-3xl text-indigo-600" />
          <SiPaytm className="text-3xl text-blue-600" />
          <PaymentButton hasPaid={hasPaid} userMobile={userMobile} setHasPaid={setHasPaid} />
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
            <h2 className="text-lg mb-3 text-gray-800">Confirm Unlock</h2>
            <p className="text-sm text-gray-700 mb-4">
              This will use <strong>1 unlock</strong> from your plan.<br />
              You have <strong>{contactStatus.remaining}</strong> remaining.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowConfirmPopup(false)} className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded-md">Cancel</button>
              <button onClick={handleUnlock} disabled={isUnlocking} className={`text-sm px-4 py-2 rounded-md text-white ${isUnlocking ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}`}>{isUnlocking ? "Unlocking..." : "Confirm"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
