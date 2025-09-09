import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4001";
const socket = io(SOCKET_URL);

export default function ChatBox({ userId, recipientId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Emit online status
  useEffect(() => {
    if (userId) socket.emit("user_online", userId);
  }, [userId]);

  // Listen for online users
  useEffect(() => {
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("receive_message", ({ from, message }) => {
      if (from === recipientId) {
        setMessages((prev) => [...prev, { from, message }]);
      }
    });

    return () => {
      socket.off("online_users");
      socket.off("receive_message");
    };
  }, [recipientId]);

  useEffect(() => {
  const container = messagesEndRef.current?.parentNode;
  if (!container) return;

  const isNearBottom =
    container.scrollHeight - container.scrollTop - container.clientHeight < 50;

  if (isNearBottom) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);
  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = { from: userId, to: recipientId, message };
    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, { from: userId, message }]);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="w-full max-w-md border rounded-md p-4 bg-white shadow-md flex flex-col">
    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
  <span
    className={`w-3 h-3 rounded-full ${
      onlineUsers.includes(recipientId)
        ? "bg-green-500 animate-pulse"
        : "bg-red-500 animate-pulse"
    }`}
  ></span>
  <span
    className={`font-medium ${
      onlineUsers.includes(recipientId) ? "text-green-600" : "text-red-600"
    }`}
  >
    {onlineUsers.includes(recipientId) ? "Online" : "Offline"}
  </span>
</div>


      {messages.length > 0 && (
  <div className="flex-1 overflow-y-auto h-64 mb-2 p-2 border rounded bg-gray-50">
    {messages.map((msg, idx) => (
      <div
        key={idx}
        className={`mb-1 p-2 rounded ${
          msg.from === userId ? "bg-blue-100 text-right" : "bg-gray-200 text-left"
        }`}
      >
        {msg.message}
      </div>
    ))}
    <div ref={messagesEndRef}></div>
  </div>
)}


      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
