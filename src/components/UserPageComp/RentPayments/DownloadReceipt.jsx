import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { getPropertiesWithPayments } from "../../../api/userApi";
import jsPDF from "jspdf";
import logo from "/navbar-assets/brand-logo.png";

export default function DownloadReceipt() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        const properties = await getPropertiesWithPayments();

        const allReceipts = [];

        properties.forEach((property) => {
          const sortedPayments = property.payments?.sort((a, b) => {
            if (a.payment_year === b.payment_year) return a.payment_month - b.payment_month;
            return a.payment_year - b.payment_year;
          }) || [];

          sortedPayments.forEach((p, idx) => {
            allReceipts.push({
              id: `${property.property_id}-${p.id}`,
              tenant: p.tenant_name || "—",
              property: property.property_name,
              room: p.room_label || "—",
              occupancy: p.occupancy || "—",
              amount: p.amount,
              deposit: idx === 0 ? p.deposit || 0 : 0,
              paymentMonth: p.payment_month,
              paymentYear: p.payment_year,
              date: new Date(p.payment_date).toLocaleDateString("en-IN"),
              nextDueDate: p.next_due_date ? new Date(p.next_due_date).toLocaleDateString("en-IN") : "—",
            });
          });
        });

        setReceipts(allReceipts);
      } catch (err) {
        console.error("Failed to fetch receipts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const generatePDF = (r) => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    const img = new Image();
    img.src = logo;
    img.onload = () => {
      const logoWidth = 120;
      const logoHeight = (img.height / img.width) * logoWidth;
      doc.addImage(img, "PNG", 40, 30, logoWidth, logoHeight);

      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      const title = "Rent Payment Receipt";
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, 80);

      const startY = 130;
      const lineHeight = 22;
      let currentY = startY;

      const details = [
        ["Tenant Name", r.tenant],
        ["Property", r.property],
        ["Room", r.room],
        ["Occupancy", r.occupancy],
        ["Month/Year", `${r.paymentMonth}/${r.paymentYear}`],
        ["Payment Date", r.date],
        ["Next Due Date", r.nextDueDate],
        ["Amount Paid", `Rs ${r.amount}`],
      ];

      if (r.deposit > 0) details.push(["Deposit Paid", `Rs ${r.deposit}`]);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      details.forEach(([label, value]) => {
        doc.text(`${label}: ${value}`, 40, currentY);
        currentY += lineHeight;
      });

      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(40, currentY + 10, pageWidth - 40, currentY + 10);
      currentY += 30;

      doc.setFontSize(10);
      doc.text(
        "Thank you for your payment. Please retain this receipt for your records.",
        40,
        currentY
      );

      doc.save(`Rent_Receipt_${r.property}_${r.paymentMonth}_${r.paymentYear}.pdf`);
    };
  };

return (
  <div className=" mx-auto">


    {/* Loading State */}
    {loading ? (
      <div className="space-y-4">
        {Array(4)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className="border border-gray-200 p-4 rounded-xl shadow-sm animate-pulse"
            >
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
      </div>
    ) : receipts.length ? (
      <div className="space-y-4">
        {receipts.map((r) => (
          <div
            key={r.id}
            className="border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer bg-white"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-semibold text-gray-800">{r.property}</p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Tenant:</span> {r.tenant}
                </p>
                <p className="text-sm text-gray-600">
                  {r.paymentMonth}/{r.paymentYear} | Paid on: {r.date}
                </p>
                <p className="text-sm text-gray-600">
                  Rent: <span className="font-medium">₹{r.amount}</span>
                  {r.deposit > 0 && (
                    <> | Deposit: <span className="font-medium">₹{r.deposit}</span></>
                  )}
                </p>
              </div>

              <button
                onClick={() => generatePDF(r)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm shadow-md transition-all"
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center text-gray-500 mt-8">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-lg font-medium">No receipts available yet</p>
        <p className="text-sm mt-1">Generate receipts once your tenant makes rent payments.</p>
      </div>
    )}
  </div>
);

}
