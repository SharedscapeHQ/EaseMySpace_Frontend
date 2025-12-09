import axios from "axios";

const api = axios.create({
  baseURL: "https://api.easemyspace.in/api/user/rent",
  withCredentials: true,
  timeout: 20000,
});

// ---------------- Rent Payment ----------------
export const createRentOrder = async ({ amount }) => {
  try {
    const res = await api.post("/create-order", { amount });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to create rent order:", err.response?.data || err.message);
    throw err;
  }
};

export const verifyRentPayment = async (paymentData) => {
  try {
    const res = await api.post("/verify-payment", paymentData, { timeout: 60000 });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to verify rent payment:", err.response?.data || err.message);
    throw err;
  }
};

// ---------------- Monthly Rent Payment ----------------
export const createMonthlyRentOrder = async ({
  amount,
  property_id,
  room_label,
  occupancy,
  payment_month,
  payment_year,
}) => {
  try {
    const res = await api.post("/create-order/monthly", {
      amount,
      property_id,
      room_label,
      occupancy,
      payment_month,
      payment_year,
    });
    return res.data;
  } catch (err) {
    console.error(
      "❌ Failed to create monthly rent order:",
      err.response?.data || err.message
    );
    throw err;
  }
};


export const verifyMonthlyRentPayment = async (paymentData) => {
  try {
    const res = await api.post("/verify-payment/monthly", paymentData, { timeout: 60000 });
    return res.data;
  } catch (err) { 
    console.error("❌ Failed to verify monthly rent payment:", err.response?.data || err.message);
    throw err;
  }
};
