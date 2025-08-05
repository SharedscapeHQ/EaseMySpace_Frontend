import { useEffect, useState } from 'react';
import PaymentButton from './PaymentButton';
import { getUnlockedLeads, unlockContact, fetchUserContactStatus } from '../../api/userApi';
import toast from "react-hot-toast";

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
  const [isThisPropertyUnlocked, setIsThisPropertyUnlocked] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  // Determine if property is unlocked
  const isUnlocked = userRole === "admin" || userRole === "owner" || isThisPropertyUnlocked;
  const contactLimitReached = contactStatus.remaining <= 0;

  useEffect(() => {
    if (!property || !hasPaid) return;

    getUnlockedLeads()
      .then((res) => {
        setUnlockedPropertyIds(res);
        const unlocked = res.map(String).includes(String(property.id));
        setIsThisPropertyUnlocked(unlocked);
      })
      .catch((err) => console.error("❌ Failed to fetch unlocked leads:", err));

    fetchUserContactStatus()
      .then(setContactStatus)
      .catch((err) => console.error("❌ Failed to fetch contact status:", err));
  }, [hasPaid, property?.id]);

  useEffect(() => {
    console.log("🔍 isUnlocked:", isUnlocked, "userRole:", userRole);
  }, [isUnlocked, userRole]);

  const displayPhone = () => {
    if (isUnlocked) {
      if (!property.phone_visible) return "📞 Hidden by owner";
      return `📞 ${property.owner_phone || "Unavailable"}`;
    }
    return "📞 +91xxxxxxx";
  };

  const handleUnlock = async () => {
    const remainingBefore = contactStatus.remaining ?? 0;

    const confirmUnlock = window.confirm(
      `⚠️ This will use 1 contact unlock from your plan.\nYou have ${remainingBefore} unlock${remainingBefore !== 1 ? "s" : ""} remaining.\nProceed?`
    );
    if (!confirmUnlock) return;

    setIsUnlocking(true);
    try {
      const { success } = await unlockContact(property.id);

      if (success) {
        // ✅ Immediately reflect in UI
        setIsThisPropertyUnlocked(true);

        // 🔄 Background sync
        getUnlockedLeads()
          .then((res) => setUnlockedPropertyIds(res))
          .catch(console.error);

        fetchUserContactStatus()
          .then((status) => setContactStatus(status))
          .catch(console.error);

        toast.success(`Contact unlocked!`);
      }
    } catch (err) {
      const msg = err?.response?.data?.msg;
      console.error("❌ Failed to unlock contact:", err);

      if (msg === "Contact already unlocked") {
        setIsThisPropertyUnlocked(true);

        getUnlockedLeads()
          .then((res) => setUnlockedPropertyIds(res))
          .catch(console.error);

        toast.success("Contact already unlocked.");
      } else {
        toast.error("Unlock limit reached. Upgrade your plan to unlock more contacts.");
      }
    } finally {
      setIsUnlocking(false);
    }
  };

  if (!property) return null;

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start gap-5 w-full">
      {/* Left section with images */}
      <div className="w-full lg:w-[32rem]">
        <div className="w-full h-80 sm:h-[26rem] rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightboxIdx(0)}>
          <img src={property.cover} alt="main" className="w-full h-full object-cover" />
        </div>

        <div className="flex lg:hidden gap-3 mt-3">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="h-24 w-1/3 rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightboxIdx(idx)}>
              {property.images[idx] ? (
                <img src={property.images[idx]} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-gray-500">No Image</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center thumbnails for large screens */}
      <div className="hidden lg:flex flex-col gap-5 w-full lg:w-[16rem]">
        <div className="h-24 w-full lg:h-48 rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightboxIdx(1)}>
          {property.images[1] ? (
            <img src={property.images[1]} alt="thumb" className="w-full h-full object-cover" />
          ) : (
            <p className="flex items-center justify-center h-full bg-gray-200 text-sm">No Image</p>
          )}
        </div>

        <div className="h-24 w-full lg:h-48 relative rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightboxIdx(property.video ? property.images.length : property.images.length - 1)}>
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

      {/* Right sidebar */}
      <div className="flex flex-col justify-between gap-5 w-full lg:w-[24rem]">
        {/* Contact box */}
        <div className="w-full h-auto bg-white border border-zinc-200 rounded-2xl overflow-hidden p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Owner's Contact</h2>
            <div className="text-gray-700 text-base">
              {isUnlocked ? (
                <span className={`font-medium ${!property.phone_visible ? "text-red-500" : ""}`}>{displayPhone()}</span>
              ) : user && hasPaid ? (
                <div className="flex flex-col gap-2">
                  <span className="font-medium">📞 +91xxxxxxx</span>
                  {contactLimitReached ? (
                    <button onClick={() => { toast.error("Contact unlock limit reached. Please upgrade your plan."); setShowPlanPopup(true); }} className="mt-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-md transition">Upgrade Plan</button>
                  ) : (
                    <button onClick={handleUnlock} disabled={isUnlocking} className={`mt-1 px-3 py-2 text-white text-sm rounded-md transition ${isUnlocking ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                      {isUnlocking ? "Unlocking..." : "Unlock Contact"}
                    </button>
                  )}
                </div>
              ) : (
                <span className="font-medium">📞 +91xxxxxxx</span>
              )}
            </div>
          </div>

          {/* Payment section */}
          <div>
            <p className="text-gray-600 text-sm mb-1">
              One-time Service Fee
              <button onClick={() => setShowPlanPopup(true)} className="text-sm text-blue-600 ml-2 hover:text-blue-800 transition">
                <span className="inline-flex items-center underline space-x-1">
                  What’s included?
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </span>
              </button>
            </p>
          </div>

          <PaymentButton hasPaid={hasPaid} userMobile={userMobile} setHasPaid={setHasPaid} />
        </div>

        {/* Location section */}
        <div className="w-full">
          <div className="w-full bg-zinc-100 border border-gray-300 rounded-2xl flex items-center justify-between p-4 shadow-sm">
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
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm font-medium hover:underline">See on Map</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyHeaderSection;
