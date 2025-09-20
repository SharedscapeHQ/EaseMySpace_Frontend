import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import PaymentButtonSubs from "./PaymentButtonSbs";
import Footer from "../Footer";
import axios from "axios";
import { getCurrentUser } from "../../api/authApi";

// Icons
const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);
const CrossIcon = () => (
  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function SubscriptionPlans() {
  const [hasPaid, setHasPaid] = useState(false);
  const [userData, setUserData] = useState({});
  const [userMobile, setUserMobile] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // For mobile bottom sheet

  // Fetch current user
  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);
        if (data?.subscription_status === "paid") setHasPaid(true);

        const phone = data?.phone || localStorage.getItem("user_verified_mobile") || "";
        setUserMobile(phone);
      } catch {
        const fallbackPhone = localStorage.getItem("user_verified_mobile");
        if (fallbackPhone) setUserMobile(fallbackPhone);
      }
    })();
  }, []);

  // Check subscription status if phone exists
  useEffect(() => {
    if (userMobile && !hasPaid) {
      axios
        .get(`https://api.easemyspace.in/api/payment/check-subscription?phone=${userMobile}`)
        .then((res) => {
          if (res.data.paid) setHasPaid(true);
        })
        .catch((err) => console.error("Subscription check failed:", err));
    }
  }, [userMobile, hasPaid]);

  const plans = [
    {
      type: "trial",
      title: "Trial Plan",
      description: "7 days validity with essential services",
      originalPrice: "₹599",
      price: "₹399",
      gst: "+ GST",
      savings: "Save ₹200!",
      color: "yellow",
      features: [
        { text: "Up to 1 Property Visits (In-person)", included: true },
        { text: "1 Property Owner Contact Unlocks", included: true },
        { text: "Dedicated Relationship Manager", included: true },
        { text: "Accompanied Property Visits (With EMS Executive)", included: true },
        { text: "Up to 1 Video Tours Before Visit", included: true },
        { text: "Relocation Assistance (On-call)", included: true },
        { text: "Post-shifting Support - Standard", included: true },
        { text: "Match Recommendations - Basic", included: true },
      ],
    },
    {
      type: "ultimate",
      title: "Ultimate Plan",
      description: "45 days validity with all premium services",
      originalPrice: "₹3,799",
      price: "₹3,499",
      gst: "+ GST",
      savings: "Save ₹300!",
      color: "red",
      features: [
        { text: "Up to 20 Property Visits (In-person)", included: true },
        { text: "20 Property Owner Contact Unlocks", included: true },
        { text: "Dedicated Relationship Manager", included: true },
        { text: "Accompanied Property Visits (With EMS Executive)", included: true },
        { text: "Unlimited Video Tours Before Visit", included: true },
        { text: "Relocation Assistance (On-call)", included: true },
        { text: "Post-shifting Support - Extended & Priority", included: true },
        { text: "Match Recommendations - Hand-picked by RM", included: true },
      ],
    },
  ];

  const borderColors = {
    yellow: "border-yellow-400",
    red: "border-red-400",
    indigo: "border-indigo-400",
  };
  const bgColors = {
    yellow: "from-yellow-50",
    red: "from-red-50",
    indigo: "from-indigo-50",
  };
  const textColors = {
    yellow: "text-yellow-500",
    red: "text-red-500",
    indigo: "text-indigo-500",
  };
  const badgeColors = {
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    indigo: "bg-indigo-500",
  };

  return (
    <div style={{ fontFamily: "para_font" }} className="min-h-screen bg-white font-inter">
      <Helmet>
        <title>Subscription Plans Of EaseMySpace | Verified PGs, Flats & Flatmates in Mumbai</title>
        <meta
          name="description"
          content="Choose the perfect subscription plan to access verified PGs, shared flats, and flatmates in Mumbai areas like Andheri, Goregaon, Thane, and Ghatkopar. Get expert support and premium services to find your ideal rental space quickly and hassle-free."
        />
        <meta
          name="keywords"
          content="PG subscription Mumbai, Flatmates subscription Mumbai, Verified flats Mumbai, Premium property access, EaseMySpace plans, Andheri PGs, Goregaon flats, Thane shared flats, Ghatkopar rentals"
        />
        <link rel="canonical" href="https://easemyspace.in/subscription-plans" />
      </Helmet>

      <section className="pb-10 lg:px-10 pt-3 px-3">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "heading_font" }}
          className="text-2xl lg:text-4xl lg:mt-5 text-zinc-900"
        >
          Choose Your Plan
        </motion.h1>
        <p className="mt-3 text-xs lg:text-base text-zinc-700">
          Get started with verified PGs, shared flats, flatmates, and expert support in Mumbai – your perfect rental space is one step away.
        </p>
      </section>

      {/* Plans Section */}
      <section className="mx-auto lg:px-10 px-3 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative border-2 ${borderColors[plan.color]} bg-gradient-to-br ${bgColors[plan.color]} to-white p-4 rounded-2xl shadow-lg lg:hover:scale-[1.02] transition-all`}
          >
            {/* Badge */}
            <span
              className={`absolute -top-3 left-1/2 -translate-x-1/2 ${badgeColors[plan.color]} text-white text-xs px-2 py-1 rounded-full shadow uppercase tracking-wider`}
            >
              {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
            </span>

            {/* Mobile Summary Card */}
            <div className="flex flex-col gap-2 lg:hidden">
              <h2 style={{ fontFamily: "heading_font" }} className="text-lg font-semibold">{plan.title}</h2>
              <p className="text-sm text-zinc-700">{plan.price} <span className="text-xs">{plan.gst}</span></p>
              <p className="text-green-500 text-xs">{plan.savings}</p>

              {/* Quick Summary */}
              <div className="flex justify-between mt-2 text-xs text-zinc-600">
  <span>
    Owner Contacts: {
      plan.features
        .filter(f => f.text.toLowerCase().includes("contact"))
        .reduce((sum, f) => sum + (parseInt(f.text.match(/\d+/)?.[0] || "0")), 0)
    }
  </span>
  <span>
    Bookings: {
      plan.features
        .filter(f => f.text.toLowerCase().includes("property visits"))
        .reduce((sum, f) => sum + (parseInt(f.text.match(/\d+/)?.[0] || "0")), 0)
    }
  </span>
</div>


              <button
                className={`mt-2 w-full py-2 rounded-lg text-white ${badgeColors[plan.color]}`}
                onClick={() => setSelectedPlan(plan)}
              >
                More Details
              </button>
            </div>

            {/* Desktop Full Layout */}
            <div className="hidden lg:flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-4">
              <div className="lg:w-1/3">
                <h2 style={{ fontFamily: "heading_font" }} className="text-xl mb-1">{plan.title}</h2>
                <p className="text-xs italic mb-4">{plan.description}</p>
                <div className="mb-4">
                  <p className="line-through text-zinc-500 text-lg">{plan.originalPrice}</p>
                  <p className={`text-3xl font-extrabold ${textColors[plan.color]}`}>
                    {plan.price} <span className="text-xl font-normal">{plan.gst}</span>
                  </p>
                  <p className="text-green-500 font-semibold text-sm">{plan.savings}</p>
                </div>
              </div>
              <div className="lg:w-2/3">
                <ul className="space-y-3 text-sm mb-6">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {feat.included ? <CheckIcon /> : <CrossIcon />} {feat.text}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-center lg:justify-end">
                  <PaymentButtonSubs
                    hasPaid={hasPaid}
                    setHasPaid={setHasPaid}
                    isOtpVerified={isOtpVerified}
                    setIsOtpVerified={setIsOtpVerified}
                    userMobile={userMobile}
                    planName={plan.type}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Mobile Bottom Sheet Popup */}
     {selectedPlan && (
  <motion.div
    className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end"
    onClick={() => setSelectedPlan(null)}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-lg"
      onClick={(e) => e.stopPropagation()}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <button
        className="text-right w-full mb-4 text-gray-500 font-bold"
        onClick={() => setSelectedPlan(null)}
      >
        Close
      </button>
      <h2 style={{ fontFamily: "heading_font" }} className="text-xl mb-2">{selectedPlan.title}</h2>
      <p className="text-sm italic mb-4">{selectedPlan.description}</p>
      <p className="text-2xl font-bold text-zinc-900 mb-2">{selectedPlan.price} <span className="text-xs">{selectedPlan.gst}</span></p>
      <p className="text-green-500 text-sm mb-4">{selectedPlan.savings}</p>

      <ul className="space-y-2 text-sm mb-4">
        {selectedPlan.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2">
            {feat.included ? <CheckIcon /> : <CrossIcon />} {feat.text}
          </li>
        ))}
      </ul>

      <PaymentButtonSubs
        hasPaid={hasPaid}
        setHasPaid={setHasPaid}
        isOtpVerified={isOtpVerified}
        setIsOtpVerified={setIsOtpVerified}
        userMobile={userMobile}
        planName={selectedPlan.type}
      />
    </motion.div>
  </motion.div>
)}


      <Footer />
    </div>
  );
}
