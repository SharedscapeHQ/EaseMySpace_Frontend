import React, { useState, useEffect } from "react";
import { sendWhatsAppMessages, fetchWhatsAppLogs } from "../../api/marketingApi";
import messagePreview from "/marketing/refer_earn.jpg";

export default function Marketing() {
  const [numbers, setNumbers] = useState("");
  const [response, setResponse] = useState(null);
  const [loadingWhatsApp, setLoadingWhatsApp] = useState(false);
  const [logs, setLogs] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Format input numbers
  const formatNumbers = (raw) => {
    return raw
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num !== "")
      .map((num) => (/^\d{10}$/.test(num) ? `+91${num}` : num));
  };

  // Fetch logs from backend
  const getLogs = async () => {
    try {
      const res = await fetchWhatsAppLogs();
      setLogs(res.slice(0, 10)); // only latest 10
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  useEffect(() => {
    getLogs();
  }, []);

  // Handle WhatsApp send
  const handleSendWhatsApp = async () => {
    const numberArray = formatNumbers(numbers);
    if (numberArray.length === 0) return alert("Please enter at least one valid number.");

    try {
      setLoadingWhatsApp(true);
      setResponse(null);

      const res = await sendWhatsAppMessages(numberArray);
      setResponse(res);

      const sentNumbers = res.results.filter((r) => r.status === "sent").map((r) => r.number).join(", ");
      const skippedNumbers = res.results.filter((r) => r.status === "skipped").map((r) => r.number).join(", ");
      const failedNumbers = res.results.filter((r) => r.status === "failed").map((r) => r.number).join(", ");

      let popupText = "";
      if (sentNumbers) popupText += `✅ Sent: ${sentNumbers}\n`;
      if (skippedNumbers) popupText += `⏭ Skipped: ${skippedNumbers}\n`;
      if (failedNumbers) popupText += `❌ Failed: ${failedNumbers}`;

      setPopupMessage(popupText.trim());
      setShowPopup(true);
      setNumbers("");
      getLogs(); // refresh logs after sending
    } catch (err) {
      console.error("❌ WhatsApp send error:", err);
      setResponse({ error: err.response?.data || err.message });
      setPopupMessage("Failed to send WhatsApp message.");
      setShowPopup(true);
    } finally {
      setLoadingWhatsApp(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-indigo-700">📢 Marketing Panel</h2>

      {/* WhatsApp Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Send WhatsApp</h3>

        <div className="flex space-x-4">
          {/* Left column: Input + Button */}
          <div className="w-1/2 flex flex-col space-y-4">
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
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              {loadingWhatsApp ? "Sending..." : "Send WhatsApp"}
            </button>

            {/* WhatsApp Logs */}
        <div className="mt-4 border rounded-md p-2 bg-gray-50">
  <h4 className="font-semibold text-gray-700 mb-2">Message history</h4>
  
  {logs.length === 0 ? (
    <p className="text-gray-500 text-sm">No logs yet.</p>
  ) : (
    <ul className="text-sm text-gray-800 space-y-1 max-h-40 overflow-y-auto">
      {logs.map((log, idx) => (
        <li key={idx} className="flex justify-between px-2 py-1 border-b last:border-b-0">
          {/* Show only last 10 digits */}
          <span>{log.number.slice(-10)}</span>
          <span
            className={`font-medium ${
              log.status === "sent"
                ? "text-green-600"
                : log.status === "skipped"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {log.status}
          </span>
        </li>
      ))}
    </ul>
  )}
</div>


          </div>

          {/* Right column: Image preview */}
          <div className="w-1/2 flex flex-col items-center">
            <img
              src={messagePreview}
              alt="Message Preview"
              className="w-64 h-auto object-contain border rounded-md mb-2"
            />
            <span className="text-gray-600 text-sm text-center">
              This is what the user will receive
            </span>
          </div>
        </div>
      </div>

      {/* Popup Notification */}
      {showPopup && (
        <div className="fixed top-20 right-5 bg-indigo-600 text-white p-4 rounded-md shadow-lg flex flex-col space-y-1">
          {popupMessage.split("\n").map((line, idx) => (
            <span key={idx}>{line}</span>
          ))}
          <button
            onClick={() => setShowPopup(false)}
            className="bg-white text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center font-bold self-end mt-1"
          >
            ×
          </button>
        </div>
      )}

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
