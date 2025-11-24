import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const SOCKET_URL = "https://api.easemyspace.in/";
const socket = io(SOCKET_URL, { autoConnect: false });

export default function ChatBox({ recipientOwnerCode, recipientName, propertyId, disabled = false, onLockedAction }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recipientId, setRecipientId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesContainerRef = useRef(null);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = loggedInUser?.id;

  // Scroll to bottom
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };
  useEffect(scrollToBottom, [messages]);

  // Initialize recipientId and chat history
  useEffect(() => {
    async function initChat() {
      try {
        const { data } = await axios.get(`${SOCKET_URL}resolve-user/${recipientOwnerCode}`);
        setRecipientId(data.id);

        if (data.id) {
          const history = await axios.get(`${SOCKET_URL}chat/${loggedInUserId}/${data.id}/${propertyId || "null"}`);
          setMessages(
            history.data.map((msg) => ({
              ...msg,
              created_at: msg.created_at ? new Date(msg.created_at) : new Date(),
            }))
          );
        }
      } catch (err) {
        console.error("Chat init error:", err);
      }
    }
    initChat();
  }, [recipientOwnerCode, propertyId, loggedInUserId]);

  // Socket connection & listeners
  useEffect(() => {
    if (!recipientId) return; // wait for recipientId

    socket.connect();
    socket.emit("user_online", loggedInUserId);

    // Listen for online users
    socket.on("user_status", ({ userId, online }) => {
      setOnlineUsers(prev => {
        if (online) {
          if (!prev.includes(userId)) return [...prev, userId];
          return prev;
        } else {
          return prev.filter((id) => id !== userId);
        }
      });
    });

    // Listen for incoming messages
    socket.on("receive_message", (msg) => {
      if (
        (msg.sender_id === recipientId && msg.receiver_id === loggedInUserId) ||
        (msg.sender_id === loggedInUserId && msg.receiver_id === recipientId)
      ) {
        setMessages(prev => [
          ...prev,
          { ...msg, created_at: msg.created_at ? new Date(msg.created_at) : new Date() },
        ]);
      }
    });

    // Listen for confirmation of sent messages
    socket.on("message_sent", (msg) => {
      setMessages(prev => {
        if (msg.tempId && prev.some(m => m.tempId === msg.tempId)) return prev;
        return [...prev, { ...msg, created_at: msg.created_at ? new Date(msg.created_at) : new Date() }];
      });
    });

    return () => {
      socket.off("user_status");
      socket.off("receive_message");
      socket.off("message_sent");
      // Do not disconnect socket here
    };
  }, [recipientId, loggedInUserId]);

  const sendMessage = () => {
    if (!message.trim() || !recipientOwnerCode || !recipientId) return;

    const tempId = Date.now();
    const payload = {
      sender_id: loggedInUserId,
      recipientOwnerCode,
      message,
      propertyId,
      tempId,
    };

    setMessages(prev => [...prev, { ...payload, created_at: new Date() }]);
    socket.emit("send_message", payload);
    setMessage("");
  };

  return (
    <div className="flex absolute flex-col w-full max-w-xs h-[70vh] sm:h-[350px] border rounded shadow bg-white z-30">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t">
        <span className="font-medium">Chat with {recipientName}</span>
        <span className="flex items-center gap-1 text-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${onlineUsers.includes(recipientId) ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          <span>{onlineUsers.includes(recipientId) ? "Online" : "Offline"}</span>
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50 flex flex-col gap-2" ref={messagesContainerRef}>
        {messages.map((msg, idx) => {
          const isMine = Number(msg.sender_id) === Number(loggedInUserId);
          return (
            <div key={msg.id || msg.tempId || idx} className={`relative px-3 py-2 max-w-[75%] text-sm shadow-sm break-words ${isMine ? "self-end bg-blue-500 text-white rounded-2xl rounded-br-none" : "self-start bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none"}`}>
              <div className="whitespace-pre-wrap">{msg.message}</div>
              <div className={`text-[10px] mt-1 ${isMine ? "text-zinc-200 text-right" : "text-zinc-700 text-right"}`}>
                {msg.created_at && new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-2 border-t bg-white">
        <input
          type="text"
          className={`flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300 ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => {
            if (disabled) {
              if (onLockedAction) onLockedAction();
              e.preventDefault();
            } else if (e.key === "Enter") sendMessage();
          }}
          placeholder={disabled ? "Unlock contact to chat" : "Type a message..."}
          disabled={disabled}
        />
        <button
          onClick={() => {
            if (disabled) {
              if (onLockedAction) onLockedAction();
              return;
            }
            sendMessage();
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium ${disabled ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          disabled={disabled}
        >
          Send
        </button>
      </div>
    </div>
  );
}
