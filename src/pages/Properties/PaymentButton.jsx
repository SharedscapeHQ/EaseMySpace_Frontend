import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { createOrder, verifyPayment } from "../../api/PaymentApi";
import { AuthContext } from "../../context/AuthContextV1"; 
import { Link, useNavigate } from "react-router-dom";
import InvoiceModal from "../../components/Subscription/InvoiceModal";

export default function PaymentButton({ hasPaid, setHasPaid }) {
  const { user, isVerified } = useContext(AuthContext);
  const [isPaying, setIsPaying] = useState(false);
  const [showPlanOptions, setShowPlanOptions] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  const plans = {
    trial: { label: "Trial", amount: 499, description: "7 days validity" },
    ultimate: { label: "Ultimate", amount: 2999, description: "45 days validity" },
  };
  const GST_RATE = 18;

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
      if (!loaded) return toast.error("❌ Razorpay SDK failed to load.");

      const { orderId, currency } = await createOrder({
        amount: amountWithGST,
        planName: planKey,
      });

      const phone = user?.phone || prompt("📱 Enter your phone number:");
      if (!phone) return toast.error("Phone number required.");

      const options = {
        key: "rzp_live_5kR19yQxcQHzsv",
        amount: amountWithGST * 100,
        currency,
        name: "EaseMySpace",
        description: plan.description,
        order_id: orderId,
        prefill: { name: user?.firstName || "Guest", email: user?.email || "", contact: phone },
        theme: { color: "#6366F1" },
        handler: async (response) => {
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amountWithGST,
              user_id: user?.id || null,
              phone,
              plan_type: planKey,
            });
            if (result.success) {
              setHasPaid(true);
              toast.success("Payment successful!");
              setInvoiceUrl(result.data.invoice_url);
              setShowInvoiceModal(true);
            } else toast.error("⚠️ Payment verification failed!");
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
    if (!user?.id) return setShowLoginPopup(true);
    setShowPlanOptions(false);
    loadRazorpay(planKey);
  };

  return (
    <>
      <button
        className={`w-1/2 py-2.5 px-2 text-md rounded-xl transition-all ${
          hasPaid ? "bg-green-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
        } ${isPaying ? "opacity-60 cursor-not-allowed" : ""}`}
        disabled={isPaying}
        onClick={() => setShowPlanOptions(true)}
      >
        {isPaying ? "Processing..." : hasPaid ? "Upgrade" : "Subscribe"}
      </button>

      {/* Plan Options Modal */}
      {showPlanOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPlanOptions(false)}>
          <div className="relative bg-white p-6 rounded-lg w-[90%] max-w-md" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => setShowPlanOptions(false)}>×</button>
            <h2 className="text-xl mb-4 text-center">Choose Your Plan</h2>
            <div className="space-y-4">
              {Object.entries(plans).map(([key, plan]) => (
                <div
                  key={key}
                  className={`relative border-2 ${key === "trial" ? "border-yellow-400" : "border-red-500"} bg-gradient-to-br to-white p-4 rounded-xl shadow hover:scale-[1.02] transition-all cursor-pointer`}
                  onClick={() => proceedToPayment(key)}
                >
                  <span className={`absolute top-[-10px] right-[-10px] ${key === "trial" ? "bg-yellow-400" : "bg-red-500"} text-white text-xs px-2 py-1 rounded-full shadow`}>
                    {plan.label}
                  </span>
                  <h3 className="text-lg text-gray-800">{plan.label} - ₹{plan.amount} + GST</h3>
                  <p className="text-sm text-gray-700">{plan.description}</p>
                </div>
              ))}
              <Link to="/subscription" className="block text-center text-sm text-blue-600 hover:underline mt-4">More Details</Link>
            </div>
          </div>
        </div>
      )}

      {/* Login popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
            <button onClick={() => setShowLoginPopup(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">✕</button>
            <h2 className="text-lg text-gray-800 mb-4 text-center">Login Required</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">Please login to continue with payment.</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      <InvoiceModal isOpen={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} invoiceUrl={invoiceUrl} />
    </>
  );
}