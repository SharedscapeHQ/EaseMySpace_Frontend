import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { createOrder, verifyPayment } from "../../API/PaymentApi";
import { getCurrentUser } from "../../API/authAPI";

export default function PaymentButton({
  hasPaid,
  userMobile, // Still useful for payment prefill/verification
  setHasPaid,
  // isLoggedIn prop is no longer directly used for payment flow decisions here
  // setShowOtpPopup, // No longer needed
  // setOtpPopupPurpose, // No longer needed
}) {
  const [userData, setUserData] = useState({});
  const [isPaying, setIsPaying] = useState(false);

  // Fetch logged-in user data on component mount
  // This is still useful for prefilling Razorpay details if the user IS logged in.
  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);

        // If user is logged in and has a paid subscription, set hasPaid to true
        if (data?.subscription_status === "paid") {
          setHasPaid(true);
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        // Handle cases where user is not logged in or session expired
      }
    })();
  }, [setHasPaid]);

  // Check subscription status based on userMobile (for non-logged-in leads)
  // This helps identify if a non-logged-in user has already paid via OTP verification.
  useEffect(() => {
    if (userMobile) {
      axios
        .get(
          `https://api.easemyspace.in/api/payment/check-subscription?phone=${userMobile}`
        )
        .then((res) => {
          if (res.data.paid) {
            setHasPaid(true);
            localStorage.setItem("has_paid_lead", "true"); // Persist for leads
          }
        })
        .catch((err) => {
          console.error("Subscription check failed for lead:", err);
        });
    }
  }, [userMobile, setHasPaid]);

  // Helper function to load Razorpay script dynamically
  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // Initiates the Razorpay payment process
  const loadRazorpay = async () => {
    const amount = 1499; // Define the payment amount
    setIsPaying(true); // Set paying state to true

    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        toast.error("❌ Razorpay SDK failed to load. Check your connection.");
        setIsPaying(false); // Reset paying state
        return;
      }

      const { orderId, currency } = await createOrder(amount); // Create an order on your backend

      const options = {
        key: "rzp_live_5kR19yQxcQHzsv", // Your Razorpay Live Key
        amount: amount * 100, // Amount in paise
        currency,
        name: "EasyMySpace",
        description: "Unlock Owner Contact",
        order_id: orderId,
        handler: async function (response) {
          // This function is called on successful payment
          try {
            // Prefer logged-in user's phone, then the userMobile prop (from OTP verification), else prompt
            const phoneNumber =
              userData.phone ||
              userMobile ||
              prompt("📱 Please enter your phone number for payment records:");

            if (!phoneNumber) {
              toast.error("Phone number is required for payment verification.");
              setIsPaying(false);
              return;
            }

            const paymentDetails = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
              user_id: userData.id || null, // Pass user ID if logged in
              phone: phoneNumber,
              status: "paid",
            };

            const result = await verifyPayment(paymentDetails); // Verify payment on your backend

            if (result.success) {
              setHasPaid(true);
              // If the user was a lead (not logged in) and paid, persist this
              // We're inferring `isLoggedIn` here based on `userData.id` presence
              if (!userData.id) {
                localStorage.setItem("has_paid_lead", "true");
              }
              toast.success("✅ Payment successful! Contact unlocked.");
            } else {
              toast.error("⚠️ Payment verification failed!");
            }
          } catch (err) {
            console.error("❌ Verification error:", err);
            toast.error("Something went wrong during payment verification.");
          } finally {
            setIsPaying(false); // Reset paying state after verification attempt
          }
        },
        prefill: {
          name: userData.firstName || "Guest User",
          email: userData.email || "guest@easemyspace.com", // Provide a default if no email
          contact:
            userData.phone?.toString().startsWith("+91")
              ? userData.phone
              : `+91${userData.phone || userMobile || ""}`, // Ensure +91 prefix for Razorpay
        },
        theme: {
          color: "#6366F1", // Indigo-600 color
        },
        modal: {
          ondismiss: function () {
            // Called when the Razorpay modal is dismissed by the user
            setIsPaying(false); // Reset paying state
            console.warn("⚠️ Razorpay modal dismissed by user.");
            toast("Payment cancelled.", { icon: "👋" });
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle explicit payment failure (Razorpay callback)
      rzp.on("payment.failed", function (response) {
        setIsPaying(false); // Reset paying state
        console.error("Razorpay payment failed:", response.error);
        toast.error(`❌ Payment failed: ${response.error.description || "Unknown error"}.`);
      });

      rzp.open(); // Open the Razorpay payment modal
    } catch (err) {
      console.error("❌ Error during Razorpay setup or order creation:", err);
      toast.error("Something went wrong during payment setup.");
      setIsPaying(false); // Ensure paying state is reset on any error
    }
  };

  // Handles the button click logic - now directly initiates payment
  const handlePayment = () => {
    // If already paid or currently processing, do nothing
    if (hasPaid || isPaying) {
      return;
    }
    // Directly initiate Razorpay payment
    loadRazorpay();
  };

  // Custom event listener for initiating payment from other parts of the app
  // This allows other components to trigger the payment without directly calling loadRazorpay
  useEffect(() => {
    const handler = (e) => {
      // The event detail might contain specific payment info, if needed
      handlePayment(); // Call our local handler
    };

    document.addEventListener("initiate-payment", handler);
    return () => document.removeEventListener("initiate-payment", handler);
  }, [handlePayment]); // Added handlePayment to dependencies

  return (
    <button
      className={`mt-4 w-1/2 py-3 px-2 text-md font-semibold rounded-xl whitespace-nowrap transition-all ${
        hasPaid
          ? "bg-green-600 text-white cursor-default"
          : "bg-indigo-600 hover:bg-indigo-700 text-white"
      } ${isPaying ? "opacity-60 cursor-not-allowed" : ""}`}
      disabled={hasPaid || isPaying}
      onClick={handlePayment}
    >
      {hasPaid ? "Contact Unlocked" : isPaying ? "Processing..." : "Pay ₹1499"}
    </button>
  );
}