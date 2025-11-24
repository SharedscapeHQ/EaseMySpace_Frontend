export default function WithdrawalPopup({ showPopup, setShowPopup }) {
  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-sm w-full">
        <h2 className="text-xl font-semibold text-green-700 mb-2">
          Withdrawal Request Sent
        </h2>
        <p className="text-gray-600 mb-4">
          Your request is pending admin approval.
        </p>
        <button
          onClick={() => setShowPopup(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          OK
        </button>
      </div>
    </div>
  );
}
