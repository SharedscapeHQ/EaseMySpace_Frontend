import { Link } from "react-router-dom"; 
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { sendOtp, verifyOtp } from "../../api/mobileAuthApi";


export default function OtpPopup({ onVerified, onClose }) {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    if (!resendTimer) return;
    const i = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [resendTimer]);

  const formatName = (val) =>
    val.replace(/[^a-zA-Z]/g, "").replace(/^./, (c) => c.toUpperCase());

  const isFakePhoneNumber = (num) => {
    if (/^(\d)\1{9}$/.test(num)) return true;
    if (num === "1234567890" || num === "0987654321") return true;
    if (
      num.startsWith("900000") ||
      num.startsWith("999999") ||
      num.startsWith("888888") ||
      num.startsWith("777777")
    )
      return true;
    if (/(\d)\1{3,}$/.test(num)) return true;
    return false;
  };

 const sendOtpHandler = async () => {
  if (!consentChecked) return toast.error("You must accept the Privacy Policy");
  if (!firstName) return toast.error("Enter your first name");
  if (!/^\d{10}$/.test(phone))
    return toast.error("Enter valid 10 digit mobile number");
  if (isFakePhoneNumber(phone))
    return toast.error("Please enter a valid mobile number");

  try {
    setLoading(true);

    await sendOtp(phone); 

    toast.success("OTP sent successfully");
    setOtpSent(true);
    setResendTimer(30);

  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to send OTP"
    );
  } finally {
    setLoading(false);
  }
};


const verifyOtpHandler = async () => {
  if (!/^\d{4}$/.test(otp)) return toast.error("OTP must be 4 digits");

  try {
    setLoading(true);

    const res = await verifyOtp({ phone, otp, firstName });
    const { user, accessToken } = res.data;

    // Save login
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("otp_verified", "true");

    // ✅ Dispatch a custom event for Navbar to catch
    window.dispatchEvent(new Event("auth-change"));

    toast.success("Logged in successfully");

    // Inform parent
    onVerified?.(user, accessToken);
    onClose?.();

  } catch (err) {
    toast.error(err.response?.data?.message || "OTP verification failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
        {/* Top bar */}
        <div className="relative flex items-center">
          <button
            onClick={onClose}
            className="absolute left-0 text-2xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
          <span className="mx-auto text-sm font-medium text-gray-500">
            Login / Signup
          </span>
        </div>

        <div className="w-full h-px bg-gray-200" />

        <h3 className="text-2xl  text-gray-900 text-left">
          Welcome to EaseMySpace 
        </h3>

        {!otpSent ? (
          <>
            <input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(formatName(e.target.value))}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none"
            />

            <input
              placeholder="Mobile Number"
              value={phone}
              maxLength={10}
              onChange={(e) =>
                /^\d*$/.test(e.target.value) && setPhone(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3 focus:outline-none"
            />

            <p className="text-xs text-gray-500 leading-relaxed">
              We will send an OTP to your WhatsApp number. Please ensure this
              number is registered on WhatsApp. Do not share OTP with anyone.{" "}
              <a href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>

          <button
  onClick={sendOtpHandler}
  disabled={loading}
  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
>
  {loading ? "Sending OTP..." : "Continue"}
</button>


          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              We have sent a 4-digit OTP on your WhatsApp number. Please check.
            </p>

            <input
              placeholder="Enter OTP"
              value={otp}
              maxLength={4}
              onChange={(e) =>
                /^\d*$/.test(e.target.value) && setOtp(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3 focus:outline-none"
            />

              <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="consent"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="consent" className="text-sm text-gray-600">
                I agree to the{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              onClick={verifyOtpHandler}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

          <button
  disabled={resendTimer > 0}
  onClick={sendOtpHandler}
  className="text-sm text-blue-600 self-end disabled:text-gray-400"
>
  {resendTimer ? `Resend in ${resendTimer}s` : "Resend OTP"}
</button>

          </>
        )}

        <div className="text-center text-gray-400">——— OR ———</div>

        {/* Improved Login/Register Links */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          <div>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600  hover:underline"
            >
              Login
            </Link>
          </div>
          <div>
            <Link
              to="/register"
              className="text-blue-600  hover:underline"
              >
              Register
            </Link>
              {" "}with full details?
          </div>
        </div>
      </div>
    </div>
  );
}
