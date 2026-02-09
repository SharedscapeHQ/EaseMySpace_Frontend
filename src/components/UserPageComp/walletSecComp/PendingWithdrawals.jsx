export default function PendingWithdrawals({ pending }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 h-full">
      {/* Header */}
      <h3
        className="text-xl font-semibold mb-4 flex items-center gap-2"
        style={{ fontFamily: "universal_font" }}
      >
        Pending Withdrawals
      </h3>

      {/* List */}
      {pending && pending.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {pending.map((req) => (
            <li
              key={req.id}
              className="py-3 flex justify-between items-center text-sm"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {req.method?.toUpperCase()}
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(req.created_at).toLocaleString()}
                </p>
              </div>
              <span className="font-semibold text-gray-800">
                ₹{req.amount}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm text-center py-4">
          No pending withdrawals 🚫
        </p>
      )}
    </div>
  );
}
