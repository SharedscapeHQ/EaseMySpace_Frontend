import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { getAllDeletedPropertiesById } from '../../api/ownerApi';
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaWifi,
  FaParking,
  FaSnowflake,
  FaTv,
  FaChair,
  FaLock,
  FaGasPump,
  } from 'react-icons/fa';
import { GiIceCube } from "react-icons/gi";
import { FiEye, FiCheckCircle  } from "react-icons/fi";

import {
  MdOutlineSecurity,
  MdOutlineLocalLaundryService,
  MdOutlineElevator,
  MdOutlinePower,
} from 'react-icons/md';
import { FaShower } from 'react-icons/fa';

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
  cctv: <MdOutlineSecurity />,
  security: <FaLock />,
  geyser: <FaShower />,
  lift: <MdOutlineElevator />,
  'power backup': <MdOutlinePower />,
  furniture: <FaChair />,
  tv: <FaTv />,
  'gas connection': <FaGasPump />,
};

function PropertyDetail() {


  const loadScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const loadRazorpay = async (amount,userMobile, onSuccessCallback) => {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  // 🧠 Make backend API call to get orderId
  const orderRes = await axios.post("https://api.easemyspace.in/api/payment/create-order", {
    amount,
  });

  const { orderId, currency } = orderRes.data;

  const options = {
    key: "rzp_live_5kR19yQxcQHzsv", 
    amount: amount * 100, 
    currency,
    name: "EasyMySpace",
    description: "Unlock Owner Contact",
    order_id: orderId,
    handler: function (response) {
      
      onSuccessCallback(); 
    },
    prefill: {
      name: "Test User",
      email: "test@example.com",
      contact: userMobile.startsWith('+91') ? userMobile : `+91${userMobile}`, 
    },
    theme: {
      color: "#6366F1",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};








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
  const [loggedInUser, setLoggedInUser] = useState(() => {
  const cache = localStorage.getItem("user");
  return cache ? JSON.parse(cache) : null;
});

const isPrivilegedUser = loggedInUser?.role === 'admin' || loggedInUser?.role === 'owner';
const [hasPaid, setHasPaid] = useState(isPrivilegedUser);

  const [showPlanPopup, setShowPlanPopup] = useState(false);




  // otp state management

  const [isOtpVerified, setIsOtpVerified] = useState(() => {
  return localStorage.getItem("otp_verified") === "true";
});


  const [resending, setResending] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
  const cache = localStorage.getItem("user");
  return !!cache;
});

const [showFullDesc, setShowFullDesc] = useState(() => {
  return localStorage.getItem("otp_verified") === "true";
});

const [otpPopupPurpose, setOtpPopupPurpose] = useState('Read More');

const [showOtpPopup, setShowOtpPopup] = useState(false);
const [userMobile, setUserMobile] = useState('');
const [userOtp, setUserOtp] = useState('');
const [otpSent, setOtpSent] = useState(false);


useEffect(() => {
  const syncLogin = () => {
    const cache = localStorage.getItem("user");
    setIsLoggedIn(!!cache);
  };

  window.addEventListener("storage", syncLogin);
  window.addEventListener("auth-change", syncLogin); 
  return () => {
    window.removeEventListener("storage", syncLogin);
    window.removeEventListener("auth-change", syncLogin);
  };
}, []);


  useEffect(() => {
    if (!property) {
      getAllDeletedPropertiesById(id)
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


useEffect(() => {
  if (otpSent) {
    const timeout = setTimeout(() => {
      const input = document.getElementById("otpInput");
      input?.focus();
    }, 100);

    return () => clearTimeout(timeout);
  }
}, [otpSent]);




 const handleSendOtp = async () => {

  if (userMobile.length === 10) {
    try {
      setResending(true);

      const res = await axios.post("https://api.easemyspace.in/api/leads/send-otp", {
        phone: userMobile,
      });


      if (res.data.message === 'otp_sent') {
  setOtpSent(true);
  alert("OTP sent successfully!");
} else {
  alert(res.data.message || "Failed to send OTP.");
}
    } catch (err) {
      alert("Error sending OTP. Please try again.");
    } finally {
      setResending(false);
    }
  } else {
    alert("Enter valid 10-digit mobile number");
  }
};



const handleVerifyOtp = async () => {
  const formattedPhone = userMobile.startsWith("+91") ? userMobile : `+91${userMobile}`;

  try {
    const res = await axios.post("https://api.easemyspace.in/api/leads/verify-otp", {
      phone: formattedPhone,
      code: userOtp,
    });


    if (res.data.verified === true) {
      setIsOtpVerified(true);  
      localStorage.setItem("otp_verified", "true");        
      setShowOtpPopup(false);          
      setShowFullDesc(true);           

      alert("OTP verified successfully!");
    } else {
      alert(res.data.message || "Invalid OTP.");
    }
  } catch (err) {
    alert("Error verifying OTP.");
  }
};




  if (loading || !property)
    return <p className="text-center mt-20 text-indigo-600">Loading...</p>;

  





  return (
    <>
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setLightboxIdx(null)}>
          <button onClick={(e) => { e.stopPropagation(); stepLightbox(-1); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl">
            <FaChevronLeft />
          </button>
          <div className="relative">
            {lightboxIdx === property.images.length ? (
              <video src={property.video} controls autoPlay className="max-h-[90vh] max-w-[90vw] rounded-lg" />
            ) : (
              <img src={property.images[lightboxIdx]} alt="" className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain" />
            )}
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
              {lightboxIdx + 1} / {property.images.length + (property.video ? 1 : 0)}
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); stepLightbox(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl">
            <FaChevronRight />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }} className="absolute top-6 right-6 text-white text-4xl">
            <FaTimes />
          </button>
        </div>
      )}

    {showPlanPopup && (
  <PopupModal
    onClose={() => setShowPlanPopup(false)}
    hasPaid={hasPaid}
    isLoggedIn={isLoggedIn}           
    isOtpVerified={isOtpVerified}
    userMobile={userMobile}
    loadRazorpay={loadRazorpay}
    setHasPaid={setHasPaid}
    setShowOtpPopup={setShowOtpPopup}
    setOtpPopupPurpose={setOtpPopupPurpose}
  />
)}



      <main className="w-full min-h-screen bg-[#f2f2f2] py-5 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col bg-white p-5 rounded-2xl gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap">
  <div className="text-xl font-semibold text-gray-800">
  {generateTitle(property.title)}{" "}
  <span className="text-sm text-red-600 font-normal">
    {property.deleted_by_owner_code ? `(Deleted by: ${property.deleted_by_owner_code})` : ""}
  </span>
</div>

  {property.verified && (
    <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
  <FiCheckCircle className="text-sm" />
  Verified
</span>

    
  )}

</div>



          {/* Cover image and side images */}
          <div className="flex flex-col lg:flex-row justify-center items-start gap-5 w-full">
            <div className="w-full lg:w-[32rem] h-80 sm:h-[26rem] rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightboxIdx(0)}>
              <img src={property.cover} alt="main" className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col gap-5 w-full lg:w-[16rem]">
              <div className="h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightboxIdx(1)}>
                {property.images[1] ? (
                  <img src={property.images[1]} alt="thumb" className="w-full h-full object-cover" />
                ) : (
                  <p className="flex items-center justify-center h-full bg-gray-200 text-sm">No Image</p>
                )}
              </div>
              <div className="h-40 sm:h-48 relative rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setLightboxIdx(property.video ? property.images.length : property.images.length - 1)}>
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

            <div className="flex flex-col justify-between gap-5 w-full lg:w-[24rem]">
              <div className="w-full h-auto bg-white border border-zinc-200 rounded-2xl overflow-hidden p-6 shadow-lg flex flex-col justify-between">
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
                  <p className="text-gray-500 text-sm mb-1">One-time Service Fee <span className='text-zinc'><button
  onClick={() => setShowPlanPopup(true)}
  className="text-sm text-blue-600 underline mt-2"
>
  What's included?
</button></span></p>
                </div>
                <button
                  className={`mt-4 w-1/2 py-3 px-2 text-md font-semibold rounded-xl whitespace-nowrap transition-all ${hasPaid
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  disabled={hasPaid}
                onClick={() => {
  if (isLoggedIn || isOtpVerified) {
  const mobileToUse = isLoggedIn ? "9999999999" : userMobile;
  loadRazorpay(1299, mobileToUse, () => {
    setHasPaid(true);
    alert("Payment successful! Contact unlocked.");
  });
} else {
  setOtpPopupPurpose('Continue Payment');
  setShowOtpPopup(true);
}
}}
                >
                  {hasPaid ? 'Contact Unlocked' : 'Pay ₹1299'}
                </button>
              </div>

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
            {showFullDesc || isLoggedIn ? (
  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
) : (
  <div>
    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
      {property.description?.slice(0, 180)}...
    </p>
    <button
  className="mt-2 text-blue-600 hover:underline text-sm font-medium"
  onClick={() => {
    setOtpPopupPurpose('Read More');
    setShowOtpPopup(true);
  }}
>
  Read More
</button>
  </div>
)}

{showOtpPopup && (
  <div
    key={otpSent ? 'otp-mode' : 'mobile-mode'}  
    className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
  >
    <div className="bg-white rounded-xl p-6 w-80 shadow-lg relative">
      <button
        onClick={() => setShowOtpPopup(false)}
        className="absolute top-2 right-3 text-gray-500 text-xl"
      >
        ×
      </button>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Verify to {otpPopupPurpose}</h3>

      <input
        type="text"
        placeholder="Enter your mobile number"
        maxLength={10}
        className="w-full mb-2 px-3 py-2 border border-gray-300 rounded"
        value={userMobile}
        onChange={(e) => setUserMobile(e.target.value)}
      />

      {otpSent && (
        <>
          <input
            id="otpInput"
            type="text"
            placeholder="Enter OTP"
            className="w-full mb-2 px-3 py-2 border border-gray-300 rounded"
            value={userOtp}
            onChange={(e) => setUserOtp(e.target.value)}
          />
          <button
            onClick={handleSendOtp}
            className="text-indigo-600 text-sm mb-2 hover:underline disabled:text-gray-400"
            disabled={resending}
          >
            Resend OTP
          </button>
        </>
      )}

      {!otpSent ? (
        <button
          onClick={handleSendOtp}
          className="w-full bg-indigo-600 text-white py-2 rounded mt-2 font-medium"
        >
          Send OTP
        </button>
      ) : (
        <button
          onClick={handleVerifyOtp}
          className="w-full bg-green-600 text-white py-2 rounded mt-2 font-medium"
        >
          Verify OTP
        </button>
      )}
    </div>
  </div>
)}



            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <InfoItem label="Rent" value={`₹${property.price || 'N/A'}`} />
              <InfoItem label="Flat Status" value={property.flat_status || 'N/A'} />
              <InfoItem label="BHK Type" value={property.bhk_type || 'N/A'} />
              <InfoItem label="Looking For" value={property.looking_for || 'N/A'} />
              <InfoItem label="Occupancy" value={property.occupancy || 'N/A'} />
              <InfoItem label="Gender" value={property.gender || 'N/A'} />
            </div>
          </div>

         
<div>
  <h2 className="text-xl font-bold text-indigo-700 mt-8 mb-3">Amenities</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Known Amenities */}
    {knownAmenities.map((amenity, idx) => {
      const isAvailable =
        property.amenities?.some(
          (item) => item?.toLowerCase() === amenity.toLowerCase()
        );

      return (
        <div
          key={`known-${idx}`}
          className={`flex items-center gap-4 px-5 py-4 rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.03] ${
            isAvailable
              ? 'bg-green-50 border border-green-200'
              : 'bg-gray-100 border border-gray-200'
          }`}
        >
          <div
            className={`text-2xl transition-colors duration-300 ${
              isAvailable ? 'text-green-600 animate-pulse' : 'text-gray-400'
            }`}
          >
            {amenityIcons[amenity] || '🔲'}
          </div>
          <span className="transition-colors duration-300 text-gray-800 font-normal capitalize">
            {amenity}
          </span>
        </div>
      );
    })}

    {/* Extra (Unknown) Amenities */}
    {(property.amenities || [])
      .filter(
        (item) =>
          item &&
          !knownAmenities.includes(item.toLowerCase())
      )
      .map((extra, idx) => (
        <div
          key={`extra-${idx}`}
          className="flex items-center gap-4 px-5 py-4 rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.03] bg-blue-50 border border-blue-200"
        >
          <div className="text-2xl text-green-600">
  <span className="inline-block">🧩</span>
</div>
          <span className="text-gray-800 font-normal capitalize">
            {extra}
          </span>
        </div>
      ))}
  </div>
</div>



        </div>
      </main>
    </>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="bg-gray-50 px-4 py-3 rounded-xl shadow-sm">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  );


  
  
}
function PopupModal({
  onClose,
  hasPaid,
  isLoggedIn,              
  isOtpVerified,
  userMobile,
  loadRazorpay,
  setHasPaid,
  setShowOtpPopup,
  setOtpPopupPurpose
}) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh] shadow-xl">
        <button onClick={onClose} className="absolute top-3 right-4 text-2xl text-gray-500 font-bold">×</button>
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-2">What’s Included in <span className="text-black"> ₹1299</span></h2>
        <p className="text-center text-gray-600 mb-4">Unlock everything you need to find your perfect flatmate — with one simple fee.</p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm">
          {[
            "✅ Contact Access - View up to 5 listings/month for 1 month",
            "✅ No Recurring Fees - One-time payment only",
            "✅ Priority Support - Fast help when needed",
            "✅ Verified Listings - Spam-free & safe",
            "✅ Smart Matching - Match your lifestyle",
            "✅ Help in finding - Curated profile suggestions",
            "✅ Fast, Easy and Time Saving - Find matches in a week"
          ].map((point, i) => (
            <li key={i} className="bg-gray-50 p-3 rounded-md border border-gray-200">{point}</li>
          ))}
        </ul>

       
        <div className="mt-4 flex justify-center">
          <button  className={`mt-4 w-[30%] py-4 px-2 text-sm font-semibold rounded-xl transition-all ${hasPaid
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  disabled={hasPaid}
                onClick={() => {
  if (isLoggedIn || isOtpVerified) {
  const mobileToUse = isLoggedIn ? "9999999999" : userMobile;
  loadRazorpay(1299, mobileToUse, () => {
    setHasPaid(true);
    alert("Payment successful! Contact unlocked.");
  });
} else {
  setOtpPopupPurpose('Continue Payment');
  setShowOtpPopup(true);
}
}}
                >
                  {hasPaid ? 'Owner Details Unlocked' : 'Get Started ₹1299'}</button>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;