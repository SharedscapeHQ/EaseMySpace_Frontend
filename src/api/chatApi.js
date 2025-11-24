// chatApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.easemyspace.in/api/chat", // Chat endpoints base
  withCredentials: true,
});

export const resolveUserByOwnerCode = async (ownerCode) => {
  try {
    const res = await api.get(`/resolve/${ownerCode}`); // match backend route
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getChatHistory = async (user1, user2, propertyId = null) => {
  try {
    const res = await api.get(`/history/${user1}/${user2}/${propertyId ?? "null"}`);
    return res;
  } catch (err) {
    console.error("❌ Error in getChatHistory:", err.response || err);
    throw err;
  }
};

export const sendChatMessage = async (payload) => {
  try {
    const res = await api.post("/send", payload);
    return res.data;
  } catch (err) {
    console.error("❌ Error in sendChatMessage:", err.response || err);
    throw err;
  }
};