import axios from "axios";

const api = axios.create({
  baseURL: "https://api.easemyspace.in/api/payment",
  withCredentials: true,
  timeout: 20000,
});

export const createOrder = async ({ amount, planName }) => {
  try {
    const res = await api.post("/create-order", { amount, planName });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to create order:", err.response?.data || err.message);
    throw err;
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const res = await api.post("/verify", paymentData, { timeout: 60000 });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to verify payment:", err.response?.data || err.message);
    throw err;
  }
};
