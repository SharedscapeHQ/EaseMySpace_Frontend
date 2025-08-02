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

  // Load userMobile from localStorage if available on initial render
  useEffect(() => {
    const storedMobile = localStorage.getItem("user_verified_mobile");
    if (storedMobile) {
      setUserMobile(storedMobile);
    }
  }, []);

  const handleSendOtp = async () => {
    if (userMobile.length === 10) {
      try {
        setIsSending(true);
        setResending(true);
        const res = await axios.post("https://api.easemyspace.in/api/leads/send-otp", {
          phone: userMobile,
        });

        if (res.data.message === "otp_sent") {
          setOtpSent(true);
          toast.success("OTP sent successfully!");
        } else {
          toast.error(res.data.message || "Failed to send OTP.");
        }
      } catch (err) {
        console.error("Error sending OTP:", err); // Log the actual error for debugging
        toast.error("Error sending OTP. Please try again.");
      } finally {
        setIsSending(false);
        setResending(false);
      }
    } else {
      toast.error("Enter valid 10-digit mobile number");
    }
  };

  const handleVerifyOtp = async () => {
    // Ensure the phone number is formatted correctly for the API if necessary
    const formattedPhone = userMobile.startsWith("+91") ? userMobile : `+91${userMobile}`;

    try {
      setIsVerifying(true);
      const res = await axios.post("https://api.easemyspace.in/api/leads/verify-otp", {
        phone: formattedPhone,
        code: userOtp,
      });

      if (res.data.verified === true) {
        localStorage.setItem("otp_verified", "true");
        // --- NEW: Save the verified mobile number to localStorage ---
        localStorage.setItem("user_verified_mobile", userMobile);
        // --- END NEW ---
        toast.success("OTP verified successfully!");

        const lead = res.data.lead;
        if (lead.subscription_status === "paid") {
          localStorage.setItem("has_paid_lead", "true");
          onVerified(true);
        } else {
          localStorage.setItem("has_paid_lead", "false");
          onVerified(false);
        }

        onClose();
      } else {
        toast.error(res.data.message || "Invalid OTP.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err); // Log the actual error for debugging
      toast.error("Error verifying OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (otpSent) {
      const timeout = setTimeout(() => {
        document.getElementById("otpInput")?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [otpSent]);

  return (
    <div
      key={otpSent ? "otp-mode" : "mobile-mode"}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
    >
      <div style={{ fontFamily: "para_font" }} className="bg-white rounded-xl p-6 w-80 shadow-lg relative ">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 text-xl"
        >
          ×
        </button>
        <h3 className="text-lg text-gray-800 mb-3">
          Verify to {otpPurpose}
        </h3>

        <input
          type="text"
          placeholder="Enter your mobile number"
          maxLength={10}
          className="w-full mb-2 px-3 py-2 border border-gray-300 rounded"
          value={userMobile}
          onChange={(e) => setUserMobile(e.target.value)}
          disabled={isSending || isVerifying}
        />

        {otpSent && (
          <>
            <input
              id="otpInput"
              type="text"
              placeholder="Enter OTP"
              className="w-full mb-2 px-3 py-2 border border-gray-300 rounded"
              value={userOtp}
              onChange={(e) => setUserOtp(e.target.value)}
              disabled={isVerifying}
            />
            <button
              onClick={handleSendOtp}
              className="text-indigo-600 text-sm mb-2 hover:underline disabled:text-gray-400"
              disabled={resending || isSending}
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </>
        )}

        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-500 text-white py-2 rounded mt-2 font-medium disabled:opacity-60"
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-green-600 text-white py-2 rounded mt-2 font-medium disabled:opacity-60"
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