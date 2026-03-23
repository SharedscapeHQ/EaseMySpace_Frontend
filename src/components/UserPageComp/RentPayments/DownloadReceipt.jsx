import React, { useEffect, useState } from "react";
import { getPropertiesWithPayments } from "../../../api/userApi";
import { toast } from "react-hot-toast";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function DownloadReceipt() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        const properties = await getPropertiesWithPayments();

        const allReceipts = properties.flatMap((property) => {
          const sortedPayments =
            property.payments?.sort((a, b) => {
              if (a.payment_year === b.payment_year) {
                return a.payment_month - b.payment_month;
              }
              return a.payment_year - b.payment_year;
            }) || [];

          return sortedPayments.map((p, idx) => ({
            id: `${property.property_id}-${p.id}`,
            tenant: p.tenant_name || "—",
            property: property.property_name,
            room: p.room_label || "—",
            occupancy: p.occupancy || "—",
            amount: p.amount,
            deposit: idx === 0 ? p.deposit || 0 : 0,
            paymentMonth: p.payment_month,
            paymentYear: p.payment_year,
paymentDate: p.payment_date
  ? new Date(p.payment_date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : "—",
            receipt_url: p.receipt_url || null,
          }));
        });

        setReceipts(allReceipts);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load receipts");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const handleDownload = async (r) => {
    if (!r.receipt_url) {
      toast.error("Receipt not available");
      return;
    }

    try {
      toast.loading("Downloading...");

      const response = await fetch(r.receipt_url);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Receipt_${r.property}_${r.paymentMonth}_${r.paymentYear}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Downloaded successfully");
    } catch (err) {
      toast.dismiss();
      toast.error("Download failed");
    }
  };

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Your Receipts
      </h2>

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
        </div>
      ) : receipts.length ? (
        <div className="space-y-4">
          {receipts.map((r) => {
            const paidFor = `${MONTH_NAMES[r.paymentMonth - 1]} ${r.paymentYear}`;

            return (
              <div
                key={r.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition"
              >
                {/* Left */}
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-800">
                    {r.property}
                  </p>

                  <p className="text-sm text-indigo-600 font-medium">
                    Paid for {paidFor}
                  </p>

                  <p className="text-sm text-gray-500">
                    Payment Date: {r.paymentDate}
                  </p>

                  <p className="text-sm text-gray-700 font-medium">
                    ₹{r.amount}
                    {r.deposit > 0 && (
                      <span className="text-gray-500 font-normal">
                        {" "}+ ₹{r.deposit} deposit
                      </span>
                    )}
                  </p>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleDownload(r)}
                  className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
                >
                  Download Receipt
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center mt-20 text-gray-500">
          <p className="text-lg font-medium">No receipts found</p>
          <p className="text-sm">
            Receipts will appear after successful payments
          </p>
        </div>
      )}
    </div>
  );
}