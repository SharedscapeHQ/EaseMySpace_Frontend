import { useState, useRef, useEffect } from "react";
import { getWalletDetails, createWithdrawal } from "../../api/referApi";
import BalanceCard from "./walletSecComp/BalanceCard";
import TransactionsList from "./walletSecComp/TransactionsList";
import PendingWithdrawals from "./walletSecComp/PendingWithdrawals";
import WithdrawalMethods from "./walletSecComp/WithdrawalMethods";
import WithdrawalPopup from "./walletSecComp/WithdrawalPopup";

export default function Wallet() {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upi, setUpi] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [pending, setPending] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const methodsRef = useRef(null);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await getWalletDetails();
      if (res.data.success) {
        const { balance, transactions, pendingWithdrawals } = res.data.data;


        setBalance(balance);
        setTransactions(transactions);
        setPending(pendingWithdrawals || []);
      }
    } catch (err) {
      console.error("Failed to fetch wallet:", err);
    }
  };

  const handleConfirmWithdrawal = async () => {
    if (withdrawing) return;

    setWithdrawing(true);
    try {
     const payload =
  selected === "upi"
    ? { amount: Number(amount), method: "upi", upi_id: upi.trim() }
    : { amount: Number(amount), method: "bank", bank_account: account.trim(), bank_ifsc: ifsc.trim() };



      const res = await createWithdrawal(payload);

      if (res.data.success) {
        setAmount("");
        setUpi("");
        setAccount("");
        setIfsc("");
        setSelected(null);
        setShowPopup(true);
        fetchWallet();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Withdrawal failed:", err);
      alert("Something went wrong!");
    } finally {
      setTimeout(() => setWithdrawing(false), 2000);
    }
  };

  // 🔥 Smooth scroll to WithdrawalMethods
  const scrollToMethods = () => {
    if (methodsRef.current) {
      methodsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <BalanceCard
        balance={balance}
        onWithdrawClick={scrollToMethods} // ✅ pass scroll trigger
        downloading={downloading}
        setDownloading={setDownloading}
        transactions={transactions}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div className="h-full">
    <TransactionsList transactions={transactions} className="h-full" />
  </div>
  <div className="h-full">
    <PendingWithdrawals pending={pending} className="h-full" />
  </div>
</div>


      {/* Withdrawal Methods */}
      <div ref={methodsRef}>
       <WithdrawalMethods
  selected={selected}
  setSelected={setSelected}
  account={account}
  setAccount={setAccount}
  ifsc={ifsc}
  setIfsc={setIfsc}
  upi={upi}
  setUpi={setUpi}
  amount={amount}
  setAmount={setAmount}
  balance={balance}
  withdrawing={withdrawing}
  onConfirm={handleConfirmWithdrawal}
/>

      </div>

      {/* Popup */}
      <WithdrawalPopup showPopup={showPopup} setShowPopup={setShowPopup} />
    </div>
  );
}
