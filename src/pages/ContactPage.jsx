import React, { useState } from "react";
import { motion } from "framer-motion";
import heroImg from "/contact-assets/contactUs.gif";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="flex flex-1 flex-col lg:flex-row px-6 md:px-16 py-2 gap-8">
  
  {/* Left Info Panel */}
  <div className="lg:w-1/2 flex flex-col justify-between h-full">
    <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center flex-1"
          >
            <img
              src={heroImg}
              alt="Contact Illustration"
              className="w-full max-w-md h-full object-contain "
            />
          </motion.div>

    {/* Info Card */}
    <motion.aside
      initial={{ opacity: 0, x: -60, rotate: -3 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-lg p-6 md:p-8 shadow-2xl flex-shrink-0"
    >
      <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide drop-shadow-md">
        Contact Us
      </h1>
      <div className="mt-4 space-y-2 text-sm md:text-base font-medium">
        <div>
          <span className="font-semibold">Address:</span>{" "}
          WeWork, 1st Floor, 264–265, Dr Annie Besant Rd, Worli, Mumbai 400025
        </div>
        <div>
          <span className="font-semibold">Phone:</span> +91 9004463371
        </div>
        <div>
          <span className="font-semibold">Email:</span> support@easemyspace.in
        </div>
      </div>
    </motion.aside>
  </div>

  {/* Right Form */}
  <motion.section
    initial={{ opacity: 0, x: 60 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="lg:w-1/2 flex items-center justify-center h-full"
  >
    <div className="w-full bg-white rounded-lg p-8 border-2 border-gray-200 flex flex-col justify-between h-full mt-14">
      <h2 className="text-3xl font-extrabold text-indigo-600 pb-12 text-center">
        Get in Touch
      </h2>

      {submitted && (
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          className="mb-2 bg-indigo-600 text-white px-5 py-3 rounded-lg text-center font-semibold shadow-md"
        >
          Thank you! Your message has been sent.
        </motion.div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex-1 flex flex-col justify-between"
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full border-b-2 border-gray-300 focus:border-indigo-600 outline-none py-2 px-2 rounded-md transition shadow-sm focus:shadow-outline"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full border-b-2 border-gray-300 focus:border-indigo-600 outline-none py-2 px-2 rounded-md transition shadow-sm focus:shadow-outline"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject (optional)"
          value={formData.subject}
          onChange={handleChange}
          className="w-full border-b-2 border-gray-300 focus:border-indigo-600 outline-none py-2 px-2 rounded-md transition shadow-sm focus:shadow-outline"
        />
        <textarea
          name="message"
          rows="4"
          placeholder="Your message..."
          required
          value={formData.message}
          onChange={handleChange}
          className="w-full border-b-2 border-gray-300 focus:border-indigo-600 outline-none py-2 px-2 rounded-md transition shadow-sm focus:shadow-outline resize-none flex-1"
        ></textarea>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-indigo-600 text-white py-3 rounded-full font-semibold hover:bg-indigo-700 transition shadow-md"
        >
          Send Message
        </motion.button>
      </form>
    </div>
  </motion.section>
</div>

  );
}
