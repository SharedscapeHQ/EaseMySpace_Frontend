import { AnimatePresence, motion } from "framer-motion";
import { FaGooglePay, FaUniversity, FaWallet, FaArrowDown } from "react-icons/fa";

export default function WithdrawalMethods({
  balance,
  selected,
  setSelected,
  account,
  setAccount,
  ifsc,
  setIfsc,
  upi,
  setUpi,
  amount,
  setAmount,
  onConfirm,
  withdrawing
}) {
  const methods = [
    {
      id: "upi",
      label: "UPI",
      desc: "Google Pay, PhonePe, Paytm",
      icon: <FaGooglePay className="text-indigo-600 text-2xl" />,
      inputPlaceholder: "Enter your UPI ID (e.g. name@upi)"
    },
    {
      id: "bank",
      label: "Bank Account",
      desc: "NEFT / IMPS / RTGS",
      icon: <FaUniversity className="text-green-600 text-2xl" />,
      inputPlaceholder: "Enter your Bank Account Number"
    },
    {
      id: "wallet",
      label: "Other Wallets",
      desc: "Coming Soon",
      icon: <FaWallet className="text-gray-400 text-2xl" />,
      inputPlaceholder: "",
      disabled: true
    }
  ];

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) setAmount(value);
    else setAmount("");
  };

  const canConfirm =
    !withdrawing &&
    amount >= 500 &&
    amount <= balance &&
    selected &&
    ((selected === "upi" && upi.includes("@")) || (selected === "bank" && account && ifsc));

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h2 style={{ fontFamily: "para_font" }} className="text-xl  mb-4">Withdrawal Methods</h2>
      <ul className="space-y-4">
        {methods.map((method) => (
          <li
            key={method.id}
            onClick={() => !method.disabled && setSelected(method.id)}
            className={`p-4 border rounded-xl flex items-center gap-4 cursor-pointer transition ${
              method.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            } ${selected === method.id ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}`}
          >
            {method.icon}
            <div>
              <p className="font-medium">{method.label}</p>
              <p className="text-sm text-gray-500">{method.desc}</p>
            </div>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="mt-5 space-y-4">
          {selected === "bank" ? (
            <div className="space-y-3">
              <input
                type="text"
                value={account}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, ""); // only digits
                  setAccount(cleaned);
                }}
                placeholder="Enter your Bank Account Number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                placeholder="Enter IFSC Code"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ) : (
           <input
  type="text"
  value={upi}
  onChange={(e) => {
    const cleaned = e.target.value.replace(/\s/g, "");
    setUpi(cleaned);
  }}
  placeholder={methods.find((m) => m.id === selected)?.inputPlaceholder}
  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>

          )}

          <input
            type="number"
            min="1"
            max={balance}
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount to withdraw"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Warning message for bank withdrawals */}
          {amount < 500 && amount !== "" && (
  <p className="text-red-600 text-sm">Minimum withdrawal amount is ₹500</p>
)}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onConfirm({ selected, amount, upi, account, ifsc })}
            disabled={!canConfirm}
            className={`mt-2 px-5 py-2 rounded-lg text-white flex items-center gap-2 justify-center ${
              canConfirm ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-400 cursor-not-allowed"
            }`}
          >
            <FaArrowDown /> {withdrawing ? "Processing…" : "Confirm Withdrawal"}
          </motion.button>
        </div>
      )}
    </div>
  );
}
