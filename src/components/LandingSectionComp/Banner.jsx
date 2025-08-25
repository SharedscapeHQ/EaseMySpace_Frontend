import React, { useState } from "react";
import { saveRequest } from "../../api/requestApi";
import leftImg from "/CTA-assets/cta2.png";
import rightImg from "/CTA-assets/cta.png";
import { Link } from "react-router-dom";

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

    const phonePattern = /^[0-9]{10}$/;
    const invalidNumbers = [
      "1111111111","0000000000","1234567890","0987654321","2222222222",
      "3333333333","4444444444","5555555555","6666666666","7777777777",
      "8888888888","9999999999","1212121212","1122334455","1020304050",
      "9876543210","1357913579","2468246824","1231231231","3213213210"
    ];

    if (!phonePattern.test(formData.phone) || invalidNumbers.includes(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      setLoading(false);
      return;
    }

    try {
      await saveRequest(formData);
      setSubmitted(true);
      setFormData({ name: "", phone: "", email: "" });
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
    <>
      {/* Banner Section */}
      <div
        style={{ fontFamily: "para_font" }}
        className="flex justify-between items-center bg-blue-200 gap-6 px-3 lg:px-10 border-2 rounded-2xl py-5 lg:max-w-7xl mx-auto overflow-hidden relative"
      >
        {/* Left Image */}
        <img
          src={leftImg}
          alt="Flatmate search"
          className="hidden absolute -left-10 md:block w-80 object-contain"
        />

        {/* Center Content */}
        <div className="flex flex-col items-center text-center gap-6 flex-1 z-10">
          <div>
            <div className="text-lg md:text-xl font-medium">
              Looking for a flatmate or have a room to rent?
            </div>
            <div className="text-sm text-gray-700 max-w-md mx-auto">
              Talk to our experts for complete guidance and get the best verified options tailored to your needs
            </div>
          </div>
          <div className="flex items-center justify-center gap-5">

          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-800 text-white px-6 py-3 rounded-lg lg:text-base text-xs shadow hover:bg-blue-900 transition"
          >
            Talk to an expert
          </button>
          <Link to="/add-properties" className="bg-green-600 text-white px-6 py-3 rounded-lg lg:text-base text-xs shadow hover:bg-green-700 transition">
          List Property
          </Link>
          </div>
        </div>

        {/* Right Image */}
        <img
          src={rightImg}
          alt="Room rental assistance"
          className="hidden absolute -right-7 md:block w-80 object-contain"
        />
      </div>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl relative overflow-hidden flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>

            {/* Left Info Section */}
            <div className="bg-blue-50 p-6 md:w-1/2 border-r border-gray-200 flex flex-col justify-center text-center md:text-left">
              <h3 className="text-gray-800 font-semibold text-lg mb-4">
                Why Choose EaseMySpace? ✨
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 text-left mx-auto md:mx-0 w-fit">
                <li>✅ Zero Brokerage – Direct Connect with Owners</li>
                <li>✅ Largest Network of Flatmates & Vacant Rooms</li>
                <li>✅ Verified & Active Listings Only</li>
                <li>✅ Personalized Assistance by EMS Experts</li>
              </ul>
              <div className="mt-6 text-sm text-gray-500 text-center md:text-left">
                🌟 India’s Fastest Growing Urban Living Platform 🌟
              </div>
            </div>

            {/* Right Form Section */}
            <div className="p-6 md:w-1/2 flex flex-col justify-center items-center text-center">
              {!submitted ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    How can we help you?
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Speak with a space solution expert.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-sm">
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
                        const onlyNums = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, phone: onlyNums });
                      }}
                      maxLength={10}
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
    </>
  );
}

export default Banner;
