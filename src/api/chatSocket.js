// chatSocket.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://api.easemyspace.in"; // Your backend URL

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // connect manually after login
});

// Connect user
export const connectUser = (userId) => {
  socket.connect();
  socket.emit("user_online", userId);
};

// Listen for online users
export const onOnlineUsers = (callback) => {
  socket.on("online_users", callback);
};

// Listen for incoming messages
export const onReceiveMessage = (callback) => {
  socket.on("receive_message", callback);
};

// Send message
export const sendMessage = ({ sender_id, recipientOwnerCode, message, propertyId, tempId }) => {
  socket.emit("send_message", { sender_id, recipientOwnerCode, message, propertyId, tempId });
};

// Send message by receiver ID
export const sendMessageById = ({ sender_id, receiver_id, message, propertyId, tempId }) => {
  socket.emit("send_message_by_id", { sender_id, receiver_id, message, propertyId, tempId });
};
