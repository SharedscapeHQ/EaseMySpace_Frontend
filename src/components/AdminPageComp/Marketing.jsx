import React, { useState } from "react";
import { sendWhatsAppMessages, sendSmsMessages } from "../../api/marketingApi";

export default function Marketing() {
  const [numbers, setNumbers] = useState("");
  const [smsNumbers, setSmsNumbers] = useState("");
  const [response, setResponse] = useState(null);

  const [loadingWhatsApp, setLoadingWhatsApp] = useState(false);
  const [loadingSms, setLoadingSms] = useState(false);

  // ✅ Helper: format numbers (add +91 if just 10 digits)
  const formatNumbers = (raw) => {
    return raw
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num !== "")
      .map((num) => (/^\d{10}$/.test(num) ? `+91${num}` : num));
  };

  // ✅ Send WhatsApp
 const handleSendWhatsApp = async () => {
  const numberArray = formatNumbers(numbers);
  if (numberArray.length === 0) {
    return alert("Please enter at least one valid number.");
  }

  try {
    console.log("📩 Sending WhatsApp to:", numberArray);

    setLoadingWhatsApp(true);
    setResponse(null);

    const res = await sendWhatsAppMessages(numberArray);

    console.log("✅ Response from API:", res);
    setResponse(res);
  } catch (err) {
    console.error("❌ WhatsApp send error:", err);

    if (err.response) {
      console.error("Server response:", err.response.data);
      setResponse({ error: err.response.data });
    } else {
      setResponse({ error: err.message });
    }
  } finally {
    setLoadingWhatsApp(false);
  }
};


  // ✅ Send SMS
  const handleSendSms = async () => {
    const numberArray = formatNumbers(smsNumbers);
    if (numberArray.length === 0) {
      return alert("Please enter at least one valid number.");
    }

    try {
      setLoadingSms(true);
      setResponse(null);

      const res = await sendSmsMessages(numberArray);
      setResponse(res);
    } catch (err) {
      console.error(err);
      setResponse({ error: err.response?.data || "Something went wrong" });
    } finally {
      setLoadingSms(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-indigo-700">📢 Marketing Panel</h2>

      {/* WhatsApp Section */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border">
        <h3 className="text-lg font-semibold text-gray-800">Send WhatsApp</h3>
        <textarea
          className="w-full border rounded-md p-3"
          rows="3"
          placeholder="9876543210, 9123456789"
          value={numbers}
          onChange={(e) => setNumbers(e.target.value)}
        />
        <button
          onClick={handleSendWhatsApp}
          disabled={loadingWhatsApp}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          {loadingWhatsApp ? "Sending..." : "Send WhatsApp"}
        </button>
      </div>

      {/* SMS Section */}
      {/* <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border">
        <h3 className="text-lg font-semibold text-gray-800">Send SMS</h3>
        <textarea
          className="w-full border rounded-md p-3"
          rows="3"
          placeholder="9876543210, 9123456789"
          value={smsNumbers}
          onChange={(e) => setSmsNumbers(e.target.value)}
        />
        <button
          onClick={handleSendSms}
          disabled={loadingSms}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loadingSms ? "Sending..." : "Send SMS"}
        </button>
      </div> */}

     
    </div>
  );
}
