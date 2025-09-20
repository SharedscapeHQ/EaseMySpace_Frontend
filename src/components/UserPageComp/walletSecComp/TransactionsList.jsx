import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";

export default function RecentTransactions({ transactions }) {
  const typeLabels = {
    signup: "Signup Bonus",
    purchase: "Subscription Purchase",
    property_approval: "Property Approval Reward",
    withdrawal: "Withdrawal",
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 h-full">
      <h2
        className="text-xl font-semibold mb-4 flex items-center gap-2"
        style={{ fontFamily: "heading_font" }}
      >
        <FiTrendingUp className="text-blue-600" />
        Recent Transactions
      </h2>

      {(!transactions || transactions.length === 0) ? (
        <p className="text-gray-500 text-sm">No transactions yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {transactions.slice(0, 5).map((txn) => {
            const displayType = typeLabels[txn.type] || txn.type;
            const isCredit = txn.direction === "credit";
            const sign = isCredit ? "+" : "-";
            const color = isCredit ? "text-green-600" : "text-red-600";
            const icon = isCredit ? <FaArrowUp /> : <FaArrowDown />;

            return (
              <li
                key={txn.id}
                className="py-3 flex justify-between items-center text-sm"
              >
                <div>
                  <p className="font-medium text-gray-800 capitalize flex items-center gap-2">
                    {icon} {displayType}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(txn.created_at).toLocaleString()}
                  </p>
                </div>
                <span className={`font-semibold ${color}`}>
                  {sign}₹{txn.amount}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
