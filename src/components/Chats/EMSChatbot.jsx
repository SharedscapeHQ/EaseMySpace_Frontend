import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Robust parseImages helper
const parseImages = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    // remove braces if exist
    if (raw.startsWith("{") && raw.endsWith("}")) {
      raw = raw.slice(1, -1);
    }
    return raw
      .split(",")
      .map((s) => s.trim().replace(/^"|"$/g, ""))
      .filter(Boolean);
  }
  return [];
};

export default function EMSChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (msg) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: msg }]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();

      if (Array.isArray(data.properties)) {
        const limitedProps = data.properties.slice(0, 3);
        const propsWithImages = limitedProps.map((p) => ({
          ...p,
          images: parseImages(p.images || p.image || p.img),
        }));

        setMessages((prev) => [
          ...prev,
          { from: "bot", type: "property", properties: propsWithImages },
        ]);
      } else {
        setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, I couldn't reach the chat server." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => sendMessage(inputMessage);
  const handleKeyPress = (e) => e.key === "Enter" && handleSendMessage();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-6 w-96 h-[500px] bg-white shadow-2xl rounded-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
        >
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <span className=" text-lg">EaseMySpace Chat</span>
            <button onClick={onClose} className="text-white text-xl ">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3 scrollbar-thin scrollbar-thumb-gray-300">
            {messages.length === 0 && (
              <div className="text-gray-500 text-center text-sm mt-8">
                👋 Say "Hi" to start chatting!
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.type === "property" ? (
                  <div className="grid grid-cols-1 gap-3 w-full">
                    {msg.properties.map((p) => (
                      <Link
                        to={`/properties/${p.id}`}
                        key={p.id}
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col transition hover:shadow-md"
                      >
                        <div className="relative w-full h-32">
                          {p.images?.length > 0 ? (
                            <img
                              src={p.images[0]}
                              alt={p.location || "Property image"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 italic">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="p-3 flex flex-col gap-1">
                          <h4 className="text-sm  text-gray-800">
                            {p.location || "Unknown"}
                          </h4>
                          <p className="text-xs text-gray-600">
                            ₹{p.price?.toLocaleString() || "-"} / month • Deposit ₹
                            {p.deposit?.toLocaleString() || "-"}
                          </p>
                          <button
                            onClick={() => (window.location.href = `/properties/${p.id}`)}
                            className="mt-2 w-full bg-indigo-600 text-white text-xs py-1.5 rounded-lg hover:bg-indigo-700 transition"
                          >
                            View
                          </button>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="text-left text-gray-500 text-sm">
                EaseMySpace Bot is typing...
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
