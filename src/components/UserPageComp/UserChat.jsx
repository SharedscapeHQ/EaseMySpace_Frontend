import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const SOCKET_URL = "https://api.easemyspace.in/";
const socket = io(SOCKET_URL, { autoConnect: false });

export default function OwnerChats() {
  const [conversations, setConversations] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const scrollRefs = useRef({});
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = Number(user?.id);
  const ownerCode = user?.owner_code;
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    const handleUserStatus = ({ userId, online }) => {
      setOnlineUsers((prev) => ({ ...prev, [Number(userId)]: online }));
    };

    socket.on("user_status", handleUserStatus);

    return () => {
      socket.off("user_status", handleUserStatus);
    };
  }, []);

  useEffect(() => {
    if (!userId || !ownerCode) {
      console.error("❌ Missing userId or owner_code.");
      return;
    }

    async function initChats() {
      try {
        const { data: messages } = await axios.get(
          `${SOCKET_URL}chats/owner/${ownerCode}/all`
        );

        const grouped = {};
        messages.forEach((msg) => {
          if (msg.sender_id === userId && msg.receiver_id === userId) return;

          const otherId =
            msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

          if (!grouped[otherId]) grouped[otherId] = [];
          grouped[otherId].push({
            ...msg,
            created_at: msg.created_at || new Date().toISOString(),
          });
        });

        Object.keys(grouped).forEach((key) => {
          grouped[key].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
        });

        setConversations(grouped);
      } catch (err) {
        console.error("❌ Failed to fetch chats:", err);
      }

      if (!socket.connected) {
        socket.connect();
        socket.emit("user_online", userId);
      }
    }

    initChats();

    const handleReceive = (msg) => {
      const otherId =
        msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

      setConversations((prev) => {
        const updated = { ...prev };
        if (!updated[otherId]) updated[otherId] = [];

        const existingIndex = updated[otherId].findIndex(
          (m) =>
            (m.tempId && msg.tempId && m.tempId === msg.tempId) ||
            (msg.id && m.id === msg.id)
        );

        if (existingIndex !== -1) {
          updated[otherId][existingIndex] = {
            ...msg,
            created_at: msg.created_at || new Date().toISOString(),
          };
        } else {
          updated[otherId].push({
            ...msg,
            created_at: msg.created_at || new Date().toISOString(),
          });
        }

        return updated;
      });

      setTimeout(
        () =>
          scrollRefs.current[otherId]?.scrollIntoView({ behavior: "smooth" }),
        50
      );
    };

    const handleSent = (msg) => {
      "✅ handleSent confirmed message:", msg;

      const otherId =
        msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

      setConversations((prev) => {
        const updated = { ...prev };
        if (!updated[otherId]) updated[otherId] = [];

        const existingIndex = updated[otherId].findIndex(
          (m) =>
            (m.tempId && msg.tempId && m.tempId === msg.tempId) ||
            (msg.id && m.id === msg.id)
        );

        if (existingIndex !== -1) {
          updated[otherId][existingIndex] = {
            ...msg,
            created_at: msg.created_at || new Date().toISOString(),
          };
        } else {
          updated[otherId].push({
            ...msg,
            created_at: msg.created_at || new Date().toISOString(),
          });
        }

        return updated;
      });

      setTimeout(
        () =>
          scrollRefs.current[otherId]?.scrollIntoView({ behavior: "smooth" }),
        50
      );
    };

    socket.off("receive_message").on("receive_message", handleReceive);
    socket.off("message_sent").on("message_sent", handleSent);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("message_sent", handleSent);
    };
  }, [userId, ownerCode]);

  const handleReplyChange = (otherId, value) =>
    setReplyInputs((prev) => ({ ...prev, [otherId]: value }));

  const sendReply = (otherId) => {
    const text = replyInputs[otherId]?.trim();
    if (!text) return;

    const conversation = conversations[otherId];
    const propertyId = conversation?.[0]?.property_id || null;

    const tempId = Date.now();

    const otherUser =
      conversation.find((msg) => Number(msg.sender_id) !== userId) || {};
    const recipientOwnerCode =
      otherUser.sender_owner_code || otherUser.receiver_owner_code;

    const payload = {
      sender_id: userId,
      recipientOwnerCode,
      message: text,
      propertyId,
      tempId,
    };


    socket.emit("send_message", payload);

    setConversations((prev) => {
      const updated = { ...prev };
      if (!updated[otherId]) updated[otherId] = [];

      if (!updated[otherId].some((m) => m.tempId === tempId)) {
        updated[otherId].push({
          ...payload,
          created_at: new Date(),
        });
      }

      return updated;
    });

    setReplyInputs((prev) => ({ ...prev, [otherId]: "" }));
    setTimeout(
      () => scrollRefs.current[otherId]?.scrollIntoView({ behavior: "smooth" }),
      50
    );
  };

  return (
    <div className="p-4">
      <h2 style={{ fontFamily: "para_font" }} className="text-xl font-bold mb-4">
        Chats for {user?.firstName || "Owner"}
      </h2>
      {!conversations || Object.keys(conversations).length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        Object.keys(conversations).map((otherId) => {
          const conv = conversations[otherId];
          const otherUser =
            conv.find((msg) => Number(msg.sender_id) !== userId) || {};

          const senderName = otherUser.sender_first_name
            ? `${otherUser.sender_first_name} ${
                otherUser.sender_last_name || ""
              }`
            : `User ${otherId}`;

          return (
            <div key={otherId} className="mb-6 border rounded p-2 bg-gray-100">
              <h3 className="font-semibold mb-2">
                Chat with {senderName}{" "}
                <span
                  className={`ml-2 text-xs font-medium ${
                    onlineUsers[otherId] ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {onlineUsers[otherId] ? "Online" : "Offline"}
                </span>
              </h3>

              <div className="space-y-2 max-h-80 overflow-y-auto flex flex-col">
                {conv.map((msg, idx) => {
                  const isMine = Number(msg.sender_id) === userId;
                  const isLast = idx === conv.length - 1;
                  return (
                    <div
                      key={msg.id ? `srv-${msg.id}` : `tmp-${msg.tempId}`}
                      className={`p-2 rounded max-w-xs break-words ${
                        isMine
                          ? "bg-blue-200 self-end ml-auto text-right"
                          : "bg-gray-200 self-start"
                      }`}
                      ref={(el) =>
                        isLast ? (scrollRefs.current[otherId] = el) : null
                      }
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {msg.created_at &&
                          new Date(msg.created_at).toISOString().slice(11, 16)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="flex mt-2">
                <input
                  type="text"
                  value={replyInputs[otherId] || ""}
                  onChange={(e) => handleReplyChange(otherId, e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 border rounded px-2 py-1"
                  onKeyDown={(e) => e.key === "Enter" && sendReply(otherId)}
                />
                <button
                  onClick={() => sendReply(otherId)}
                  className="ml-2 bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Send
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
