import { useEffect, useState } from "react";
import { getAllWithdrawalRequests, approveWithdrawalRequest } from "../../api/Maid_api/maidAdminApi";
import { FiDownload } from "react-icons/fi";

export default function WithdrawalRequestsAgent() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await getAllWithdrawalRequests();
      setWithdrawals(res || []); 
    } catch (err) {
      console.error("❌ Failed to fetch withdrawals:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this withdrawal?")) return;
    try {
      await approveWithdrawalRequest(id);
      alert("✅ Withdrawal approved!");
      fetchWithdrawals(); // refresh list
    } catch (err) {
      console.error("❌ Failed to approve withdrawal:", err.response?.data || err);
      alert("Failed to approve withdrawal.");
    }
  };

  if (loading) return <p>Loading withdrawals...</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 style={{ fontFamily: "para_font" }} className="text-xl  mb-4 flex items-center gap-2">
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
                  <td className="p-2 font-medium">{w.name}</td>
                  <td className="p-2">{w.email}</td>
                  <td className="p-2">{w.phone}</td>
                  <td className="p-2 capitalize">{w.method}</td>
                  <td className="p-2">
                    {w.method === "upi"
                      ? w.details?.upi
                      : `${w.details?.account || ""} (${w.details?.ifsc || ""})`}
                  </td>
                  <td className="p-2 ">₹{w.amount}</td>
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
                  <td className="p-2">{new Date(w.created_at).toLocaleString()}</td>
                  <td className="p-2 flex gap-2">
                    {w.status === "pending" && (
                      <button
                        onClick={() => handleApprove(w.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs"
                      >
                        Approve
                      </button>
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
