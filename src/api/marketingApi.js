import axios from "axios";

// Axios instance for marketing-related APIs
const marketingAxios = axios.create({
  baseURL: "https://api.easemyspace.in/api/marketing",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Send WhatsApp campaign
export const sendWhatsAppMessages = async (numbers) => {
  const res = await marketingAxios.post("/sendwhatsapp", { numbers });
  return res.data;
};


// 🔹 Send SMS campaign
export const sendSmsMessages = async (numbers) => {
  const res = await marketingAxios.post("/sms", {
    numbers,
    
  });
  return res.data;
};

export default marketingAxios;
