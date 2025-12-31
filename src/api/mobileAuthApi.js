import axios from "axios";

const api = axios.create({
  baseURL: "https://api.easemyspace.in/api/mobile/auth",
  withCredentials: true,
  headers: {
  "x-platform": "web",
} 
});


export const sendOtp = (phone) =>
  api.post("/send-otp", { phone });

export const verifyOtp = ({ phone, otp, firstName }) =>
  api.post("/verify-otp", {
    phone,
    otp,
    firstName,
  });
