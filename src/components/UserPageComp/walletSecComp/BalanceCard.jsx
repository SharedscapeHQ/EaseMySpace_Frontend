import { FaRupeeSign, FaArrowDown } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { motion } from "framer-motion";

export default function BalanceCard({
  balance,
  onWithdrawClick,
  onDownloadStatement,
  downloading,
}) {
  return (
    <div className="shadow-lg rounded-2xl p-6 bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Side: Balance */}
        <div>
          <p className="text-gray-500 text-sm">Wallet Balance</p>
          <h1
            className="text-4xl font-extrabold text-gray-900 flex items-center gap-2"
            style={{ fontFamily: "para_font" }}
          >
            <FaRupeeSign /> {balance}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Minimum withdrawal: <span className="">₹500</span>
          </p>
        </div>

        {/* Right Side: Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onWithdrawClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2 font-medium hover:bg-blue-700 transition-all"
          >
            <FaArrowDown /> Withdraw
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDownloadStatement}
            disabled={downloading}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all ${
              downloading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gray-700 hover:bg-gray-800 text-white"
            }`}
          >
            <FiDownload className="text-lg" />
            {downloading ? "Downloading…" : "Download Statement"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
