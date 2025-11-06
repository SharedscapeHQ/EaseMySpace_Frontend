import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import Footer from "../Footer";
import LoginPopup from "../Subscription/LoginPopup";
import { getCurrentUser } from "../../api/authApi";
import { createListerOrder, verifyListerPayment } from "../../api/ListerPaymentApi";

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

export default function ListerSubscription() {
  const [userData, setUserData] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: "standard",
      type: "Standard",
      title: "Standard Lister",
      description: "Access all essential services for property owners.",
      price: "₹999",
      gst: "+18% GST",
      duration: "45 Days",
      color: "indigo",
      features: [
        { text: "Up to 2 property listings", included: true },
        { text: "Unlimited edits & updates", included: true },
        { text: "WhatsApp lead notifications", included: true },
        { text: "Standard visibility", included: true },
        { text: "Dedicated support", included: true },
        { text: "Personalised Dashboard", included: true },
      ],
    },
  ];

  const borderColors = { indigo: "border-indigo-400" };
  const bgColors = { indigo: "from-indigo-50" };
  const badgeColors = { indigo: "bg-indigo-500" };

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        setUserData(user);
      } catch {
        setUserData(null);
      }
    })();
  }, []);

  const loadRazorpayScript = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });

  const openRazorpay = async (plan) => {
    if (!userData?.id) return setShowLoginPopup(true);

    try {
      setIsPaying(true);
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setIsPaying(false);
        return toast.error("Razorpay SDK failed to load.");
      }

      const numericPrice = parseInt(plan.price.replace("₹", ""));
      const gstAmount = Math.round(numericPrice * 0.18);
      const total = numericPrice + gstAmount;

      const orderRes = await createListerOrder({
        amount: total,
        planName: plan.id,
      });
      if (!orderRes?.success) throw new Error("Failed to create order.");

      const options = {
        key: "rzp_live_5kR19yQxcQHzsv",
        amount: total * 100,
        currency: "INR",
        name: "EaseMySpace",
        description: plan.title,
        order_id: orderRes.orderId,
        prefill: {
          name: userData.firstName || "EaseMySpace User",
          email: userData.email || "customer@example.com",
          contact: userData.phone?.startsWith("+91")
            ? userData.phone
            : `+91${userData.phone || "9999999999"}`,
        },
        theme: { color: "#4f46e5" },
        handler: async function (response) {
          try {
            const verifyRes = await verifyListerPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyRes?.success) toast.error("Payment verification failed. Contact support.");
            else toast.success("Payment Successful ✅");
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed.");
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            toast("Payment cancelled.", { icon: "👋" });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setIsPaying(false);
        toast.error(`❌ Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      setIsPaying(false);
      console.error(err);
      toast.error("Payment process failed. Please try again.");
    }
  };

  const goToLogin = () => {
    const currentPath = location.pathname + location.search;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  return (
    <div style={{ fontFamily: "para_font" }} className="min-h-screen bg-white font-inter">
      <Helmet>
        <title>Lister Subscription | EaseMySpace</title>
        <meta
          name="description"
          content="Choose the Standard Lister plan to access essential property listing services with EaseMySpace."
        />
      </Helmet>

      {isPaying && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <svg
              className="animate-spin h-12 w-12 text-indigo-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-indigo-600 font-semibold text-lg">Processing your payment...</p>
            <p className="text-sm text-gray-600 mt-2">Please do not refresh or close the page</p>
          </div>
        </div>
      )}

      <section className="pb-10 lg:px-10 pt-3 px-3">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "heading_font" }}
          className="text-2xl lg:text-4xl lg:mt-5 text-zinc-900"
        >
          Lister Subscription
        </motion.h1>
        <p className="mt-3 text-xs lg:text-base text-zinc-700">
          Get started with our subscription plans. Manage your properties efficiently.
        </p>
      </section>

      {/* Plans Section */}
      <section
        className={`mx-auto lg:px-10 px-3 pb-10 grid grid-cols-1 lg:gap-6 ${
          plans.length === 1 ? "lg:grid-cols-1 justify-items-center" : "lg:grid-cols-2"
        }`}
      >
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={`relative border-2 ${borderColors[plan.color]} bg-gradient-to-br ${bgColors[plan.color]} to-white p-4 rounded-2xl shadow-lg lg:hover:scale-[1.02] transition-all`}
          >
            {/* Badge */}
            <span
              className={`absolute -top-3 left-1/2 -translate-x-1/2 ${badgeColors[plan.color]} text-white text-xs px-2 py-1 rounded-full shadow uppercase tracking-wider`}
            >
              {plan.type}
            </span>

            {/* Desktop Layout */}
            <div className="hidden lg:flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-4">
              <div className="lg:w-1/3">
                <h2 style={{ fontFamily: "heading_font" }} className="text-xl mb-1">{plan.title}</h2>
                <p className="text-xs italic mb-4">{plan.description}</p>
                <p className="text-3xl font-extrabold text-zinc-900">
                  {plan.price} <span className="text-xl font-normal">{plan.gst}</span>
                </p>
                <p className="text-green-500 font-semibold text-sm">{plan.duration}</p>
              </div>
              <div className="lg:w-2/3 flex flex-col justify-start">
                <ul className="space-y-3 text-sm mb-6">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckIcon /> {feat.text}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-center lg:justify-end">
                  <button
                    onClick={() => openRazorpay(plan)}
                    className={`py-3 px-6 rounded-xl ${badgeColors[plan.color]} text-white font-semibold text-lg transition-all`}
                  >
                    Pay Now
                  </button>
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
            <p className="text-green-500 text-sm mb-4">{selectedPlan.duration}</p>
 
            <ul className="space-y-2 text-sm mb-4">
              {selectedPlan.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckIcon /> {feat.text}
                </li>
              ))}
            </ul>

            <button
              onClick={() => openRazorpay(selectedPlan)}
              className={`py-3 px-6 rounded-xl ${badgeColors[selectedPlan.color]} text-white font-semibold text-lg w-full`}
            >
              Pay Now
            </button>
          </motion.div>
        </motion.div>
      )}

      {showLoginPopup && (
        <LoginPopup
          isOpen={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
          onLoginClick={goToLogin}
        />
      )}

      <Footer />
    </div>
  );
}
