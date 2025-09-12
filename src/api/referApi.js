import axios from "axios";

const api = axios.create({
  baseURL: "https://api.easemyspace.in/api/refer",
  withCredentials: true,
});

export const getWalletDetails = () => api.get("/");