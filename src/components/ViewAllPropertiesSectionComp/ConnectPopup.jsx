import React, { useState } from "react";
import { createPortal } from "react-dom";
import { saveRequest } from "../../api/requestApi";

export default function ConnectPopup({ name, setIsOpen }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === "phone" ? value.replace(/\D/g, "") : value
    });
  };

  const isInvalidPhone = (num) => {
    const invalidNumbers = ["1111111111","0000000000","1234567890","0987654321","2222222222","3333333333","4444444444","5555555555","6666666666","7777777777","8888888888","9999999999","1212121212","1122334455","1020304050","9876543210","1357913579","2468246824","1231231231","3213213210"];
    return num.length !== 10 || invalidNumbers.includes(num);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isInvalidPhone(formData.phone)) return alert("Please enter a valid 10-digit phone number.");
    setLoading(true);
    try {
      await saveRequest(formData);
      setSubmitted(true);
      localStorage.setItem("showRealPhone", "true");
      setFormData({ name: "", phone: "", email: "" });
      setTimeout(() => { setIsOpen(false); setSubmitted(false); }, 2500);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex justify-center items-center px-2">
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
                <input type="email" name="email" placeholder="*Enter your email" value={formData.email} onChange={handleChange} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50">{loading ? "Submitting..." : "Request Callback"}</button>
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
    </div>,
    document.body
  );
}
