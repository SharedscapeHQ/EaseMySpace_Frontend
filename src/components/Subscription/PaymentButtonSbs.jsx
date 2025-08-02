import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { createOrder, verifyPayment } from "../../api/PaymentApi";
import { getCurrentUser } from "../../api/authApi";
import OtpPopup from "../../pages/Properties/OtpPopup";

export default function PaymentButtonSubs({ hasPaid, setHasPaid, planName }) {
  const [userData, setUserData] = useState({});
  const [isPaying, setIsPaying] = useState(false);
  const [activeUserPhone, setActiveUserPhone] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(
    () => localStorage.getItem("otp_verified") === "true"
  );

  const plans = {
    standard: {
      amount: 399,
      description: "Standard Plan - Limited Access",
    },
    premium: {
      amount: 1499,
      description: "Premium Plan - Unlimited Access",
    },
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);

        let determinedPhone =
          data?.phone || localStorage.getItem("user_verified_mobile") || "";
        if (data?.subscription_status === "paid") {
          setHasPaid(true);
        }

        setActiveUserPhone(determinedPhone);
      } catch {
        const fallbackPhone = localStorage.getItem("user_verified_mobile");
        if (fallbackPhone) setActiveUserPhone(fallbackPhone);
      }
    })();
  }, [setHasPaid]);

  useEffect(() => {
    if (activeUserPhone && !hasPaid) {
      axios
        .get(
          `https://api.easemyspace.in/api/payment/check-subscription?phone=${activeUserPhone}`
        )
        .then((res) => {
          if (res.data.paid) {
            setHasPaid(true);
            if (!userData.id) {
              localStorage.setItem("has_paid_lead", "true");
            }
          }
        })
        .catch((err) => {
          console.error("Subscription check failed:", err);
        });
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
    const amount = plans[planKey].amount;
    setIsPaying(true);

    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        toast.error("❌ Razorpay SDK failed to load.");
        setIsPaying(false);
        return;
      }

      const { orderId, currency } = await createOrder(amount);

      let finalPhoneNumber =
        userData.phone ||
        activeUserPhone ||
        localStorage.getItem("user_verified_mobile");

      if (!finalPhoneNumber) {
        finalPhoneNumber = prompt(
          "📱 Please enter your phone number for payment:"
        );
      }

      if (!finalPhoneNumber) {
        toast.error("Phone number is required.");
        setIsPaying(false);
        return;
      }

      const options = {
        key: "rzp_live_5kR19yQxcQHzsv",
        amount: amount * 100,
        currency,
        name: "EasyMySpace",
        description: plans[planKey].description,
        order_id: orderId,
        handler: async function (response) {
          try {
            const paymentDetails = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
              user_id: userData.id || null,
              phone: finalPhoneNumber,
              status: "paid",
              plan_type: planKey,
            };

            const result = await verifyPayment(paymentDetails);

            if (result.success) {
              setHasPaid(true);
              if (!userData.id) {
                localStorage.setItem("has_paid_lead", "true");
                localStorage.setItem("user_verified_mobile", finalPhoneNumber);
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
          contact: finalPhoneNumber.startsWith("+91")
            ? finalPhoneNumber
            : `+91${finalPhoneNumber}`,
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
        console.error("Payment failed:", response.error);
        toast.error(`❌ Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      console.error("❌ Error during Razorpay setup:", err);
      toast.error("Something went wrong during payment setup.");
      setIsPaying(false);
    }
  };

  const handlePayment = () => {
    if (hasPaid || isPaying) return;

    let planKey;
    if (planName.toLowerCase().includes("basic")) {
      planKey = "standard";
    } else if (planName.toLowerCase().includes("starter")) {
      planKey = "premium";
    } else {
      toast.error("Unknown plan selected.");
      return;
    }

    if (!userData?.id && !isOtpVerified) {
      setShowOtpPopup(true);
      return;
    }

    loadRazorpay(planKey);
  };

  useEffect(() => {
    const handler = () => handlePayment();
    document.addEventListener("initiate-payment", handler);
    return () => document.removeEventListener("initiate-payment", handler);
  }, []);

  return (
    <>
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
        {hasPaid ? "Contact Unlocked" : isPaying ? "Processing..." : "Pay Now"}
      </button>

      {showOtpPopup && (
        <OtpPopup
          onVerified={() => {
            setIsOtpVerified(true);
            localStorage.setItem("otp_verified", "true");
            setShowOtpPopup(false);
            handlePayment();
          }}
          onClose={() => setShowOtpPopup(false)}
        />
      )}
    </>
  );
}
