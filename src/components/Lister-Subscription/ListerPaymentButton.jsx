import React, { useState } from "react";
import toast from "react-hot-toast";
import { createListerOrder, verifyListerPayment } from "../../api/ListerPaymentApi";
import LoginPopup from "../Subscription/LoginPopup";

export default function ListerPaymentButton({ plan, userData, onInvoiceGenerated }) {
  const [isPaying, setIsPaying] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const loadRazorpayScript = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });

  const goToLogin = () => {
    const currentPath = location.pathname + location.search;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const handlePayment = async () => {
    if (!userData?.id) return setShowLoginPopup(true);

    try {
      setIsPaying(true);
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setIsPaying(false);
        return toast.error("Razorpay SDK failed to load.");
      }

      const numericPrice = plan.numericPrice;
      const gstAmount = Math.round(numericPrice * 0.18);
      const total = numericPrice + gstAmount;

      const orderRes = await createListerOrder({ amount: total, planName: plan.id });
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
            else {
              toast.success("Payment Successful ✅");
              if (verifyRes.invoiceUrl) onInvoiceGenerated?.(verifyRes.invoiceUrl);
            }
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

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={isPaying}
        className="py-3 px-6 rounded-xl bg-indigo-500 text-white  text-lg transition-all"
      >
        {isPaying ? "Processing..." : "Pay Now"}
      </button>

      {showLoginPopup && (
        <LoginPopup
          isOpen={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
          onLoginClick={goToLogin}
        />
      )}
    </>
  );
}
