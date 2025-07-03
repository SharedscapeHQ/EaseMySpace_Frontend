import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white pt-24 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Sidebar panel */}
        <motion.div
          initial={{ opacity: 0, x: -60, rotate: -6 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.6 }}
          className="col-span-1 bg-blue-400 text-zinc-800 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden"
          style={{ clipPath: "polygon(0 0, 100% 7%, 100% 93%, 0% 100%)" }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight uppercase drop-shadow-lg">
            Contact<br />Us
          </h1>
          <p className="mt-4 font-mono text-zinc-800 tracking-wide text-sm md:text-base">
            Drop a line or just say hi. We’re here.
          </p>

          <div
            aria-hidden="true"
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 200"
              fill="none"
              className="opacity-10"
            >
              <line x1="0" y1="50" x2="200" y2="50" stroke="blue" strokeWidth="1.5" />
              <line x1="0" y1="150" x2="200" y2="150" stroke="blue" strokeWidth="1.5" />
              <line x1="50" y1="0" x2="50" y2="200" stroke="blue" strokeWidth="1.5" />
              <line x1="150" y1="0" x2="150" y2="200" stroke="blue" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="mt-8 space-y-4 font-mono text-xs md:text-sm tracking-wide text-zinc-800">
            <div>
              <strong>Address:</strong> 123 Mumbai Street, India
            </div>
            <div>
              <strong>Phone:</strong> +91 98765 43210
            </div>
            <div>
              <strong>Email:</strong> contact@example.com
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 60, rotate: 6 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.6 }}
          className="col-span-2 bg-white border-2 border-black rounded-2xl p-8 shadow-lg"
        >
          {submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black text-white px-5 py-2 rounded mb-5 text-center font-semibold text-sm md:text-base"
              role="alert"
            >
              Thank you! Your message has been sent.
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {["name", "email", "subject"].map((field) => (
              <motion.div key={field} whileFocusWithin={{ scale: 1.02 }} className="relative">
                <label
                  htmlFor={field}
                  className="block text-xs md:text-sm font-bold uppercase mb-1 tracking-wide text-black"
                >
                  {field === "name"
                    ? "Full Name"
                    : field === "email"
                    ? "Email Address"
                    : "Subject"}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  id={field}
                  name={field}
                  required={field !== "subject"}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={
                    field === "name"
                      ? "Your full name"
                      : field === "email"
                      ? "you@example.com"
                      : "Subject (optional)"
                  }
                  className="w-full border-b-2 border-black bg-transparent px-2 py-1 text-base md:text-lg font-mono placeholder-black focus:outline-none focus:border-black focus:ring-0 transition"
                />
              </motion.div>
            ))}

            <motion.div whileFocusWithin={{ scale: 1.02 }} className="relative">
              <label
                htmlFor="message"
                className="block text-xs md:text-sm font-bold uppercase mb-1 tracking-wide text-black"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="w-full border-b-2 border-black bg-transparent px-2 py-1 text-base md:text-lg font-mono placeholder-black focus:outline-none focus:border-black focus:ring-0 resize-none transition"
              ></textarea>
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-10 py-3 border-2 border-black rounded-full uppercase tracking-widest font-extrabold text-black hover:bg-black hover:text-white transition text-sm md:text-base"
            >
              Send
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
