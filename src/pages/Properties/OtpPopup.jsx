import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function OtpPopup({ onVerified, onClose, otpPurpose }) {
  const [userMobile, setUserMobile] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const storedMobile = localStorage.getItem("user_verified_mobile");
    if (storedMobile) setUserMobile(storedMobile);
  }, []);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(userMobile)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    try {
      setIsSending(true);
      setResending(true);
      const res = await axios.post(
        "https://api.easemyspace.in/api/leads/send-otp",
        { phone: userMobile },
        { withCredentials: true }
      );

      if (res.data.message === "otp_sent") {
        setOtpSent(true);
        setUserOtp("");
        toast.success("OTP sent successfully!");
        setResendTimer(30); // 30 seconds cooldown before resend
      } else {
        toast.error(res.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      toast.error("Error sending OTP. Please try again.");
    } finally {
      setIsSending(false);
      setResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const formattedPhone = userMobile.startsWith("+91") ? userMobile : `+91${userMobile}`;

    if (!/^\d{6}$/.test(userOtp)) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setIsVerifying(true);
      const res = await axios.post(
        "https://api.easemyspace.in/api/leads/verify-otp",
        { phone: formattedPhone, code: userOtp },
        { withCredentials: true }
      );

      if (res.data.verified === true) {
        localStorage.setItem("otp_verified", "true");
        localStorage.setItem("user_verified_mobile", userMobile);

        if (res.data.isUser && res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          localStorage.removeItem("user");
        }

        toast.success("OTP verified successfully!");
        onVerified(userMobile);
        onClose();
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error("Error verifying OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (otpSent) {
      const timeout = setTimeout(() => document.getElementById("otpInput")?.focus(), 100);
      return () => clearTimeout(timeout);
    }
  }, [otpSent]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
      <div style={{ fontFamily: "para_font" }} className="bg-white rounded-2xl p-6 w-80 shadow-2xl relative flex flex-col gap-4">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold transition" aria-label="Close OTP popup">×</button>

        <h3 className="text-xl font-semibold text-gray-800 text-center">Verify to {otpPurpose}</h3>
        <p className="text-sm text-gray-500 text-center">Enter your mobile number to continue</p>

        <input
          type="tel"
          placeholder="Mobile Number"
          maxLength={10}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          value={userMobile}
          onChange={(e) => /^\d*$/.test(e.target.value) && setUserMobile(e.target.value)}
          disabled={isSending || isVerifying}
        />

        {otpSent && (
          <>
            <input
              id="otpInput"
              type="tel"
              placeholder="Enter OTP"
              maxLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition"
              value={userOtp}
              onChange={(e) => /^\d*$/.test(e.target.value) && setUserOtp(e.target.value)}
              disabled={isVerifying}
            />
            <button
              onClick={handleSendOtp}
              className="text-indigo-600 text-sm hover:underline disabled:text-gray-400 self-end"
              disabled={resending || isSending || resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
            </button>
          </>
        )}

        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-60"
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-green-600 text-white py-2 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-60"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>
        )}
      </div>
    </div>
  );
}

export default OtpPopup;
