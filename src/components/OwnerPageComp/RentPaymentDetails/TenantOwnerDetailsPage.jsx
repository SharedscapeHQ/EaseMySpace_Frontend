import React, { useMemo, useState } from "react";
import { FiArrowLeftCircle, FiHome, FiUser } from "react-icons/fi";
import { IoChevronForward, IoChevronDown } from "react-icons/io5";

export default function TenantOwnerDetailsPage({ data, onBack }) {
  const property = data?.property || {};
  const owner = data?.owner || {};
  const tenants = data?.tenants || [];
  const occupancy = data?.occupancy;

  const [expandedIndex, setExpandedIndex] = useState(null);

  const tenantGroups = useMemo(() => {
    const map = {}; 

    tenants.forEach((t) => {
      const key = `${t.email}_${occupancy}`;
      const transactionData = t.payment
        ? [
            {
              amount_paid: t.payment.amount || 0,
              payment_status: t.payment.status || "pending",
              is_advance: t.payment.is_advance || false,
              payment_date: t.payment.paid_on,
              next_due_date: t.payment.next_due_date,
              deposit: t.payment?.deposit || 0,
            },
          ]
        : [];

      if (map[key]) {
        map[key].transactions.push(...transactionData);
      } else {
        map[key] = {
          propertyTitle: property.title,
          propertyLocation: property.location,
          bhkType: property.bhk_type,
          flatStatus: property.flat_status,
          ownerName: owner.name,
          ownerEmail: owner.email,
          ownerPhone: owner.phone,
          ownerBalance: owner.balance,
          tenantName: t.name,
          tenantEmail: t.email,
          tenantPhone: t.phone,
          tenantGender: t.gender,
          occupancy: occupancy,
          transactions: transactionData,
        };
      }
    });

    return Object.values(map);
  }, [tenants, property, owner, occupancy]);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10 lg:px-20">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8 transition"
      >
        <FiArrowLeftCircle size={22} /> Back to Properties
      </button>

      <h1 className="text-3xl font-bold text-center mb-10 text-indigo-700">
        Tenant Overview
      </h1>

      {tenantGroups.length === 0 ? (
        <div className="text-center text-gray-600 py-20">
          No tenants found for this property.
        </div>
      ) : (
        tenantGroups.map((t, i) => {
          const isExpanded = expandedIndex === i;
          const depositAmount = t.transactions.find(tx => tx.deposit > 0)?.deposit || 0;

          return (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-10 hover:shadow-xl transition-all"
            >
              {/* Property Information */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-2">
                  <FiHome className="text-indigo-500" /> Property Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  <p><b>Property Title:</b> {t.propertyTitle}</p>
                  <p><b>Location:</b> {t.propertyLocation}</p>
                  <p><b>BHK Type:</b> {t.bhkType}</p>
                  <p><b>Status:</b> {t.flatStatus || "—"}</p>
                </div>
              </div>

              {/* Owner Information */}
              <div className="mb-6 border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-2">
                  <FiUser className="text-indigo-500" /> Owner Information
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-700">
                  <p><b>Name:</b> {t.ownerName}</p>
                  <p><b>Email:</b> {t.ownerEmail}</p>
                  <p><b>Phone:</b> {t.ownerPhone || "N/A"}</p>
                  <p><b>Balance:</b> ₹{t.ownerBalance || 0}</p>
                </div>
              </div>

              {/* Tenant Information */}
              <div className="mb-6 border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-2">
                  <FiUser className="text-indigo-500" /> Tenant Information
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-700">
                  <p><b>Name:</b> {t.tenantName}</p>
                  <p><b>Email:</b> {t.tenantEmail}</p>
                  <p><b>Phone:</b> {t.tenantPhone || "N/A"}</p>
                  <p><b>Gender:</b> {t.tenantGender || "—"}</p>
                  <p><b>Occupancy:</b> <span className="capitalize">{t.occupancy || "—"}</span></p>
                </div>
              </div>

              {depositAmount > 0 && (
                <div className="mb-3 bg-amber-50 border border-amber-200 text-center rounded-xl p-3 text-sm text-amber-800 shadow-sm font-medium">
                  💰 Security Deposit: ₹{depositAmount}
                </div>
              )}

              {/* Transactions Table */}
              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-3 justify-between">
                  💳 Tenant Payment Transactions
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : i)}
                    className="p-1 text-indigo-600 hover:text-indigo-800"
                  >
                    {isExpanded ? <IoChevronDown size={20} /> : <IoChevronForward size={20} />}
                  </button>
                </h2>

                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead className="bg-indigo-100 text-indigo-700">
                        <tr>
                          <th className="py-2 px-3 text-left">Amount Paid (₹)</th>
                          <th className="py-2 px-3 text-left">Payment Date</th>
                          <th className="py-2 px-3 text-left">Next Due</th>
                          <th className="py-2 px-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.transactions.length > 0
                          ? t.transactions.map((tx, idx) => (
                              <tr key={idx} className="border-t hover:bg-gray-50 transition">
                                <td className="py-2 px-3 text-green-600 font-medium">₹{tx.amount_paid || 0}</td>
                                <td className="py-2 px-3">{tx.payment_date ? formatDate(tx.payment_date) : "—"}</td>
                                <td className="py-2 px-3">{tx.next_due_date ? formatDate(tx.next_due_date) : "—"}</td>
                                <td className="py-2 px-3">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      tx.is_advance
                                        ? "bg-yellow-100 text-yellow-800"
                                        : tx.payment_status === "paid"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {tx.is_advance ? "Advance" : tx.payment_status || "pending"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          : (
                              <tr>
                                <td colSpan="4" className="text-center text-gray-500 py-3">No transactions found.</td>
                              </tr>
                            )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
