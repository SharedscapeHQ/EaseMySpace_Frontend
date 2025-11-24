import { useState, useEffect } from "react";
import { FiDollarSign } from "react-icons/fi";
import toast from "react-hot-toast";
import { getAllWithdrawals, approveWithdrawal } from "../../api/ownerApi";

export default function LandlordWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      const res = await getAllWithdrawals();
      const data = Array.isArray(res.data) ? res.data : res.data.withdrawals || [];
      setWithdrawals(data);
    } catch (err) {
      toast.error("Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this withdrawal?")) return;

    try {
      await approveWithdrawal(id);
      toast.success("Withdrawal approved!");
      fetchWithdrawals();
    } catch (err) {
      toast.error("Failed to approve withdrawal");
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  if (loading) return <p>Loading rent withdrawals...</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FiDollarSign className="text-green-600" />
        Rent Withdrawals
      </h2>

      {withdrawals.length === 0 ? (
        <p className="text-gray-500 text-sm">No rent withdrawal requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-2 text-left">Landlord</th>
                <th className="p-2 text-left">Email</th>
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
                    {w.landlord_first_name} {w.landlord_last_name}
                  </td>
                  <td className="p-2">{w.landlord_email}</td>
                  <td className="p-2 capitalize">{w.method}</td>
                  <td className="p-2">
                    {w.method === "upi"
                      ? w.details?.upi_id
                      : `${w.details?.account_number || ""} (${w.details?.ifsc || ""})`}
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
