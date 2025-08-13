import { useEffect, useMemo, useState } from 'react';
import PaymentButton from './PaymentButton';
import {
  getUnlockedLeads,
  unlockContact,
  fetchUserContactStatus,
} from '../../api/userApi';
import toast from 'react-hot-toast';
import { FaPhoneAlt } from "react-icons/fa"

function PropertyHeaderSection({
  property,
  setLightboxIdx,
  hasPaid,
  userMobile,
  setHasPaid,
  setShowPlanPopup,
}) {
  const [unlockedPropertyIds, setUnlockedPropertyIds] = useState([]);
  const [contactStatus, setContactStatus] = useState({ remaining: 0 });
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role;

  const isUnlocked = useMemo(() => {
    return (
      userRole === 'admin' ||
      userRole === 'owner' ||
      unlockedPropertyIds.some((id) => String(id) === String(property?.id))
    );
  }, [userRole, unlockedPropertyIds, property?.id]);

  const contactLimitReached = contactStatus.remaining <= 0;

  useEffect(() => {
    if (!property || !hasPaid) return;

    getUnlockedLeads()
      .then((res) => {
        setUnlockedPropertyIds(res);
      })
      .catch((err) =>
        console.error('❌ Failed to fetch unlocked leads:', err)
      );

    fetchUserContactStatus()
      .then(setContactStatus)
      .catch((err) =>
        console.error('❌ Failed to fetch contact status:', err)
      );
  }, [hasPaid, property?.id]);

const displayPhone = () => {
  if (userRole === 'admin' || userRole === 'owner') {
    return (
      <span className="flex items-center gap-2">
        <FaPhoneAlt className="text-indigo-600" />
        {property.owner_phone || 'Unavailable'}
      </span>
    );
  }

  if (isUnlocked) {
    if (!property.phone_visible) {
      return (
        <span className="flex items-center gap-2 text-red-500">
          <FaPhoneAlt className="text-indigo-600" />
          Hidden by owner
        </span>
      );
    }
    return (
      <span className="flex items-center gap-2">
        <FaPhoneAlt className="text-indigo-600" />
        {property.owner_phone || 'Unavailable'}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <FaPhoneAlt className="text-indigo-600" />
      +91xxxxxxx
    </span>
  );
};


 const handleUnlock = async () => {
  setIsUnlocking(true);
  try {
    const res = await unlockContact(property.id);

    if (res.msg === "Contact unlocked successfully") {
      const [status] = await Promise.all([fetchUserContactStatus()]);
      setContactStatus(status);
      setUnlockedPropertyIds((prev) => [...prev, property.id]);
      toast.success('Contact unlocked!');
    } else {
      // fallback if msg is something else (optional)
      toast.error('Unexpected response from server');
    }

  } catch (err) {
    const msg = err?.response?.data?.msg;
    console.error('❌ Unlock error:', err);

    if (msg === 'Contact already unlocked') {
      const [status, leads] = await Promise.all([
        fetchUserContactStatus(),
        getUnlockedLeads(),
      ]);
      setContactStatus(status);
      setUnlockedPropertyIds(leads);
      toast.success('Contact already unlocked.');
    } else {
      toast.error('Unlock limit reached. Please upgrade.');
      setShowPlanPopup(true); // ← only shown on actual error
    }
  } finally {
    setIsUnlocking(false);
    setShowConfirmPopup(false);
  }
};


  if (!property) return null;



  return (
    <>
    
      {showConfirmPopup && (
        <div className="fixed  inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Confirm Unlock
            </h2>
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
                    ? 'bg-indigo-400'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isUnlocking ? 'Unlocking...' : 'Confirm'}
              </button>
              
            </div>
          </div>
        </div>
      )}

      <div className="flex  flex-col lg:flex-row justify-center items-start gap-5 w-full">
        <div className="w-full lg:w-[32rem]">
          <div
            className="w-full h-80 sm:h-[26rem] rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setLightboxIdx(0)}
          >
            <img
              src={property.cover}
              alt="main"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex lg:hidden gap-3 mt-3">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="h-24 w-1/3 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setLightboxIdx(idx)}
              >
                {property.images[idx] ? (
                  <img
                    src={property.images[idx]}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-gray-500">
                    No Image
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-2 w-full lg:w-[16rem]">
          <div
            className="h-24 w-full lg:h-48 rounded-lg overflow-hidden cursor-pointer"
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
            className="h-24 w-full lg:h-52 relative rounded-lg overflow-hidden cursor-pointer"
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

        <div className="flex flex-col justify-between gap-6 w-full lg:w-[23rem]">
  <div className="w-full h-auto bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-2xl overflow-hidden p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col gap-6">

    {/* Owner's Contact */}
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        
        Owner's Contact
      </h2>

      <div className="text-gray-800 text-base">
        {isUnlocked ? (
          <span className={`font-medium ${!property.phone_visible ? 'text-red-500' : ''}`}>
            {displayPhone()}
          </span>
        ) : user && hasPaid ? (
          <div className="flex flex-col gap-3">
            <span className="font-medium flex items-center gap-2">
              <FaPhoneAlt className="text-indigo-600" /> +91xxxxxxx
            </span>

            {contactLimitReached ? (
              <p className="px-4 py-2 text-center bg-yellow-500 text-white text-sm rounded-lg shadow-sm">
                Upgrade Plan
              </p>
            ) : (
              <button
                onClick={() => setShowConfirmPopup(true)}
                disabled={isUnlocking}
                className={`w-full px-4 py-2 text-white text-sm rounded-lg shadow-md transition duration-200 ${
                  isUnlocking ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isUnlocking ? 'Unlocking...' : 'Unlock Contact'}
              </button>
            )}
          </div>
        ) : (
          <span className="font-medium flex items-center gap-2">
            <FaPhoneAlt className="text-indigo-600" /> +91xxxxxxx
          </span>
        )}
      </div>
    </div>

    <hr className="border-gray-200" />

    {/* One-time Service Fee */}
    <div>
      <p className="text-gray-600 text-sm mb-2">
        One-time Service Fee
        <button
          onClick={() => setShowPlanPopup(true)}
          className="text-sm text-blue-600 ml-2 hover:text-blue-800 transition"
        >
          <span className="inline-flex items-center underline space-x-1">
            What’s included?
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </span>
        </button>
      </p>
    </div>

    <hr className="border-gray-200" />

    {/* Payment Button */}
    <PaymentButton
      hasPaid={hasPaid}
      userMobile={userMobile}
      setHasPaid={setHasPaid}
    />
  </div>
</div>

      </div>
    </>
  );
}

export default PropertyHeaderSection;
