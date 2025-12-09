import React, { useEffect, useState } from "react";
import { FiMapPin, FiUser, FiExternalLink } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { getPropertiesWithPayments } from "../../../api/userApi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import PaymentHistory from "./PaymentHistory";
import { getCurrentUser } from "../../../api/authApi";
import RentPayBtn from "./RentPaymentBtn";

export default function PayRent() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [user, setUser] = useState(null);

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

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await getPropertiesWithPayments();
      setProperties(res || []);
    } catch (err) {
      toast.error("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const isCurrentMonthPaid = (payments) => {
    if (!payments?.length) return false;
    const now = new Date();
    return payments.some((p) => {
      const d = new Date(p.payment_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  };

  const getOverallNextDueDate = (payments) => {
    if (!payments?.length) return "N/A";
    const validDates = payments.map((p) => new Date(p.next_due_date)).filter((d) => !isNaN(d));
    if (!validDates.length) return "N/A";
    const latest = new Date(Math.max(...validDates));
    return latest.toDateString();
  };

  const getOccupiedDate = (payments) => {
    if (!payments?.length) return "N/A";
    const validDates = payments.map((p) => new Date(p.payment_date)).filter((d) => !isNaN(d));
    if (!validDates.length) return "N/A";
    const earliest = new Date(Math.min(...validDates));
    return earliest.toDateString();
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500 text-lg">Loading your rent details...</p>;

  if (!properties.length)
    return <p className="text-center mt-10 text-gray-500 text-lg">No rented properties found.</p>;

  return (
    <div className="space-y-10">
      {properties.map((property, index) => {
        const payments = property.payments || [];
        const lastPayment = property.lastPayment || {};

        // ✅ FIXED: Safe amount fallback
        const rentAmount = lastPayment.amount || property.default_rent || 0;

        const currentMonthPaid = isCurrentMonthPaid(payments);
        const nextDueDate = getOverallNextDueDate(payments);
        const occupiedSince = getOccupiedDate(payments);
        const initialDeposit = payments.find((p) => p.deposit && p.deposit > 0)?.deposit || 0;

        return (
          <motion.div
            key={property.property_id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-2/5 w-full">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={property.images?.[0] || "https://placehold.co/600x400?text=No+Image"}
                    alt={property.property_name || "Property"}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="bg-gray-50 px-6 py-5 border-t border-gray-100 space-y-2">
                  <h4 className="text-lg font-semibold text-gray-800 flex justify-between items-center">
                    {property.property_name || "Unnamed Property"}
                    <a
                      href={`/properties/${property.property_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 font-medium"
                    >
                      View <FiExternalLink className="inline text-sm" />
                    </a>
                  </h4>
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <FiMapPin className="text-gray-500" />
                    {property.address || "No address provided"}
                  </p>
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <FiUser className="text-gray-500" />
                    Room: {lastPayment.room_label || "N/A"} ({lastPayment.occupancy || "Single"})
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium text-gray-700">Occupied Since:</span> {occupiedSince}
                  </p>
                </div>
              </div>

              <div className="lg:w-3/5 w-full p-8 bg-gray-50 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-gray-100">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                  <AiOutlineCheckCircle className="text-green-600 text-3xl" />
                  <div>
                    <p className="font-semibold text-green-700">Deposit Paid</p>
                    <p className="text-gray-700 text-sm">Amount: ₹{initialDeposit}</p>
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-4 text-center font-medium shadow-sm ${
                    currentMonthPaid
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  }`}
                >
                  {currentMonthPaid
                    ? "✅ Rent for this month is paid."
                    : "⚠️ Rent for this month is due."}
                  <div className="text-sm mt-1">
                    <span className="font-semibold">Next due date:</span> {nextDueDate}
                  </div>
                </div>

                <RentPayBtn
                  property={{ ...property, lastPayment: { ...lastPayment, amount: rentAmount } }}
                  user={user}
                  payingId={payingId}
                  setPayingId={setPayingId}
                  fetchProperties={fetchProperties}
                />
              </div>
            </div>
          </motion.div>
        );
      })}

      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Overall Payment History</h2>
        <PaymentHistory payments={properties.flatMap((p) => p.payments || [])} />
      </div>
    </div>
  );
}
