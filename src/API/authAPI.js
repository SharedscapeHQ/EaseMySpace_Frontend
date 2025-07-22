import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.easemyspace.in/api",
  withCredentials: true,
});

export const loginUser = async (payload) => {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
};

export const logoutUser = async (payload) => {
  const { data } = await apiClient.post("/auth/logout", payload);
  return data;
};

// ✅ FIXED: Accept full payload instead of nesting under "email"
export const requestPasswordReset = (payload) =>
  apiClient.post("/auth/forgot-password/request", payload);

export const verifyPasswordReset = (payload) =>
  apiClient.post("/auth/forgot-password/verify", payload);

export const getCurrentUser = async () => {
  const res = await apiClient.get("/auth/me");
  return res.data;
};