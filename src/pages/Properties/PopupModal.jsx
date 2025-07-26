export default function PopupModal({
  onClose,
  hasPaid,
  isLoggedIn,
  isOtpVerified,
  userMobile,
  setShowOtpPopup,
  setOtpPopupPurpose,
}) {
  const PLAN_FEATURES = [
    "✅ Unlimited Contact Access for 30 days",
    "✅ Help in scheduling visit at convenient time",
    "✅ Priority WhatsApp & Call Support",
    "✅ 100% Verified Owner Listings",
    "✅ Smart Match Recommendations",
    "✅ Curated Property Suggestions",
    "✅ Save Hours - Match Within Days",
  ];

  const handleSubscribeClick = () => {
    if (isLoggedIn || isOtpVerified) {
      const mobileToUse = isLoggedIn ? "9999999999" : userMobile;
      const event = new CustomEvent("initiate-payment", {
        detail: { amount: 1499, mobile: mobileToUse },
      });
      document.dispatchEvent(event);
    } else {
      setOtpPopupPurpose("Continue Payment");
      setShowOtpPopup(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative overflow-y-auto max-h-[90vh] animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-3xl text-gray-400 hover:text-red-500 transition"
        >
          ×
        </button>

        <div className="text-sm font-semibold uppercase text-white bg-gradient-to-r from-emerald-500 to-emerald-600 w-fit px-4 py-1 rounded-full mb-6 shadow">
          EMS Starter Plan
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Freedom to Find Your Perfect Match
            </h2>
            <p className="text-base text-gray-600">
              Full access to verified owners & properties for 30 days.
            </p>
          </div>
          <div className="text-right mt-4 sm:mt-0">
            <div className="text-xl text-gray-400 line-through">₹1699</div>
            <div className="text-3xl font-bold text-indigo-700">
              ₹1499{" "}
              <span className="text-lg font-medium text-gray-500">+ GST</span>
            </div>
            <div className="text-sm text-green-600 font-semibold">
              Save ₹200!
            </div>
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base text-gray-800 mb-8">
          {PLAN_FEATURES.map((feature, idx) => (
            <li
              key={idx}
              className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              {feature}
            </li>
          ))}
        </ul>

        <div className="text-center">
          <button
            className={`w-1/3 py-3 text-xl font-semibold rounded-xl transition-all ${
              hasPaid
                ? "bg-green-600 text-white cursor-default"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            disabled={hasPaid}
            onClick={handleSubscribeClick}
          >
            {hasPaid ? "Owner Details Unlocked" : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
}
