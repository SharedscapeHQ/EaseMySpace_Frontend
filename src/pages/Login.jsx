import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  loginUser,
  requestPasswordReset,
  verifyPasswordReset,
} from "../API/authAPI";

function Login() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [mode, setMode] = useState("email");
  const navigate = useNavigate();

  // Login submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return alert("Enter a valid email");

    try {
      const res = await loginUser({ email, password });
      const { user, message } = res.data ?? res;
      localStorage.setItem("user", JSON.stringify(user));
      alert(message || "Login successful");
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || "Email or password is incorrect";
      alert(msg);
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (mode === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        return alert("Enter a valid email");
    } else if (mode === "mobile") {
      if (!phone.trim()) return alert("Enter your phone number");
    }

    const payload = { mode };
    if (mode === "email") payload.email = email;
    if (mode === "mobile") payload.phone = phone;

    try {
      await requestPasswordReset(payload);
      alert(`OTP sent to your ${mode === "email" ? "email" : "mobile phone"}`);
      setOtpSent(true);
    } catch (err) {
      alert(err?.response?.data?.message || "Could not send OTP");
    }
  };

  // Resend OTP handler (same as send OTP)
  const handleResendOtp = () => {
    handleSendOtp();
  };

  // Verify OTP and reset password
  const handleVerifyOtp = async () => {
    if (!otp.trim() || newPass.trim().length < 6)
      return alert("Enter OTP & a password of at least 6 characters");

    const payload = { mode, otp, newPassword: newPass };
    if (mode === "email") payload.email = email;
    if (mode === "mobile") payload.phone = phone;

    try {
      await verifyPasswordReset(payload);
      alert("Password updated. Please log in.");
      setOtpSent(false);
      setShowForgot(false);
      setPassword("");
      setOtp("");
      setNewPass("");
      setPhone("");
      setMode("email");
    } catch (err) {
      alert(err?.response?.data?.message || "Invalid OTP");
    }
  };

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
        <h1 className="text-2xl font-bold text-center text-blue-500">
          {showForgot ? "Forgot Password" : "Login"}
        </h1>

        {/* EMAIL INPUT ONLY ON LOGIN */}
        {!showForgot && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* LOGIN FORM */}
        {!showForgot && (
          <>
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      required
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Password"
      className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 h-10"
    />
    <button
      type="button"
      onClick={() => setShowPassword((p) => !p)}
      className="absolute top-1/2 right-3 -translate-y-1/2 p-1 rounded hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a19.85 19.85 0 013.23-4.61" />
          <path d="M1 1l22 22" />
          <path d="M9.53 9.53a3 3 0 014.24 4.24" />
        </svg>
      )}
    </button>
  </div>
</div>


            <button
              type="submit"
              className="relative group px-6 w-[200px] mt-5 h-[50px] left-1/2 -translate-x-1/2 py-2 bg-blue-400 hover:bg-zinc-800 text-zinc-800 hover:text-blue-200 rounded-lg font-semibold overflow-hidden shadow-lg transition-all duration-200 ease-in-out"
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
          </>
        )}

        {/* FORGOT PASSWORD - STEP 1: Request OTP */}
        {showForgot && !otpSent && (
          <>
            <p className="text-gray-600 text-sm mb-4">
              We’ll send you a one-time password (OTP) to reset your account.
            </p>

            {/* Mode selector */}
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

            {/* Input depending on mode */}
            {mode === "email" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required={mode === "email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {mode === "mobile" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone"
                  required={mode === "mobile"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
              className="text-sm text-blue-600 hover:underline text-center"
            >
              Back to login
            </button>
          </>
        )}

        {/* FORGOT PASSWORD - STEP 2: Verify OTP */}
        {showForgot && otpSent && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="New Password"
                className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              {/* Eye toggle for new password */}
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-blue-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a19.85 19.85 0 013.23-4.61" />
                    <path d="M1 1l22 22" />
                    <path d="M9.53 9.53a3 3 0 014.24 4.24" />
                  </svg>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition mt-3"
            >
              Verify & Reset
            </button>

            {/* Resend OTP button */}
            <button
              type="button"
              onClick={handleResendOtp}
              className="w-full mt-2 text-center text-blue-600 hover:underline"
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
              className="text-sm text-blue-600 hover:underline text-center mt-3"
            >
              Cancel
            </button>
          </>
        )}

        {/* Link to register */}
        {!showForgot && (
          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        )}
      </form>
    </motion.div>
  );
}

export default Login;
