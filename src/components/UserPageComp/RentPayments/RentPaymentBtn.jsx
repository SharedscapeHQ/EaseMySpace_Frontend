import React from "react";
import toast from "react-hot-toast";
import {
  verifyMonthlyRentPayment,
  createMonthlyRentOrder,
} from "../../../api/userRentPaymentApiGrp/userRentPaymentApi";

export default function RentPayBtn({
  property,
  user,
  payingId,
  setPayingId,
  fetchProperties, 
}) {
  const isCurrentMonthPaid = (payments) => {
    if (!payments?.length) return false;
    const now = new Date();
    return payments.some((p) => {
      const d = new Date(p.payment_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayRent = async () => {
    const payments = property.payments || [];
    const lastPayment = property.lastPayment || {};
    const now = new Date();

    let month, year;

    if (isCurrentMonthPaid(payments)) {
      const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      month = next.getMonth() + 1;
      year = next.getFullYear();
    } else {
      month = now.getMonth() + 1;
      year = now.getFullYear();
    }

    // ✅ Split: paise for Razorpay, rupees for backend
    const amountInRupees = lastPayment.amount || 0; 
    const amountInPaise = amountInRupees * 100;

    const res = await loadRazorpay();
    if (!res) {
      toast.error("Failed to load Razorpay");
      return;
    }

    try {
      setPayingId(property.property_id);

      const order = await createMonthlyRentOrder({
        amount: amountInPaise, 
        property_id: property.property_id,
        room_label: lastPayment.room_label || "default",
        occupancy: lastPayment.occupancy || "single",
        payment_month: month,
        payment_year: year,
      });

      const options = {
        key: "rzp_live_5kR19yQxcQHzsv",
        amount: order.order.amount,
        currency: "INR",
        name: "Rent Payment",
        description: `Monthly Rent for ${property.property_name || "Property"}`,
        order_id: order.order.id,
        handler: async function (response) {
          try {
            await verifyMonthlyRentPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              paymentData: {
                property_id: property.property_id,
                amount: amountInRupees,
                payment_month: month,
                payment_year: year,
                room_label: lastPayment.room_label || "default",
                occupancy: lastPayment.occupancy || "single",
              },
            });

            toast.success("Payment successful!");
            fetchProperties();
          } catch (err) {
            toast.error("Payment verification failed!");
            console.error(err);
          } finally {
            setPayingId(null);
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
      setPayingId(null);
    }
  };

  const currentMonthPaid = isCurrentMonthPaid(property.payments || []);

  return (
    <button
      onClick={handlePayRent}
      disabled={payingId === property.property_id}
      className={`w-full py-3 rounded-xl text-white  shadow-sm transition-colors duration-300 ${
        currentMonthPaid
          ? "bg-indigo-600 hover:bg-indigo-700"
          : "bg-yellow-600 hover:bg-yellow-700"
      } ${payingId === property.property_id ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {payingId === property.property_id
        ? "Processing..."
        : currentMonthPaid
        ? "Pay Next Month (Advance)"
        : "Pay Due Rent"}
    </button>
  );
}
