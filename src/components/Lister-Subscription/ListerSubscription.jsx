import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import Footer from "../Footer";

export default function ListerSubscription() {
  const plan = {
    id: "standard",
    title: "Standard Lister",
    price: 999,
    duration: "45 Days",
    gst: "+18% GST",
    description: "Access all essential services for property owners.",
    features: [
      "Up to 2 property listings",
      "Unlimited edits & updates",
      "WhatsApp lead notifications",
      "Standard visibility",
      "Dedicated support",
      "Personalised Dashboard",
    ],
    color: "indigo",
  };

  const colorClasses = {
    indigo: "from-indigo-100 border-indigo-400",
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpay = async () => {
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) return toast.error("Razorpay SDK failed to load.");

      const gstAmount = Math.round(plan.price * 0.18);
      const total = plan.price + gstAmount;

      const user = JSON.parse(localStorage.getItem("user")) || {};
      const userName = user.firstName || "EaseMySpace User";
      const userEmail = user.email || "customer@example.com";
      const userPhone = user.phone || "9999999999";

      const options = {
        key: "rzp_live_5kR19yQxcQHzsv",
        amount: total * 100,
        currency: "INR",
        name: "EaseMySpace",
        description: plan.title,
        handler: function (response) {
          toast.success("Payment Successful ✅");
          console.log("Razorpay Payment ID:", response.razorpay_payment_id);
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone.startsWith("+91") ? userPhone : `+91${userPhone}`,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Failed to load Razorpay SDK.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-para_font">
      <Helmet>
        <title>Lister Subscription | EaseMySpace</title>
        <meta
          name="description"
          content="Choose the Standard Lister plan to access essential property listing services with EaseMySpace."
        />
      </Helmet>

      {/* Header */}
      <section className="px-4 lg:px-10 py-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "heading_font" }}
          className="text-3xl lg:text-5xl font-bold text-gray-900 mb-3"
        >
          Lister Subscription
        </motion.h1>
        <p className="text-gray-600 text-sm lg:text-base max-w-xl mx-auto">
          Get started with the Standard Lister plan. Manage your properties efficiently.
        </p>
      </section>

      {/* Subscription Card */}
      <section className="flex justify-center px-4 lg:px-10 pb-10">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className={`border-2 ${colorClasses[plan.color]} bg-gradient-to-br to-white p-8 rounded-3xl shadow-xl max-w-md w-full relative`}
        >
          {/* Badge */}
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
            Popular
          </span>

          {/* Title */}
          <h2
            style={{ fontFamily: "heading_font" }}
            className="text-2xl font-bold text-gray-900 mt-4 mb-2 text-center"
          >
            {plan.title}
          </h2>

          <p className="text-gray-600 text-center mb-6">{plan.description}</p>

          {/* Price */}
          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-gray-900">
              ₹{plan.price} <span className="text-lg font-medium text-gray-500">{plan.gst}</span>
            </p>
            <p className="text-green-600 font-semibold mt-1">{plan.duration}</p>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-6">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700">
                <span className="text-green-500 text-xl">✔</span> {f}
              </li>
            ))}
          </ul>

          {/* Pay Button */}
          <button
            onClick={openRazorpay}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all text-lg"
          >
            Pay Now
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
