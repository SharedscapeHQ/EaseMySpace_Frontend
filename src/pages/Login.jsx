import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

import {
  loginUser,
  requestPasswordReset,
  verifyPasswordReset,
} from "../api/authApi";

import { AuthContext } from "../context/AuthContextV1"; // adjust path as needed

function Login() {
  const { login } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [mode, setMode] = useState("email");

  /* ───────── Login ───────── */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return toast.error("Enter a valid email");
  if (!password.trim()) return toast.error("Password cannot be empty");

  const id = toast.loading("Logging in…");
  try {
    const res = await loginUser({ email, password });
    const { user: userData, message } = res.data ?? res;

    login(userData); // update context

    toast.success(message || "Login successful", { id });
    navigate(redirectPath);
  } catch (err) {
    toast.error(err?.response?.data?.message || "Email or password is incorrect", { id });
  }
};
  /* ───────── Send / Resend OTP ───────── */
  const handleSendOtp = async () => {
    if (mode === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return toast.error("Enter a valid email");
    if (mode === "mobile" && !phone.trim()) return toast.error("Enter your phone number");

    const payload = { mode };
    if (mode === "email") payload.email = email;
    if (mode === "mobile") payload.phone = phone;

    const id = toast.loading("Sending OTP…");
    try {
      await requestPasswordReset(payload);
      toast.success(`OTP sent to your ${mode === "email" ? "email" : "mobile"}`, { id });
      setOtpSent(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not send OTP", { id });
    }
  };

  const handleResendOtp = () => handleSendOtp();

  /* ───────── Verify OTP ───────── */
  const handleVerifyOtp = async () => {
    if (!otp.trim() || newPass.trim().length < 6)
      return toast.error("Enter OTP & a password of at least 6 characters");

    const payload = { mode, otp, newPassword: newPass };
    if (mode === "email") payload.email = email;
    if (mode === "mobile") payload.phone = phone;

    const id = toast.loading("Verifying OTP…");
    try {
      await verifyPasswordReset(payload);
      toast.success("Password updated. Please log in.", { id });

      setOtpSent(false);
      setShowForgot(false);
      setPassword("");
      setOtp("");
      setNewPass("");
      setPhone("");
      setMode("email");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP", { id });
    }
  };

  /* ───────── UI ───────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
      className="w-full h-screen bg-blue-100 flex items-center justify-center"
    >
      <a href="/" className="absolute top-5 left-5 text-blue-700 hover:underline">
        Back to home page
      </a>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 flex flex-col gap-6"
      >
        <h1 className="text-2xl text-center text-blue-500" style={{ fontFamily: "para_font" }}>
          {showForgot ? "Forgot Password" : "Login"}
        </h1>

        {/* LOGIN FORM */}
        {!showForgot && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val.includes(" ")) setPassword(val);
                  }}
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="relative group px-6 w-[200px] mt-5 h-[50px] left-1/2 -translate-x-1/2 py-2 bg-blue-400 hover:bg-zinc-800 text-zinc-800 hover:text-blue-200 rounded-lg overflow-hidden shadow-lg transition-all duration-200 ease-in-out"
            >
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-x-full">
                Login
              </span>
              <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 group-hover:translate-x-0">
                Login
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-sm text-blue-600 hover:underline self-end"
            >
              Forgot password?
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Register
              </Link>
            </p>
          </>
        )}

        {/* FORGOT PASSWORD STEPS */}
        {showForgot && (
          <>
            {!otpSent ? (
              <>
                <p className="text-gray-600 text-sm mb-4">
                  We’ll send you a one-time password (OTP) to reset your account.
                </p>

                <div className="flex gap-6 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="otpMode"
                      value="email"
                      checked={mode === "email"}
                      onChange={() => setMode("email")}
                    />
                    Email
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="otpMode"
                      value="mobile"
                      checked={mode === "mobile"}
                      onChange={() => setMode("mobile")}
                    />
                    Mobile
                  </label>
                </div>

                {mode === "email" && (
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  />
                )}
                {mode === "mobile" && (
                  <input
                    type="tel"
                    placeholder="Enter your phone"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  />
                )}

                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Send OTP
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="text-sm text-blue-600 hover:underline text-center mt-2"
                >
                  Back to login
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 text-center bg-blue-50 border border-blue-200 rounded-md py-2 px-3 mb-3">
                  OTP has been sent to your {mode === "email" ? "email" : "WhatsApp number"}.
                </p>

                <input
                  type="text"
                  placeholder="Enter OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    required
                    value={newPass}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val.includes(" ")) setNewPass(val);
                    }}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 mb-3"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-600"
                  >
                    {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition mb-2"
                >
                  Verify & Reset
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="w-full text-center text-blue-600 hover:underline mb-2"
                >
                  Resend OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setShowForgot(false);
                    setOtp("");
                    setNewPass("");
                    setPhone("");
                    setMode("email");
                  }}
                  className="text-sm text-blue-600 hover:underline text-center"
                >
                  Cancel
                </button>
              </>
            )}
          </>
        )}
      </form>
    </motion.div>
  );
}

export default Login;