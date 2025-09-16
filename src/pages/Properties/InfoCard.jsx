import { useEffect, useMemo, useState } from "react";
import { FaPhoneAlt, FaUserCircle, FaCalendarAlt, FaComments, FaWhatsapp } from "react-icons/fa";
import { SiGooglepay, SiPaytm } from "react-icons/si";
import { RiInformation2Line } from "react-icons/ri";
import { MdOutlineCardMembership, MdHelpOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";

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
import ChatBox from "../Properties/ChatBox";

export default function ContactCard({
  property,
  hasPaid,
  setHasPaid,
  setShowPlanPopup,
  userMobile,
}) {
  const [unlockedPropertyIds, setUnlockedPropertyIds] = useState([]);
  const [contactStatus, setContactStatus] = useState({ remaining: 0 });
  const [bookingStatus, setBookingStatus] = useState({ remaining: 0 });
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [existingBookingDateTime, setExistingBookingDateTime] = useState(null);
  const [selectedBookingDateTime, setSelectedBookingDateTime] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // track action (call/chat)

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;
  const isOwner =
    user?.owner_code &&
    property?.owner_code &&
    user.owner_code === property.owner_code;

 const isUnlocked = useMemo(() => {
  const role = (userRole || "").toLowerCase();
  return (
    isOwner ||
    role === "admin" ||
    role === "owner" ||
    role === "rm" ||
    unlockedPropertyIds.some((id) => String(id) === String(property?.id))
  );
}, [userRole, unlockedPropertyIds, property?.id]);

  const contactLimitReached = contactStatus.remaining <= 0;

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

        const booking = (bookingsData || []).find(
          (b) => String(b.property_id) === String(property.id)
        );
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

  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      const res = await unlockContact(property.id);
      if (res.msg === "Contact unlocked successfully") {
        const status = await fetchUserContactStatus();
        setContactStatus(status);
        setUnlockedPropertyIds((prev) => [...prev, property.id]);
        toast.success("Contact unlocked!");

        // Continue with the intended action
        if (pendingAction === "call") setShowCallPopup(true);
        if (pendingAction === "chat") setShowChat(true);
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (err) {
      const msg = err?.response?.data?.msg;
      if (msg === "Contact already unlocked") {
        const [status, leads] = await Promise.all([
          fetchUserContactStatus(),
          getUnlockedLeads(),
        ]);
        setContactStatus(status);
        setUnlockedPropertyIds(leads);
        toast.success("Contact already unlocked.");

        if (pendingAction === "call") setShowCallPopup(true);
        if (pendingAction === "chat") setShowChat(true);
      } else {
        toast.error("Unlock limit reached. Please upgrade.");
        setShowPlanPopup(true);
      }
    } finally {
      setIsUnlocking(false);
      setShowConfirmPopup(false);
      setPendingAction(null);
    }
  };

  const handleBookingSave = async () => {
    if (!selectedBookingDateTime)
      return toast.error("Please select date & time");

    try {
      const dateStr = selectedBookingDateTime.toISOString().split("T")[0];
      const timeStr = selectedBookingDateTime.toTimeString().split(" ")[0];

      await createBooking(property.id, dateStr, timeStr);
      toast.success("Booking saved successfully!");
      setExistingBookingDateTime(selectedBookingDateTime);
      setSelectedBookingDateTime(null);

      const updatedBookingInfo = await fetchBookingLimitInfo();
      setBookingStatus(updatedBookingInfo);
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to save booking.");
    }
  };

  const remainingBookings = bookingStatus?.remaining ?? 0;

  return (
    <div
      className="flex justify-between flex-col w-full lg:w-[23rem]"
      style={{ fontFamily: "para_font" }}
    >
      {/* Contact Card */}
      <div className="bg-white border rounded-xl p-5 shadow-sm w-full">
        <h2
          className="text-lg text-gray-900 flex items-center gap-2 mb-4"
          style={{ fontFamily: "heading_font" }}
        >
          <FaUserCircle className="text-indigo-600 text-2xl" />
          {(!user || !hasPaid) && "Subscribe to Call / Chat"}
          {user && hasPaid && !isUnlocked && "Unlock to Call / Chat"}
          {isUnlocked && "Owner's Contact"}
        </h2>

      <div className="flex gap-5 ml-0 items-start w-full ">
  {/* CALL BUTTON */}
 <button
  onClick={() => {
    if (isOwner || ["admin", "owner", "rm"].includes((userRole || "").toLowerCase())) {
      // Owner sees their own contact directly
      setShowCallPopup(true);
    } else if (!user || !hasPaid) {
      setShowPlanPopup(true);
    } else if (!isUnlocked) {
      setPendingAction("call");
      setShowConfirmPopup(true);
    } else {
      setShowCallPopup(true);
    }
  }}
  disabled={isUnlocking}
  className="flex-1 flex items-center justify-center gap-2 
             py-2 sm:py-3 px-2 sm:px-4 
             text-xs sm:text-sm md:text-base font-medium 
             rounded-lg shadow 
             bg-green-600 hover:bg-green-700 
             disabled:opacity-50 text-white 
             transition-all duration-300"
>
  <FaPhoneAlt className="text-base sm:text-lg md:text-xl" />
  Call
</button>


  {/* CHAT BUTTON */}
  <button
  onClick={() => {
    if (isOwner) {
      // Owner should go to dashboard chat tab
      window.location.href = "/dashboard?tab=Chat";
    } else if (!user || !hasPaid) {
      setShowPlanPopup(true);
    } else if (!isUnlocked) {
      setPendingAction("chat");
      setShowConfirmPopup(true);
    } else {
      setShowChat(!showChat);
    }
  }}
  className="flex-1 flex items-center justify-center gap-2 
             py-2 sm:py-3 px-2 sm:px-4 
             text-xs sm:text-sm md:text-base font-medium 
             rounded-lg shadow 
             bg-indigo-600 hover:bg-indigo-700 
             text-white transition-all duration-300"
>
  {showChat ? (
    <>
      <IoClose className="text-base sm:text-lg md:text-xl" />
      Close
    </>
  ) : (
    <>
      <FaComments className="text-base sm:text-lg md:text-xl" />
      Chat
    </>
  )}
</button>

  {/* HELP BUTTON */}
  <button
    onClick={() => setShowHelpPopup(true)}
    className="flex-1 flex items-center justify-center gap-2 
               py-2 sm:py-3 px-2 sm:px-4 
               text-xs sm:text-sm md:text-base font-medium 
               rounded-lg shadow 
               bg-yellow-500 hover:bg-yellow-600 
               text-white transition-all duration-300"
  >
    <MdHelpOutline className="text-base sm:text-lg md:text-xl" />
    Help
  </button>
</div>


        {/* CALL POPUP */}
        {showCallPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 shadow-xl w-[20rem] text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Call Owner
              </h3>
              <p className="text-xl font-bold text-indigo-600 mb-6">
                +91 {property?.owner_phone || "Unavailable"}
              </p>
              <button
                onClick={() => setShowCallPopup(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* HELP POPUP */}
        {showHelpPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white rounded-xl p-6 shadow-xl w-[20rem] text-center">
              {/* Close Button */}
              <button
                onClick={() => setShowHelpPopup(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Help & Support
              </h3>
              <p className="text-md font-medium text-gray-700 mb-6">
                +91 90044 63371
              </p>

              <div className="flex justify-center gap-6">
                <a
                  href="tel:+919004463371"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white text-2xl"
                >
                  <FaPhoneAlt />
                </a>

                <a
                  href={`https://wa.me/919004463371?text=${encodeURIComponent(
                    "I want help regarding"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white text-2xl"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* CHAT BOX */}
        {showChat && isUnlocked && (
          <div className="mt-2 w-full">
            <ChatBox
              userId={user.id}
              recipientName={property.title}
              recipientOwnerCode={property.owner_code}
              propertyId={property.id}
              disabled={!isUnlocked}
              onLockedAction={() => setShowPlanPopup(true)}
            />
          </div>
        )}
      </div>

      {/* Booking Card */}
      <div className="bg-white border rounded-xl p-5 shadow-sm w-full mt-4">
        <h2
          className="text-lg flex items-center gap-2 mb-3"
          style={{ fontFamily: "heading_font" }}
        >
          {!existingBookingDateTime && (
            <FaCalendarAlt className="text-indigo-600" />
          )}{" "}
          Booking Schedule
        </h2>

        {isOwner ? (
          <p className="text-sm text-gray-500 italic text-center">
            This is your property. Booking is disabled.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-2">
              Bookings remaining: {remainingBookings}
            </p>

            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-2 w-full">
                {hasPaid ? (
                  existingBookingDateTime ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      ✅{" "}
                      {existingBookingDateTime.toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
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
                ) : (
                  <span className="text-gray-500 text-sm">
                    Subscribe to enable booking
                  </span>
                )}
              </div>

              {hasPaid && !existingBookingDateTime && (
                <button
                  className={`bg-indigo-600 px-2 hover:bg-indigo-700 text-white text-sm py-1 rounded-md ${
                    !selectedBookingDateTime || remainingBookings <= 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handleBookingSave}
                  disabled={
                    !selectedBookingDateTime || remainingBookings <= 0
                  }
                >
                  Schedule
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Active Plan Card */}
      {hasPaid && user?.activePlan && (
        <div className="bg-white border rounded-xl p-5 shadow-sm w-full mt-4">
          <h2
            className="text-lg flex items-center gap-2 mb-3"
            style={{ fontFamily: "heading_font" }}
          >
            <MdOutlineCardMembership className="text-indigo-600" /> Active Plan
          </h2>
          <p className="text-gray-800 font-medium">
            Plan Name:{" "}
            <span className="text-indigo-600">{user.activePlan.name}</span>
          </p>
          <p className="text-green-600 font-semibold mt-1">Status: Active</p>
        </div>
      )}

      {/* Payment Card */}
      <div className="bg-white border rounded-xl p-3 shadow-sm w-full mt-4">
        <div className="text-gray-600 text-xs mb-3 flex items-center gap-2">
          One-time Service Fee
          <div className="flex justify-center items-center ml-2">
            <RiInformation2Line className="text-blue-600 text-base hover:text-blue-800" />
            <button
              onClick={() => setShowPlanPopup(true)}
              className="text-blue-600 text-sm hover:text-blue-800"
            >
              What’s included?
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <SiGooglepay className="text-3xl text-indigo-600" />
          <SiPaytm className="text-3xl text-blue-600" />
          <PaymentButton
            hasPaid={hasPaid}
            userMobile={userMobile}
            setHasPaid={setHasPaid}
          />
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
            <h2 className="text-lg mb-3 text-gray-800">Confirm Unlock</h2>
            <p className="text-sm text-gray-700 mb-4">
              This will use <strong>1 unlock</strong> from your plan.
              <br />
              You have <strong>{contactStatus.remaining}</strong> remaining.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUnlock}
                disabled={isUnlocking}
                className={`text-sm px-4 py-2 rounded-md text-white ${
                  isUnlocking
                    ? "bg-indigo-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isUnlocking ? "Unlocking..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
