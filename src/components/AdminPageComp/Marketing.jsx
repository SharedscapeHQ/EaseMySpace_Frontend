import React, { useState, useEffect } from "react";
import { sendWhatsAppMessages, fetchWhatsAppLogs } from "../../api/marketingApi";
import messagePreview from "/marketing/refer_earn.jpg";

export default function Marketing() {
  const [inputValue, setInputValue] = useState("");
  const [numbers, setNumbers] = useState([]);
  const [invalidNumbers, setInvalidNumbers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loadingWhatsApp, setLoadingWhatsApp] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Fetch logs
  const getLogs = async () => {
    try {
      const res = await fetchWhatsAppLogs();
      setLogs(res.slice(0, 10));
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  useEffect(() => {
    getLogs();
  }, []);

  // Handle typing numbers
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.includes(",")) {
      const parts = value.split(",").map((p) => p.trim());
      const newValid = [];
      const newInvalid = [];

      parts.forEach((num) => {
        if (/^\d{10}$/.test(num)) {
          const formatted = `+91${num}`;
          if (!numbers.includes(formatted)) newValid.push(formatted);
        } else if (num) {
          newInvalid.push(num);
        }
      });

      setNumbers((prev) => [...prev, ...newValid]);
      setInvalidNumbers((prev) => [...prev, ...newInvalid]);
      setInputValue("");
    } else {
      setInputValue(value);
    }
  };

  const removeNumber = (num) => {
    setNumbers(numbers.filter((n) => n !== num));
  };

  // Send WhatsApp
  const handleSendWhatsApp = async () => {
    if (numbers.length === 0) return alert("Please add at least one valid number.");

    try {
      setLoadingWhatsApp(true);

      const res = await sendWhatsAppMessages(numbers);

      const sentNumbers = res.results
        .filter((r) => r.status === "sent")
        .map((r) => r.number)
        .join(", ");
      const skippedNumbers = res.results
        .filter((r) => r.status === "skipped")
        .map((r) => r.number)
        .join(", ");
      const failedNumbers = res.results
        .filter((r) => r.status === "failed")
        .map((r) => r.number)
        .join(", ");

      let popupText = "";
      if (sentNumbers) popupText += `✅ Sent: ${sentNumbers}\n`;
      if (skippedNumbers) popupText += `⏭ Skipped: ${skippedNumbers}\n`;
      if (failedNumbers) popupText += `❌ Failed: ${failedNumbers}`;
      if (invalidNumbers.length > 0)
        popupText += `\n⚠️ Invalid input skipped: ${invalidNumbers.join(", ")}`;

      setPopupMessage(popupText.trim());
      setShowPopup(true);
      setNumbers([]);
      setInvalidNumbers([]);
      getLogs();
    } catch (err) {
      console.error("❌ WhatsApp send error:", err);
      setPopupMessage("Failed to send WhatsApp message.");
      setShowPopup(true);
    } finally {
      setLoadingWhatsApp(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-indigo-700">📢 Marketing Panel</h2>

      <div className="bg-white rounded-xl shadow-md p-6 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Send WhatsApp</h3>

        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Left column */}
          <div className="md:w-1/2 flex flex-col space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {numbers.map((num) => (
                <span
                  key={num}
                  className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {num.slice(-10)}
                  <button
                    onClick={() => removeNumber(num)}
                    className="ml-2 font-bold hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

           <input
  type="text"
  placeholder="Type a 10-digit number and press comma"
  value={inputValue}
  onChange={(e) => {
    // Keep only digits
    const digitsOnly = e.target.value.replace(/\D/g, "");
    // If comma typed or 10 digits reached, create block
    if (digitsOnly.length >= 10 || e.target.value.includes(",")) {
      const parts = digitsOnly.split(",").map((p) => p.trim());
      const newValid = [];
      const newInvalid = [];

      parts.forEach((num) => {
        if (/^\d{10}$/.test(num)) {
          const formatted = `+91${num}`;
          if (!numbers.includes(formatted)) newValid.push(formatted);
        } else if (num) {
          newInvalid.push(num);
        }
      });

      setNumbers((prev) => [...prev, ...newValid]);
      setInvalidNumbers((prev) => [...prev, ...newInvalid]);
      setInputValue(""); // reset input
    } else {
      setInputValue(digitsOnly);
    }
  }}
  className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
/>


            {invalidNumbers.length > 0 && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
                ⚠️ Invalid input skipped: {invalidNumbers.join(", ")}
              </div>
            )}

            <button
              onClick={handleSendWhatsApp}
              disabled={loadingWhatsApp}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              {loadingWhatsApp ? "Sending..." : "Send WhatsApp"}
            </button>

            {/* Logs */}
            <div className="mt-4 border rounded-md p-2 bg-gray-50">
              <h4 className="font-semibold text-gray-700 mb-2">Message History</h4>
              {logs.length === 0 ? (
                <p className="text-gray-500 text-sm">No logs yet.</p>
              ) : (
                <ul className="text-sm text-gray-800 space-y-1 max-h-44 overflow-y-auto">
                  {logs.map((log, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between px-2 py-1 border-b last:border-b-0 items-center"
                    >
                      <span className="font-mono">{log.number.slice(-10)}</span>
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

          {/* Right column */}
          <div className="md:w-1/2 flex flex-col items-center mt-6 md:mt-0">
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

        {/* Popup */}
        {showPopup && (
          <div className="fixed top-20 right-5 bg-indigo-600 text-white p-4 rounded-md shadow-lg flex flex-col space-y-1 z-50">
            {popupMessage.split("\n").map((line, idx) => (
              <span key={idx}>{line}</span>
            ))}
            <button
              onClick={() => setShowPopup(false)}
              className="bg-white text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center font-bold self-end mt-1 hover:bg-gray-200"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
