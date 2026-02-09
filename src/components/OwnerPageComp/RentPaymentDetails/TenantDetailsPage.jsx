import { FiArrowLeftCircle, FiUsers, FiCalendar, FiPhone, FiMail, FiHome } from "react-icons/fi";

export default function TenantDetailsPage({ tenants, property, onBack }) {
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
      >
        <FiArrowLeftCircle size={22} /> Back to Owner
      </button>

      {/* Header */}
      <h2 style={{ fontFamily: "para_font" }} className="text-2xl  text-indigo-700 flex items-center gap-2 mb-6">
        <FiUsers /> Tenants of {property?.title || "-"}
      </h2>

      {tenants.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No tenants found for this property.</p>
      ) : (
        <div className="space-y-6">
          {tenants.map((t) => (
            <div
              key={t.tenant?.id || t.payment?.id}
              className="border border-gray-200 rounded-2xl shadow-sm p-6 bg-white hover:shadow-md transition"
            >
              {/* Header: Room + Status */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl  text-gray-800 flex items-center gap-2">
                  <FiHome /> {t.room_label || "Room"} ({t.occupancy || "—"})
                </h3>
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    t.payment?.status !== "paid"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {t.payment?.status || "N/A"}
                </span>
              </div>

              {/* Tenant Info */}
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700 mb-4">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Tenant:</span>
                  <p>{t.name || "-"}</p>
                  <span className="font-medium mt-2">Phone:</span>
                  <p>{t.phone || "—"}</p>
                  <span className="font-medium mt-2">Email:</span>
                  <p>{t.email || "-"}</p>
                </div>

                {/* Payment Summary */}
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Rent Amount:</span>
                  <p className="text-lg  text-indigo-700">₹{t.payment?.amount || 0}</p>
                  <span className="font-medium">Deposit:</span>
                  <p className="text-lg  text-indigo-700">₹{t.payment?.deposit || 0}</p>
                  <span className="font-medium">Last Payment:</span>
                  <p>{formatDate(t.payment?.paid_on)}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-medium">Next Due Date:</span>
                  <p
                    className={`${
                      t.payment?.next_due_date && new Date(t.payment.next_due_date) < new Date()
                        ? "text-red-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {formatDate(t.payment?.next_due_date)}
                  </p>
                </div>
              </div>

              {/* Optional: Payment History */}
              {t.payment && (
                <details className="text-sm text-gray-600">
                  <summary className="cursor-pointer">View Payment Details</summary>
                  <ul className="mt-2 space-y-1">
                    <li>
                      Paid On: {formatDate(t.payment?.paid_on)} — ₹{t.payment?.amount}{" "}
                      {t.payment?.deposit ? `(Deposit: ₹${t.payment.deposit})` : ""} — {t.payment?.status}
                    </li>
                  </ul>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
