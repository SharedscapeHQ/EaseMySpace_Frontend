import axios from "axios";

const chatAxios = axios.create({
  baseURL: "http://localhost:3000/api/chat",
  headers: { "Content-Type": "application/json" },
});

export const sendMessageToBot = async (message) => {
  if (!message) throw new Error("Message is required");
  const res = await chatAxios.post("/", { message });
  return res.data.reply;
};
