import React, { useState, useEffect } from "react";
import SalesPerson from "/TeamImg/Dharmendra.jpg";
import { saveRequest } from "../../api/requestApi"; // use same API

export default function SalesPersonCard() {
  const name = "Dharmendra Mishra";
  const phone = "+91 8090200513"; 
  const role = "Relationship Manager";
  const bullets = [
    "Assists clients in finding best solutions",
    "Helps with corporate relocations",
    "Provides expert consultation",
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showRealPhone, setShowRealPhone] = useState(false); 
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("showRealPhone");
    if (saved === "true") setShowRealPhone(true);
  }, []);

  const maskPhone = (num) => {
    const clean = num.replace("+91 ", "");
    if (!clean || clean.length < 10) return num;
    return `+91 ${clean.slice(0, 2)}80xxxxxx13${clean.slice(-2)}`;
  };

  const handleChange = (e) => {
    if (e.target.name === "phone") {
      const onlyNums = e.target.value.replace(/\D/g, "");
      setFormData({ ...formData, phone: onlyNums });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const isInvalidPhone = (num) => {
    const invalidNumbers = [
      "1111111111","0000000000","1234567890","0987654321",
      "2222222222","3333333333","4444444444","5555555555",
      "6666666666","7777777777","8888888888","9999999999",
      "1212121212","1122334455","1020304050","9876543210",
      "1357913579","2468246824","1231231231","3213213210",
    ];
    return num.length !== 10 || invalidNumbers.includes(num);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isInvalidPhone(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      await saveRequest(formData); // 🔹 same API call as Banner
      setSubmitted(true);
      setShowRealPhone(true);
      localStorage.setItem("showRealPhone", "true");
      setFormData({ name: "", phone: "", email: "" });

      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 2500);

    } catch (err) {
      console.error("❌ Failed to save request:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "para_font" }} className=" z-40 w-full bg-white shadow-xl rounded-lg p-6 sticky top-24 flex flex-col gap-4">
      <h2 style={{ fontFamily: "heading_font" }} className="text-xl text-zinc-900">Meet Our Expert</h2>

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 overflow-hidden flex-shrink-0">
          <img src={SalesPerson} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col">
          <h3 className="font-bold text-gray-900 text-base">{name}</h3>
          <p className="text-gray-500 text-xs mt-1">{showRealPhone ? phone : maskPhone(phone)}</p>
          <p className="text-blue-600 text-sm mt-1">{role}</p>
        </div>
      </div>

      <h4 className="text-gray-800 mt-2 text-xs">Find Your Best Listings with Expert Guidance</h4>

      <ul className="list-disc list-inside text-gray-600 text-xs space-y-1">
        {bullets.map((b, idx) => <li key={idx}>{b}</li>)}
      </ul>

      <button
        onClick={() => setIsOpen(true)}
        className="mt-3 w-full py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300"
      >
        Connect with us
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center px-2 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl relative overflow-hidden flex flex-col md:flex-row">
            <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg">✕</button>

            <div className="bg-blue-50 p-6 md:w-1/2 border-r border-gray-200">
              <h3 className="text-gray-800 font-semibold text-lg mb-4">Why Choose EaseMySpace? ✨</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ Zero Brokerage – Direct Connect with Owners</li>
                <li>✅ Largest Network of Flatmates & Vacant Rooms</li>
                <li>✅ Verified & Active Listings Only</li>
                <li>✅ Personalized Assistance by EMS Experts</li>
              </ul>
            </div>

            <div className="p-6 md:w-1/2 flex flex-col justify-center">
              {!submitted ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">How can we help you?</h2>
                  <p className="text-sm text-gray-600 mb-4">Speak directly with {name}.</p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" name="name" placeholder="*Enter your name" value={formData.name} onChange={handleChange} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <input type="tel" name="phone" placeholder="*Enter your mobile number" value={formData.phone} onChange={handleChange} maxLength={10} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <input type="email" name="email" placeholder="*Enter your work email" value={formData.email} onChange={handleChange} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50">
                      {loading ? "Submitting..." : "Request Callback"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center text-green-600 font-medium text-lg">
                  ✅ {name} will contact you shortly!
                  <p className="text-gray-600 text-sm mt-2">Please keep your phone handy.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
