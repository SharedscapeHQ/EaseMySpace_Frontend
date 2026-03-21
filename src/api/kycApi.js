import axios from "axios";

const api = axios.create({
  baseURL: "https://api.easemyspace.in/api/user/kyc",
  withCredentials: true,
});

// export const initiateKyc = () => api.post("/initiate");

// export const getKycStatus = () => api.get("/status");

export const uploadKycDocs = (formData) => api.post("/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

// ✅ Get KYC documents for current user
export const getKycDocs = () => api.get("/my-docs");