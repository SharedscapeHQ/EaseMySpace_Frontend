import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createOrder, verifyPayment } from "../../api/PaymentApi";
import { getCurrentUser } from "../../api/authApi";
import InvoiceModal from "./InvoiceModal";
import OtpPopup from "../../pages/Properties/OtpPopup";

export default function PaymentButtonSubs({
  hasPaid,
  setHasPaid,
  planName,
  isOtpVerified,
  setIsOtpVerified,
  userMobile,
}) {
  const [userData, setUserData] = useState({});
  const [isPaying, setIsPaying] = useState(false);
  const [activeUserPhone, setActiveUserPhone] = useState(userMobile || "");
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  const plans = {
    trial: { amount: 8, description: "Trial Plan - 7 Days Access, 1 Contact" },
    ultimate: { amount: 3499, description: "Ultimate Plan - 45 Days Access, 20 Contacts" },
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);
        if (data?.subscription_status === "paid") setHasPaid(true);
        const phone = data?.phone || localStorage.getItem("user_verified_mobile") || "";
        setActiveUserPhone(phone);
        if (data) setIsOtpVerified(true); // if user exists, consider OTP verified
      } catch {
        setActiveUserPhone(localStorage.getItem("user_verified_mobile") || "");
      }
    })();
  }, [setHasPaid, setIsOtpVerified]);

  const loadScript = src =>
    new Promise(resolve => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const loadRazorpay = async planKey => {
    const plan = plans[planKey];
    if (!plan) return toast.error("❌ Invalid plan selected.");
    setIsPaying(true);

    try {
      const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!loaded) return toast.error("❌ Razorpay SDK failed to load.") && setIsPaying(false);

      const taxRate = 18;
      const amountWithGST = Math.round(plan.amount * (1 + taxRate / 100));

      const { orderId, currency } = await createOrder({ amount: amountWithGST, planName: planKey });

      let phone = userData.phone || userMobile || activeUserPhone;
      if (!phone) {
        phone = prompt("📱 Please enter your phone number for payment:");
        if (!phone) return toast.error("Phone number is required.") && setIsPaying(false);
      }

      const options = {
        key: "rzp_live_5kR19yQxcQHzsv",
        amount: amountWithGST * 100,
        currency,
        name: "EaseMySpace",
        description: plan.description,
        order_id: orderId,
        handler: async response => {
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amountWithGST,
              user_id: userData.id || null,
              phone,
              plan_type: planKey,
            });

            if (result.success) {
              setHasPaid(true);
              localStorage.setItem("has_paid_lead", "true");
              localStorage.setItem("user_verified_mobile", phone);
              toast.success("Payment successful!");

              setInvoiceUrl(result.data.invoice_url);
              setShowInvoiceModal(true);
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
      rzp.on("payment.failed", response => {
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

    const planKey = ["trial", "ultimate"].includes(planName?.toLowerCase()) ? planName.toLowerCase() : null;
    if (!planKey) return toast.error("❌ Invalid or missing plan name.");

    if (!userData?.id && !isOtpVerified) {
      // User not logged in, show OTP popup
      return setShowOtpPopup(true);
    }

    loadRazorpay(planKey);
  };

return (
  <>
    {/* FULL-SCREEN PAYMENT LOADER */}
    {isPaying && (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-indigo-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="text-indigo-600 font-semibold text-lg">
            Processing your payment...
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Please do not refresh or close the page
          </p>
        </div>
      </div>
    )}

    {/* PAYMENT BUTTON */}
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
      {isPaying ? "Processing..." : hasPaid ? "Subscribed" : "Subscribe"}
    </button>

    {showOtpPopup && (
      <OtpPopup
        onVerified={() => {
          setIsOtpVerified(true);
          setShowOtpPopup(false);
          toast.success("You can now proceed with payment.");
        }}
        onClose={() => setShowOtpPopup(false)}
        otpPurpose="Subscribe"
      />
    )}

    <InvoiceModal
      isOpen={showInvoiceModal}
      onClose={() => setShowInvoiceModal(false)}
      invoiceUrl={invoiceUrl}
    />
  </>
);

}
