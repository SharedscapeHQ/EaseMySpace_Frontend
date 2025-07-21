import axios from "axios";

const BASE_URL = "https://api.easemyspace.in/api/payment";

// 1. Create Razorpay Order
export const createOrder = async (amount) => {
  try {
    const res = await axios.post(`${BASE_URL}/create-order`, { amount });
    return res.data;
  } catch (err) {
    console.error("Failed to create order:", err.message);
    throw err;
  }
};

// 2. Verify Razorpay Payment
export const verifyPayment = async (paymentData) => {
  try {
    const res = await axios.post(`${BASE_URL}/verify`, paymentData);
    return res.data;
  } catch (err) {
    console.error("Failed to verify payment:", err.message);
    throw err;
  }
};
