import { FaCalendarAlt, FaRupeeSign } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";

export default function PaymentHistory({ payments }) {
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  if (!payments?.length) {
    return (
      <div className="text-gray-500 text-sm text-center p-4 border rounded-xl bg-gray-50">
        No payment records found.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* Title */}
      <p className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
        <MdOutlinePayment className="text-indigo-500" /> Payment History
      </p>

      {/* Headings */}
      <div className="grid grid-cols-4 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
        <span className="text-left">Date</span>
        <span className="text-center">Amount</span>
        <span className="text-center">Month</span>
        <span className="text-right">Status</span>
      </div>

      <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
        {payments.map((p, i) => {
          const monthName = monthNames[p.payment_month - 1] || "N/A";
          const paymentDate = new Date(p.payment_date).toDateString();
          const isAdvance = p.is_advance || false;

          return (
            <div
              key={i}
              className={`grid grid-cols-4 items-center text-sm py-2 px-2 rounded-lg transition-all duration-150 ${
                isAdvance
                  ? "bg-yellow-50 hover:bg-yellow-100"
                  : "hover:bg-gray-50"
              }`}
            >
              {/* Date */}
              <div className="flex items-center gap-2 text-gray-700">
                <FaCalendarAlt className="text-gray-400 text-sm" />
                <span>{paymentDate}</span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-center gap-1 font-medium text-gray-800">
                <FaRupeeSign className="text-gray-500 text-xs" />
                <span>{p.amount}</span>
              </div>

              {/* Month-Year */}
              <div className="text-center text-gray-600">
                {monthName} {p.payment_year}
              </div>

              {/* Status */}
              <div className="flex justify-end">
                <span
                  className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide font-semibold ${
                    isAdvance
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {isAdvance ? "Advance" : "Paid"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
