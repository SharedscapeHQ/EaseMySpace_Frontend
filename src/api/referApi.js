import axios from "axios";

const api = axios.create({
  baseURL: "https://api.easemyspace.in/api/refer",
  withCredentials: true,
});

// ✅ Fetch wallet
export const getWalletDetails = () => api.get("/");

// ✅ Create withdrawal (payload stays same as frontend form)
export const createWithdrawal = (data) => api.post("/withdraw", data);

// ✅ Fetch all withdrawals (admin only)
export const getAllWithdrawals = () => api.get("/withdraw/all");

// ✅ Update withdrawal status (admin only)
export const updateWithdrawal = (id, status) =>
  api.put(`/withdraw/${id}`, { status });
