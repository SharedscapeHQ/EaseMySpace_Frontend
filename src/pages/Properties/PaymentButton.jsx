import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createOrder, verifyPayment } from "../../api/PaymentApi";
import { getCurrentUser } from "../../api/authApi";
import { fetchUserContactStatus } from "../../api/userApi";
import { Link, useNavigate } from "react-router-dom";
import InvoiceModal from "../../components/Subscription/InvoiceModal";

export default function PaymentButton({ hasPaid, userMobile, setHasPaid }) {
  const [userData, setUserData] = useState({});
  const [isPaying, setIsPaying] = useState(false);
  const [activeUserPhone, setActiveUserPhone] = useState("");
  const [showPlanOptions, setShowPlanOptions] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  const plans = {
    trial: {
      label: "Trial",
      amount: 399,
      description: "7 days validity with essential services.",
    },
    ultimate: {
      label: "Ultimate",
      amount: 1999,
      description: "45 days validity with all premium services",
    },
  };

  const GST_RATE = 18;

  // Fetch current user if logged in
  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        if (data?.subscription_status === "paid") setHasPaid(true);
        setUserData(data || {});
        const phone =
          data?.phone || localStorage.getItem("user_verified_mobile");
        if (phone) setActiveUserPhone(phone);
      } catch {
        const phone = localStorage.getItem("user_verified_mobile");
        if (phone) setActiveUserPhone(phone);
      }
    })();
  }, [setHasPaid]);

  // Fetch plan status for logged in users
  useEffect(() => {
    if (!activeUserPhone || hasPaid) return;
    fetchUserContactStatus()
      .then((res) => {
        if (res.hasPlan) {
          setHasPaid(true);
          if (!userData?.id) localStorage.setItem("has_paid_lead", "true");
        }
      })
      .catch(() => {});
  }, [activeUserPhone, hasPaid, setHasPaid, userData?.id]);

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
    if (!plan) return toast.error("❌ Invalid plan selected.");

    setIsPaying(true);
    const amountWithGST = Math.round(plan.amount * (1 + GST_RATE / 100));

    try {
      const loaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!loaded)
        return (
          toast.error("❌ Razorpay SDK failed to load."), setIsPaying(false)
        );

      const { orderId, currency } = await createOrder({
        amount: amountWithGST,
        planName: planKey,
      });

      let phone = userData.phone || userMobile || activeUserPhone;
      if (!phone)
        phone = prompt("📱 Please enter your phone number for payment:");
      if (!phone)
        return toast.error("Phone number is required."), setIsPaying(false);

      const options = {
        key: "rzp_live_5kR19yQxcQHzsv",
        amount: amountWithGST * 100,
        currency,
        name: "EaseMySpace",
        description: plan.description,
        order_id: orderId,
        prefill: {
          name: userData.firstName || "Guest User",
          email: userData.email || "guest@easemyspace.com",
          contact: phone.startsWith("+91") ? phone : `+91${phone}`,
        },
        theme: { color: "#6366F1" },
        handler: async (response) => {
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amountWithGST,
              user_id: userData?.id || null,
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
            console.error(err);
            toast.error("Something went wrong during verification.");
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
      console.error(err);
      toast.error("Something went wrong during payment setup.");
      setIsPaying(false);
    }
  };

  const proceedToPayment = (planKey) => {
    if (!userData?.id)
      return setShowPlanOptions(false), setShowLoginPopup(true);
    setShowPlanOptions(false);
    loadRazorpay(planKey);
  };

  return (
    <>
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

      <button
        className={`w-1/2 py-2.5 px-2 text-md rounded-xl transition-all ${
          hasPaid
            ? "bg-green-600 text-white"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        } ${isPaying ? "opacity-60 cursor-not-allowed" : ""}`}
        disabled={isPaying}
        onClick={() => setShowPlanOptions(true)}
      >
        {isPaying ? "Processing..." : hasPaid ? "Upgrade" : "Subscribe"}
      </button>

      {showPlanOptions && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowPlanOptions(false)}
        >
          <div
            className="relative bg-white p-6 rounded-lg w-[90%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowPlanOptions(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              Choose Your Plan
            </h2>
            <div className="space-y-4">
              {Object.entries(plans).map(([key, plan]) => (
                <div
                  key={key}
                  className={`relative border-2 ${
                    key === "trial" ? "border-yellow-400" : "border-red-500"
                  } bg-gradient-to-br to-white p-4 rounded-xl shadow hover:scale-[1.02] transition-all cursor-pointer`}
                  onClick={() => proceedToPayment(key)}
                >
                  <span
                    className={`absolute top-[-10px] right-[-10px] ${
                      key === "trial" ? "bg-yellow-400" : "bg-red-500"
                    } text-white text-xs px-2 py-1 rounded-full shadow`}
                  >
                    {plan.label}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {plan.label} - ₹{plan.amount} + GST
                  </h3>
                  <p className="text-sm text-gray-700">{plan.description}</p>
                </div>
              ))}
              <Link
                to="/subscription"
                className="block text-center text-sm text-blue-600 hover:underline mt-4"
              >
                More Details
              </Link>
            </div>
          </div>
        </div>
      )}

      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
            <button
              onClick={() => setShowLoginPopup(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Login Required
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Please login to continue with payment.
            </p>
            <button
              onClick={() => {
                const currentPath =
                  window.location.pathname + window.location.search;
                navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoiceUrl={invoiceUrl}
      />
    </>
  );
}
