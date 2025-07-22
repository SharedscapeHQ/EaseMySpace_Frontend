import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);
        console.log("✅ userData:", data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    })();
  }, []);

  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const loadRazorpay = async () => {
    const amount = 1499;

    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const { orderId, currency } = await createOrder(amount);

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
              userData.phone || userMobile || prompt("Enter your phone number");

            const paymentDetails = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
              user_id: userData.id || 1,
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
          contact: userData.phone?.startsWith("+91")
            ? userData.phone
            : `+91${userData.phone || userMobile || ""}`,
        },
        theme: {
          color: "#6366F1",
        },
        modal: {
          ondismiss: function () {
            console.warn("Razorpay payment modal dismissed by user.");
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

  const handlePayment = () => {
    if (hasPaid) return;
    if (isLoggedIn || isOtpVerified) {
      loadRazorpay();
    } else {
      setOtpPopupPurpose("Continue Payment");
      setShowOtpPopup(true);
    }
  };

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
