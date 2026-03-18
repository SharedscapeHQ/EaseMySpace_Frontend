import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createRentOrder, verifyRentPayment } from "../../../api/userRentPaymentApiGrp/userRentPaymentApi";
import { getCurrentUser } from "../../../api/authApi";
import { SERVICE_CHARGE, getGst } from "./RentPayHelpers";

export default function RentPayBtn({ property, rentDetails, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.user || res);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePay = async () => {
    setLoading(true);

    const res = await loadRazorpay();
    if (!res) {
      toast.error("Failed to load Razorpay");
      setLoading(false);
      return;
    }

    try {
      const { rent, deposit, room_label, occupancy, locking_period, deduction } = rentDetails;

      // Total amount = rent + deposit + service fee + GST
     const totalAmount = +(rent + deposit + SERVICE_CHARGE + getGst()).toFixed(2);

const order = await createRentOrder({
  amount: totalAmount,
        property_id: property.id,
        room_label,
        occupancy,
        payment_month: new Date().getMonth() + 1,
        payment_year: new Date().getFullYear(),
        payment_type: "first",
        rent,
        deposit,
        deduction,
        locking_period,
      });

      const options = {
        key: "rzp_live_5kR19yQxcQHzsv",
        amount: order.order.amount,
        currency: "INR",
        name: "Rent Payment",
        description: `Rent + Deposit for ${property.property_name}`,
        order_id: order.order.id,
        handler: async function (response) {
          try {
            await verifyRentPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentData: { property_id: property.id, room_label, occupancy, rent, deposit, deduction, locking_period },
            });
            toast.success("Payment successful!");
            onSuccess?.();
          } catch (err) {
            toast.error("Payment verification failed!");
            console.error(err);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user ? `${user.firstName} ${user.lastName}` : "Tenant",
          email: user?.email || "user@example.com",
          contact: user?.phone || "9999999999",
        },
        theme: { color: "#4F46E5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment failed!");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className={`mt-4 w-full  py-2.5 rounded-lg transition ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700 text-white"
      }`}
    >
      {loading ? "Processing..." : "Confirm & Pay Rent"}
    </button>
  );
}
