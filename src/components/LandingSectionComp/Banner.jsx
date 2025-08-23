import React, { useState } from "react";
import { FaAddressCard } from "react-icons/fa";
import { saveRequest } from "../../api/requestApi";

function Banner() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Phone validation
  const phonePattern = /^[0-9]{10}$/; // exactly 10 digits
  const invalidNumbers = [
  "1111111111",
  "0000000000",
  "1234567890",
  "0987654321",
  "2222222222",
  "3333333333",
  "4444444444",
  "5555555555",
  "6666666666",
  "7777777777",
  "8888888888",
  "9999999999",
  "1212121212",
  "1122334455",
  "1020304050",
  "9876543210",
  "1357913579",
  "2468246824",
  "1231231231",
  "3213213210"
];


  if (!phonePattern.test(formData.phone) || invalidNumbers.includes(formData.phone)) {
    alert("Please enter a valid 10-digit phone number.");
    setLoading(false);
    return; // stop submission
  }

  try {
    // 🔹 Save request in backend
    await saveRequest(formData);
    setSubmitted(true);

    // Reset form
    setFormData({ name: "", phone: "", email: "" });

    // Auto-close after 2.5 sec
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
    }, 2500);
  } catch (err) {
    console.error("❌ Failed to save request:", err);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      style={{ fontFamily: "para_font" }}
      className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 px-6 md:px-20 py-6 bg-blue-200"
    >
      {/* Left Section */}
      <div className="flex items-start md:items-center gap-4 text-center md:text-left">
        {/* <FaAddressCard className="text-4xl md:text-5xl" /> */}
        <div>
          <div className="text-base md:text-lg font-medium">
            Looking for a flatmate or have a room to rent?
          </div>
          <div className="text-sm text-gray-700">
            Talk to our experts for complete guidance and get the best verified options tailored to your needs
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-800 text-white px-4 py-2 rounded-lg text-sm md:text-base shadow hover:bg-blue-900 transition"
        >
          Talk to an expert
        </button>
      </div>

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-2">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl relative overflow-hidden flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>

            {/* Left Info Section */}
            <div className="bg-blue-50 p-6 md:w-1/2 border-r border-gray-200">
              <h3 className="text-gray-800 font-semibold text-lg mb-4">
                Why Choose EaseMySpace? ✨
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ Zero Brokerage – Direct Connect with Owners</li>
                <li>✅ Largest Network of Flatmates & Vacant Rooms</li>
                <li>✅ Verified & Active Listings Only</li>
                <li>✅ Personalized Assistance by EMS Experts</li>
              </ul>
              <div className="mt-6 text-sm text-gray-500">
                🌟 India’s Fastest Growing Urban Living Platform 🌟
              </div>
            </div>

            {/* Right Section */}
            <div className="p-6 md:w-1/2 flex flex-col justify-center">
              {!submitted ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    How can we help you?
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Speak with a space solution expert.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="text"
                      name="name"
                      placeholder="*Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                   <input
  type="tel"
  name="phone"
  placeholder="*Enter your mobile number"
  value={formData.phone}
  onChange={(e) => {
    const onlyNums = e.target.value.replace(/\D/g, ""); // remove non-digits
    setFormData({ ...formData, phone: onlyNums });
  }}
  maxLength={10} // optional, restrict to 10 digits
  required
  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
/>
                    <input
                      type="email"
                      name="email"
                      placeholder="*Enter your work email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
                    >
                      {loading ? "Submitting..." : "Request Callback"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center text-green-600 font-medium text-lg">
                  ✅ We’ve received your request!
                  <p className="text-gray-600 text-sm mt-2">
                    Our team will contact you shortly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Banner;
