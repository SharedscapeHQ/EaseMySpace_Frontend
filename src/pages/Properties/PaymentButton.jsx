import React, { useEffect, useState } from "react";
import axios from "axios";
import { createOrder, verifyPayment } from "../../API/PaymentApi";
import { getCurrentUser } from "../../API/authAPI";

export default function PaymentButton({
  hasPaid,
  isLoggedIn,
  isOtpVerified,
  userMobile,
  setHasPaid,
  setShowOtpPopup,
  setOtpPopupPurpose,
}) {
  const [userData, setUserData] = useState({});

  // Fetch current user if logged in
  useEffect(() => {
  (async () => {
    try {
      const data = await getCurrentUser();
      setUserData(data);

      // Check subscription_status from user data
      if (data?.subscription_status === 'paid') {
        setHasPaid(true);
      }

    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  })();
}, []);

useEffect(() => {
  if (userMobile) {
    axios
      .get(`https://api.easemyspace.in/api/payment/check-subscription?phone=${userMobile}`)
      .then((res) => {
        if (res.data.paid) {
          setHasPaid(true);
        }
      })
      .catch((err) => {
        console.error("Subscription check failed:", err);
      });
  }
}, [userMobile]);

  // Load Razorpay SDK
  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // Handle Razorpay flow
  const loadRazorpay = async () => {
    const amount = 1499;

    try {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        alert("❌ Razorpay SDK failed to load. Check your connection.");
        return;
      }

      // Create order
      const { orderId, currency } = await createOrder(amount);

      // Payment options
      const options = {
        key: "rzp_live_5kR19yQxcQHzsv",
        amount: amount * 100,
        currency,
        name: "EasyMySpace",
        description: "Unlock Owner Contact",
        order_id: orderId,
        handler: async function (response) {
          try {
            const phoneNumber =
              userData.phone || userMobile || prompt("📱 Enter your phone number to proceed:");

            const paymentDetails = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
              user_id: userData.id || null,
              phone: phoneNumber,
              status: "paid",
            };

            console.log("📦 Verifying payment:", paymentDetails);

            const result = await verifyPayment(paymentDetails);

            if (result.success) {
              setHasPaid(true);
              alert("✅ Payment successful! Contact unlocked.");
            } else {
              alert("⚠️ Payment verification failed!");
            }
          } catch (err) {
            console.error("❌ Verification error:", err);
            alert("Something went wrong during payment verification.");
          }
        },
        prefill: {
          name: userData.firstName || "Guest",
          email: userData.email || "guest@example.com",
          contact:
            userData.phone?.toString().startsWith("+91")
              ? userData.phone
              : `+91${userData.phone || userMobile || ""}`,
        },
        theme: {
          color: "#6366F1",
        },
        modal: {
          ondismiss: function () {
            console.warn("⚠️ Razorpay modal dismissed.");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        alert("❌ Payment failed. Please try again.");
      });

      rzp.open();
    } catch (err) {
      console.error("❌ Error during Razorpay setup:", err);
      alert("Something went wrong during payment setup.");
    }
  };

  // When button is clicked
  const handlePayment = () => {
    if (hasPaid) return;
    if (isLoggedIn || isOtpVerified) {
      loadRazorpay();
    } else {
      setOtpPopupPurpose("Continue Payment");
      setShowOtpPopup(true);
    }
  };

  // Listen for external "initiate-payment" events
  useEffect(() => {
    const handler = (e) => {
      const { amount, mobile } = e.detail;
      handlePayment(amount, mobile);
    };

    document.addEventListener("initiate-payment", handler);
    return () => document.removeEventListener("initiate-payment", handler);
  }, []);

  return (
    <button
      className={`mt-4 w-1/2 py-3 px-2 text-md font-semibold rounded-xl whitespace-nowrap transition-all ${
        hasPaid
          ? "bg-green-600 text-white cursor-default"
          : "bg-indigo-600 hover:bg-indigo-700 text-white"
      }`}
      disabled={hasPaid}
      onClick={handlePayment}
    >
      {hasPaid ? "Contact Unlocked" : "Pay ₹1499"}
    </button>
  );
}
