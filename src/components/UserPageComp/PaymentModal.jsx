const PaymentModal = ({ property, onClose }) => {
  const rent = Number(property.price || 0);
  const percent = Number(property.listing_fee_percent || 0);

const amount = ((rent * percent) / 100).toFixed(2);

  const handlePayment = () => {
    // 🔥 integrate Razorpay here later
    console.log("Paying:", amount);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
        <h3 className="text-lg mb-4">Complete Listing Payment</h3>

        <p className="text-sm text-gray-600 mb-2">
          You need to pay
        </p>

        <p className="text-2xl font-semibold text-orange-600 mb-2">
          ₹{amount.toLocaleString()}
        </p>

        <p className="text-xs text-gray-500 mb-6">
          ({percent}% of ₹{rent.toLocaleString()})
        </p>

        <button
          onClick={handlePayment}
          className="w-full bg-orange-600 text-white py-2 rounded-lg mb-2"
        >
          Proceed to Pay
        </button>

        <button
          onClick={onClose}
          className="w-full text-gray-500 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;