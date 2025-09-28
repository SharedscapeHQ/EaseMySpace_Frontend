import { useEffect, useState } from "react";
import { getAllWithdrawals, updateWithdrawal } from "../../api/referApi"; 
import { FiDownload } from "react-icons/fi";

export default function WithdrawalRequests() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
  try {
    setLoading(true);
    const res = await getAllWithdrawals();

    if (res.data.success) {
      setWithdrawals(res.data.withdrawals);
    } else {
      console.warn("⚠️ Backend error:", res.data.message);
    }
  } catch (err) {
    console.error("❌ Failed to fetch withdrawals:", err.response?.data || err);
  } finally {
    setLoading(false);
  }
};


  const handleAction = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this as ${status}?`)) return;
    try {
      const res = await updateWithdrawal(id, status);
if (res.data.success) {
  alert("✅ Withdrawal updated!");
  fetchWithdrawals();
} else {
  alert("❌ " + res.data.message);
}
    } catch (err) {
      console.error("Failed to update withdrawal:", err);
    }
  };

  if (loading) return <p>Loading withdrawals...</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2
        className="text-xl font-semibold mb-4 flex items-center gap-2"
        style={{ fontFamily: "heading_font" }}
      >
        <FiDownload className="text-blue-600" />
        Withdrawal Requests
      </h2>

      {withdrawals.length === 0 ? (
        <p className="text-gray-500 text-sm">No withdrawal requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Method</th>
                <th className="p-2 text-left">Details</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Requested At</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
  {withdrawals.map((w) => (
    <tr key={w.id} className="border-t">
      <td className="p-2 font-medium">
        {w.user.firstName} {w.user.lastName}
      </td>
      <td className="p-2">{w.user.email}</td>
      <td className="p-2">{w.user.phone}</td>
      <td className="p-2 capitalize">{w.method}</td>
      <td className="p-2">
        {w.method === "upi"
          ? w.paymentDetails?.upi_id
          : `${w.paymentDetails?.account || ""} (${w.paymentDetails?.ifsc || ""})`}
      </td>
      <td className="p-2 font-semibold">₹{w.amount}</td>
      <td
        className={`p-2 font-medium ${
          w.status === "approved"
            ? "text-green-600"
            : w.status === "rejected"
            ? "text-red-600"
            : "text-yellow-600"
        }`}
      >
        {w.status}
      </td>
      <td className="p-2">
        {new Date(w.created_at).toLocaleString()}
      </td>
      <td className="p-2 flex gap-2">
        {w.status === "pending" && (
          <>
            <button
              onClick={() => handleAction(w.id, "approved")}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction(w.id, "rejected")}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs"
            >
              Reject
            </button>
          </>
        )}
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
}
