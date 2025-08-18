import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { createOrder, verifyPayment } from "../../api/PaymentApi";
import { getCurrentUser } from "../../api/authApi";
import OtpPopup from "../../pages/Properties/OtpPopup";

export default function PaymentButtonSubs({
  hasPaid,
  setHasPaid,
  planName,
  isOtpVerified,
  setShowOtpPopup,
  userMobile,
}) {
  const [userData, setUserData] = useState({});
  const [isPaying, setIsPaying] = useState(false);
  const [activeUserPhone, setActiveUserPhone] = useState("");

  const plans = {
    standard: {
      amount: 499,
      description: "Standard Plan - 7 Days Access, 2 Contacts",
    },
    premium: {
      amount: 1999,
      description: "Premium Plan - 25 Days Access, 8 Contacts",
    },
    ultimate: {
      amount: 3499,
      description: "Ultimate Plan - 30 Days Access, Unlimited Contacts",
    },
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);

        const phone = data?.phone || localStorage.getItem("user_verified_mobile") || "";
        if (data?.subscription_status === "paid") setHasPaid(true);
        setActiveUserPhone(phone);
      } catch {
        const fallbackPhone = localStorage.getItem("user_verified_mobile");
        if (fallbackPhone) setActiveUserPhone(fallbackPhone);
      }
    })();
  }, [setHasPaid]);

  useEffect(() => {
    if (activeUserPhone && !hasPaid) {
      axios
        .get(`https://api.easemyspace.in/api/payment/check-subscription?phone=${activeUserPhone}`)
        .then((res) => {
          if (res.data.paid) {
            setHasPaid(true);
            if (!userData.id) localStorage.setItem("has_paid_lead", "true");
          }
        })
        .catch((err) => console.error("Subscription check failed:", err));
    }
  }, [activeUserPhone, hasPaid, setHasPaid, userData.id]);

  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const loadRazorpay = async (planKey) => {
    const plan = plans[planKey];
    if (!plan) {
      toast.error("❌ Invalid plan selected.");
      return;
    }

    const amount = plan.amount;
    setIsPaying(true);

    try {
      const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!loaded) {
        toast.error("❌ Razorpay SDK failed to load.");
        setIsPaying(false);
        return;
      }

      const { orderId, currency } = await createOrder({
  amount: plan.amount,
  planName: planKey,
});
      let phone = userData.phone || userMobile || localStorage.getItem("user_verified_mobile");

      if (!phone) {
        phone = prompt("📱 Please enter your phone number for payment:");
        if (!phone) {
          toast.error("Phone number is required.");
          setIsPaying(false);
          return;
        }
      }

      const options = {
        key: "rzp_live_5kR19yQxcQHzsv",
        amount: amount * 100,
        currency,
        name: "EaseMySpace",
        description: plan.description,
        order_id: orderId,
        handler: async function (response) {
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
              user_id: userData.id || null,
              phone,
              status: "paid",
              plan_type: planKey,
            });

            if (result.success) {
              setHasPaid(true);
              if (!userData.id) {
                localStorage.setItem("has_paid_lead", "true");
                localStorage.setItem("user_verified_mobile", phone);
              }
              toast.success("✅ Payment successful!");
            } else {
              toast.error("⚠️ Payment verification failed!");
            }
          } catch (err) {
            console.error("❌ Verification error:", err);
            toast.error("Something went wrong during verification.");
          } finally {
            setIsPaying(false);
          }
        },
        prefill: {
          name: userData.firstName || "Guest User",
          email: userData.email || "guest@easemyspace.com",
          contact: phone.startsWith("+91") ? phone : `+91${phone}`,
        },
        theme: { color: "#6366F1" },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            toast("Payment cancelled.", { icon: "👋" });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setIsPaying(false);
        toast.error(`❌ Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      console.error("❌ Razorpay setup error:", err);
      toast.error("Something went wrong during payment setup.");
      setIsPaying(false);
    }
  };

 const handlePayment = () => {
  if (hasPaid || isPaying) return;

  const planKey = planName?.toLowerCase();

  if (!plans[planKey]) {
    toast.error("❌ Invalid or missing plan name.");
    return;
  }

  // ✅ If user is NOT logged in and OTP not verified, show OTP popup
  if (!userData?.id && !isOtpVerified) {
    if (typeof setShowOtpPopup === "function") {
      setShowOtpPopup(true);
    }
    return;
  }

  // ✅ Proceed to payment if logged in OR OTP is verified
  loadRazorpay(planKey);
};


  useEffect(() => {
    const handler = () => handlePayment();
    document.addEventListener("initiate-payment", handler);
    return () => document.removeEventListener("initiate-payment", handler);
  }, []);

  return (
    <button
      style={{ fontFamily: "para_font" }}
      className={`mt-4 w-1/2 py-3 px-2 text-md rounded-xl whitespace-nowrap transition-all ${
        hasPaid
          ? "bg-green-600 text-white cursor-default"
          : "bg-indigo-600 hover:bg-indigo-700 text-white"
      } ${isPaying ? "opacity-60 cursor-not-allowed" : ""}`}
      disabled={hasPaid || isPaying}
      onClick={handlePayment}
    >
      {hasPaid ? "Contact Unlocked" : isPaying ? "Processing..." : "Subscribe"}
    </button>
  );
}
