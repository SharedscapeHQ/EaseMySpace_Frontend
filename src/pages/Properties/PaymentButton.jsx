import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createOrder, verifyPayment } from "../../api/PaymentApi";
import { getCurrentUser } from "../../api/authApi";
import { fetchUserContactStatus } from "../../api/userApi";
import { Link } from "react-router-dom";

export default function PaymentButton({ hasPaid, userMobile, setHasPaid }) {
  const [userData, setUserData] = useState({});
  const [isPaying, setIsPaying] = useState(false);
  const [activeUserPhone, setActiveUserPhone] = useState("");
  const [showPlanOptions, setShowPlanOptions] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = {
    // standard: {
    //   label: "Standard",
    //   amount: 499,
    //   description: "Access 2 contacts for 7 days.",
    // },
    premium: {
      label: "Premium",
      amount: 1499,
      description: "Access 8 contacts for 25 days.",
    },
    ultimate: {
      label: "Ultimate",
      amount: 2499,
      description: "Unlimited contacts for 30 days.",
    },
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);
        const phone = data?.phone || localStorage.getItem("user_verified_mobile");
        if (phone) setActiveUserPhone(phone);
        if (data?.subscription_status === "paid") setHasPaid(true);
      } catch {
        const phone = localStorage.getItem("user_verified_mobile");
        if (phone) setActiveUserPhone(phone);
      }
    })();
  }, [setHasPaid]);

  useEffect(() => {
    if (activeUserPhone && !hasPaid) {
      fetchUserContactStatus()
        .then((res) => {
          if (res.hasPlan) {
            setHasPaid(true);
            if (!userData.id) {
              localStorage.setItem("has_paid_lead", "true");
            }
          }
        })
        .catch(() => {});
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
    const amount = plan.amount;
    setIsPaying(true);

    try {
      const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!loaded) {
        toast.error("Razorpay SDK failed to load.");
        setIsPaying(false);
        return;
      }

      const { orderId, currency } = await createOrder({ amount, planName: planKey });
      let phone = userData.phone || userMobile || activeUserPhone;

      if (!phone) {
        phone = prompt("Please enter your phone number:");
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
        prefill: {
          name: userData.firstName || "Guest",
          email: userData.email || "guest@easemyspace.com",
          contact: phone,
        },
        theme: { color: "#6366F1" },
        handler: async (response) => {
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
              toast.success("Payment successful!");
            } else {
              toast.error("Payment verification failed!");
            }
          } catch {
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
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch {
      toast.error("Something went wrong during payment setup.");
      setIsPaying(false);
    }
  };

  const proceedToPayment = (planKey) => {
    setSelectedPlan(planKey);
    setShowPlanOptions(false);
    loadRazorpay(planKey);
  };

  const handlePayment = () => {
    if (!isPaying) setShowPlanOptions(true);
  };

  useEffect(() => {
    const handler = () => handlePayment();
    document.addEventListener("initiate-payment", handler);
    return () => document.removeEventListener("initiate-payment", handler);
  }, []);

  return (
    <>
      <button
        className={`mt-4 w-1/2 py-3 px-2 text-md font-semibold rounded-xl whitespace-nowrap transition-all ${
          hasPaid
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        } ${isPaying ? "opacity-60 cursor-not-allowed" : ""}`}
        disabled={isPaying}
        onClick={handlePayment}
      >
        {isPaying ? "Processing..." : hasPaid ? "Upgrade" : "Pay Now"}
      </button>

      {showPlanOptions && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowPlanOptions(false)}
        >
          <div
            className="relative bg-white p-6 rounded-lg w-[90%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowPlanOptions(false)}
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">Choose Your Plan</h2>

            <div className="space-y-4">
              {Object.entries(plans).map(([key, plan]) => (
                <div
                  key={key}
                  className={`relative border-2 ${
                    key === "standard"
                      ? "border-indigo-400 from-indigo-50"
                      : key === "premium"
                      ? "border-yellow-400 from-yellow-50"
                      : "border-red-500 from-purple-50"
                  } bg-gradient-to-br to-white p-4 rounded-xl shadow hover:scale-[1.02] transition-all cursor-pointer`}
                  onClick={() => proceedToPayment(key)}
                >
                  <span
                    className={`absolute top-[-10px] right-[-10px] ${
                      key === "standard"
                        ? "bg-indigo-500"
                        : key === "premium"
                        ? "bg-yellow-400"
                        : "bg-red-500"
                    } text-white text-xs font-bold px-2 py-1 rounded-full shadow`}
                  >
                    {plan.label}
                  </span>
                  <h3
                    className={`text-lg font-semibold ${
                      key === "standard"
                        ? "text-indigo-600"
                        : key === "premium"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
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
    </>
  );
}
