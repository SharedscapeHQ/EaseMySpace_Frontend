import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { createOrder, verifyPayment } from "../../API/PaymentApi";
import { getCurrentUser } from "../../API/authAPI";

export default function PaymentButton({
  hasPaid,
  userMobile, // This prop might be passed from PropertyDetails if it's the result of a fresh OTP verification
  setHasPaid,
}) {
  const [userData, setUserData] = useState({});
  const [isPaying, setIsPaying] = useState(false);
  const [activeUserPhone, setActiveUserPhone] = useState(""); // State to hold the most relevant phone number

  // Fetch logged-in user data and set initial phone number
  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);

        let determinedPhone = "";
        if (data?.phone) {
          // Priority 1: Logged-in user's phone
          determinedPhone = data.phone;
          if (data.subscription_status === "paid") {
            setHasPaid(true);
          }
        } else {
          // Priority 2: OTP verified lead's phone from localStorage
          const storedMobile = localStorage.getItem("user_verified_mobile");
          if (storedMobile) {
            determinedPhone = storedMobile;
          }
        }
        setActiveUserPhone(determinedPhone);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        // If an error occurs (e.g., not logged in), still try to get from localStorage
        const storedMobile = localStorage.getItem("user_verified_mobile");
        if (storedMobile) {
          setActiveUserPhone(storedMobile);
        }
      }
    })();
  }, [setHasPaid]);

  // Check subscription status based on activeUserPhone (for both logged-in and lead users)
  useEffect(() => {
    // Only proceed if activeUserPhone is available and hasPaid is not already true
    if (activeUserPhone && !hasPaid) {
      axios
        .get(
          `https://api.easemyspace.in/api/payment/check-subscription?phone=${activeUserPhone}`
        )
        .then((res) => {
          if (res.data.paid) {
            setHasPaid(true);
            // This is crucial: if a lead pays, mark them as paid in local storage
            if (!userData.id) { // Only set this if it's genuinely a lead (not a logged-in user)
                localStorage.setItem("has_paid_lead", "true");
            }
          }
        })
        .catch((err) => {
          console.error("Subscription check failed for lead:", err);
        });
    }
  }, [activeUserPhone, hasPaid, setHasPaid, userData.id]);


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

      // Determine the phone number to use for Razorpay prefill and backend verification
      // This logic will prioritize: userData.phone -> userMobile prop -> activeUserPhone (from localStorage) -> prompt
      let finalPhoneNumber = userData.phone || userMobile || activeUserPhone;

      // If still no phone, prompt the user as a last resort (should be rare with OTP flow)
      if (!finalPhoneNumber) {
          finalPhoneNumber = prompt("📱 Please enter your phone number for payment records:");
      }

      if (!finalPhoneNumber) {
        toast.error("Phone number is required for payment.");
        setIsPaying(false);
        return;
      }

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
            const paymentDetails = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
              user_id: userData.id || null, // Pass user ID if logged in
              phone: finalPhoneNumber, // <--- Use the determined finalPhoneNumber here
              status: "paid",
            };

            const result = await verifyPayment(paymentDetails); // Verify payment on your backend

            if (result.success) {
              setHasPaid(true);
              // If the user was a lead (not logged in) and paid, persist this for future visits
              if (!userData.id) { // Only set this if it's genuinely a lead (not a logged-in user)
                localStorage.setItem("has_paid_lead", "true");
                localStorage.setItem("user_verified_mobile", finalPhoneNumber); // Ensure the paid number is stored
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
          contact: finalPhoneNumber.startsWith("+91") ? finalPhoneNumber : `+91${finalPhoneNumber}`, // Ensure +91 prefix for Razorpay
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