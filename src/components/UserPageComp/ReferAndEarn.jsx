import React, { useState, useEffect } from "react";
import { FiCopy } from "react-icons/fi";
import {
  FaWhatsapp,
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaUserPlus,
  FaHome,
  FaRegCheckCircle,
  FaCrown,
} from "react-icons/fa";

export default function ReferAndEarn() {
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setReferralCode(user.referral_code || "N/A");
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const registerUrl = `http://easemyspace.in/register?ref=${referralCode}`;

  const shareText = `Join me on EaseMySpace! Use my referral code: ${referralCode}.
- Signup → Earn ₹25
- Property Listing Approval → Earn ₹100
- Trial Plan → Earn ₹50
- Ultimate Plan → Earn ₹150
Sign up here: ${registerUrl}`;

  const shareOptions = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    email: `mailto:?subject=Join EaseMySpace and Earn Rewards!&body=${encodeURIComponent(
      shareText
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      registerUrl
    )}&text=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText + " " + registerUrl
    )}`,
  };

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      {/* Main Card */}
      <div className="flex flex-col lg:flex-row gap-6 bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
        {/* Left Column: Referral Info */}
        <div className="lg:w-2/3 px-6 py-6 space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Refer More, Earn More
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            Invite your friends to EaseMySpace and unlock exclusive rewards.
            Share your referral code today and maximize your earnings.
          </p>

          <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg font-mono text-lg text-gray-800 w-max">
            <span>{referralCode}</span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              title="Copy Code"
            >
              <FiCopy className="text-gray-700" />
            </button>
          </div>
          {copied && (
            <p className="text-green-600 text-sm">Referral code copied!</p>
          )}

          {/* Rewards Highlight */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-indigo-50 p-4 rounded-lg text-center shadow-sm">
              <FaUserPlus className="mx-auto text-indigo-600 text-2xl mb-2" />
              <p className="font-medium text-gray-800">Signup</p>
              <p className="text-sm text-gray-600">Earn ₹25</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-center shadow-sm">
              <FaHome className="mx-auto text-indigo-600 text-2xl mb-2" />
              <p className="font-medium text-gray-800">Property Approval</p>
              <p className="text-sm text-gray-600">Earn ₹100</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-center shadow-sm">
              <FaRegCheckCircle className="mx-auto text-indigo-600 text-2xl mb-2" />
              <p className="font-medium text-gray-800">Trial Plan</p>
              <p className="text-sm text-gray-600">Earn ₹50</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-center shadow-sm">
              <FaCrown className="mx-auto text-indigo-600 text-2xl mb-2" />
              <p className="font-medium text-gray-800">Ultimate Plan</p>
              <p className="text-sm text-gray-600">Earn ₹150</p>
            </div>
          </div>
        </div>

        {/* Right Column: Share Options / CTA */}
        <div className="lg:w-1/3 bg-indigo-50 px-6 py-6 flex flex-col justify-between">
          <h3 className="text-xl font-bold text-indigo-700 mb-3">
            Share Your Code
          </h3>
          <div className="flex flex-col gap-3">
            <a
              href={shareOptions.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <a
              href={shareOptions.email}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <FaEnvelope /> Email
            </a>
            <a
              href={shareOptions.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-700 hover:text-blue-800"
            >
              <FaLinkedin /> LinkedIn
            </a>
            <a
              href={shareOptions.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sky-500 hover:text-sky-600"
            >
              <FaTwitter /> Twitter
            </a>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-pink-500 hover:text-pink-600"
              title="Copy for Instagram"
            >
              <FaInstagram /> Copy for Instagram
            </button>
          </div>
          <p className="mt-6 text-gray-600 text-sm">
            Start sharing your code today and earn guaranteed rewards with every
            successful referral.
          </p>
        </div>
      </div>

      {/* Tutorial Section */}
      <div className="bg-white shadow-md border border-gray-200 rounded-2xl px-6 py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          How It Works
        </h3>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <FaUserPlus className="mx-auto text-indigo-600 text-3xl mb-3" />
            <h4 className="font-semibold text-gray-800">1. Share Code</h4>
            <p className="text-sm text-gray-600">
              Invite friends with your unique code.
            </p>
          </div>
          <div className="p-4">
            <FaUserPlus className="mx-auto text-indigo-600 text-3xl mb-3" />
            <h4 className="font-semibold text-gray-800">2. Signup</h4>
            <p className="text-sm text-gray-600">
              Friend signs up → you earn ₹25.
            </p>
          </div>
          <div className="p-4">
            <FaHome className="mx-auto text-indigo-600 text-3xl mb-3" />
            <h4 className="font-semibold text-gray-800">3. Property Approval</h4>
            <p className="text-sm text-gray-600">
              When admin approves → you earn ₹100.
            </p>
          </div>
          <div className="p-4">
            <FaCrown className="mx-auto text-indigo-600 text-3xl mb-3" />
            <h4 className="font-semibold text-gray-800">4. Subscription Purchase</h4>
            <p className="text-sm text-gray-600">
              Earn ₹50 (Trial) or ₹150 (Ultimate).
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-xs mt-4">
        *Terms & Conditions Apply. Rewards are credited only after successful
        verification.
      </div>
    </div>
  );
}
