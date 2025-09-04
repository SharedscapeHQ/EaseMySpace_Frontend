import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createOrder, verifyPayment } from "../../api/PaymentApi";
import { getCurrentUser } from "../../api/authApi";
import InvoiceModal from "./InvoiceModal";

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
  const [activeUserPhone, setActiveUserPhone] = useState(userMobile || "");
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const plans = {
    trial: { amount: 399, description: "Trial Plan - 7 Days Access, 1 Contact" },
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
      } catch {
        setActiveUserPhone(localStorage.getItem("user_verified_mobile") || "");
      }
    })();
  }, [setHasPaid]);

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

              // Show invoice modal
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

    if (!userData?.id && !isOtpVerified && setShowOtpPopup) return setShowOtpPopup(true);

    loadRazorpay(planKey);
  };

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
        {isPaying ? "Processing..." : hasPaid ? "Subscribed" : "Subscribe"}
      </button>

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoiceUrl={invoiceUrl}
      />
    </>
  );
}
