// components/SendSMSForm.jsx
import { useState } from "react";
import { sendSMS } from "../../api/adminApi";
import { toast } from "react-hot-toast";

export default function SendSMSForm() {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (recipient.length !== 10) {
      toast.error("Please enter a valid 10-digit number");
      return;
    }
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await sendSMS(recipient, message);
      toast.success("SMS sent successfully!");
      setRecipient("");
      setMessage("");
    } catch (err) {
      console.error("Failed to send SMS:", err.response?.data || err.message);
      toast.error("❌ Failed to send SMS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Send SMS
      </h2>
      <form onSubmit={handleSend} className="space-y-5">
       <div>
  <label className="block mb-1 font-medium text-gray-700">Recipient Number</label>
  <input
    type="text"
    value={recipient}
    onChange={(e) => {
      const onlyNums = e.target.value.replace(/\D/g, ""); // remove non-digits
      setRecipient(onlyNums);
    }}
    placeholder="10-digit number"
    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    maxLength={10}
  />
</div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send SMS"}
        </button>
      </form>
    </div>
  );
}
