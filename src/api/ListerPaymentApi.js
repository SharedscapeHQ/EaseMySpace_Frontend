import axios from "axios";

const requestAxios = axios.create({
  baseURL: "https://api.easemyspace.in/api/payment/lister",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

export const createListerOrder = async ({ amount, planName }) => {
  try {
    const res = await requestAxios.post("/create-order", {
      amount,
      planName: planName,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to create lister order:", err.response?.data || err.message);
    throw err;
  }
};

export const verifyListerPayment = async (paymentData) => {
  try {
    const res = await requestAxios.post("/verify-payment", paymentData);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to verify lister payment:", err.response?.data || err.message);
    throw err;
  }
};
