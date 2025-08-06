import axios from "axios";

const BASE_URL = "https://api.easemyspace.in/api/payment";

// 1. Create Razorpay Order
export const createOrder = async ({amount, planName}) => {
  try {

    const res = await axios.post(
      `${BASE_URL}/create-order`,
      { amount, planName },
      { timeout: 10000 }
    );

    return res.data;
  } catch (err) {
    console.error("❌ Failed to create order:", err.response?.data || err.message);
    throw err;
  }
};

// 2. Verify Razorpay Payment
export const verifyPayment = async (paymentData) => {
  try {
    console.log("🔁 Verifying payment with data:", paymentData);
    const res = await axios.post(`${BASE_URL}/verify`, paymentData, { timeout: 10000 });
    console.log("✅ Payment verified successfully:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to verify payment:", err.message);
    throw err;
  }
};
