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

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className=" py-5  bg-indigo-50 flex items-center justify-center md:px-0  px-5">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* info panel */}
        <motion.aside
          initial={{ opacity: 0, x: -60, rotate: -6 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-400 text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight uppercase drop-shadow-lg">
            Contact<br />Us
          </h1>
          <p className="mt-4 font-light tracking-wide text-sm md:text-base max-w-xs">
            Drop a line or just say hi. We’re here to help.
          </p>

          {/* subtle grid lines */}
          <svg
            aria-hidden
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
            className="absolute inset-0 opacity-10"
          >
            <line x1="0" y1="50" x2="200" y2="50" stroke="white" strokeWidth="1" />
            <line x1="0" y1="150" x2="200" y2="150" stroke="white" strokeWidth="1" />
            <line x1="50" y1="0" x2="50" y2="200" stroke="white" strokeWidth="1" />
            <line x1="150" y1="0" x2="150" y2="200" stroke="white" strokeWidth="1" />
          </svg>

          <div className="mt-10 space-y-4 text-sm font-medium">
            <div>
              <span className="font-semibold">Address:</span> WeWork, 1st Floor, 264–265, Dr Annie Besant Rd, Worli, Mumbai 400025
            </div>
            <div>
              <span className="font-semibold">Phone:</span> +91 9004463371
            </div>
            <div>
              <span className="font-semibold">Email:</span> support@easemyspace.in
            </div>
          </div>
        </motion.aside>

        {/* form */}
        <motion.section
          initial={{ opacity: 0, x: 60, rotate: 6 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-10 shadow-xl border-2 border-indigo-600"
        >
          {submitted && (
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              className="mb-6 bg-indigo-600 text-white px-5 py-3 rounded-lg text-center font-semibold"
            >
              Thank you! Your message has been sent.
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {["name", "email", "subject"].map((f) => (
              <motion.div key={f} whileFocusWithin={{ scale: 1.02 }}>
                <label
                  htmlFor={f}
                  className="block text-xs font-semibold uppercase mb-1 tracking-wider text-indigo-900"
                >
                  {f === "name" ? "Full Name" : f === "email" ? "Email Address" : "Subject"}
                </label>
                <input
                  type={f === "email" ? "email" : "text"}
                  id={f}
                  name={f}
                  required={f !== "subject"}
                  value={formData[f]}
                  onChange={handleChange}
                  placeholder={
                    f === "name"
                      ? "Your full name"
                      : f === "email"
                      ? "you@example.com"
                      : "Subject (optional)"
                  }
                  className="w-full border-b-2 border-indigo-600 bg-transparent px-2 py-1 text-base placeholder-indigo-400 focus:outline-none focus:border-indigo-800 transition"
                />
              </motion.div>
            ))}

            <motion.div whileFocusWithin={{ scale: 1.02 }}>
              <label
                htmlFor="message"
                className="block text-xs font-semibold uppercase mb-1 tracking-wider text-indigo-900"
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
                placeholder="Write your message here…"
                className="w-full border-b-2 border-indigo-600 bg-transparent px-2 py-1 text-base placeholder-indigo-400 focus:outline-none focus:border-indigo-800 resize-none transition"
              ></textarea>
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-10 py-3 rounded-full border-2 border-indigo-800 text-indigo-800 font-extrabold uppercase tracking-wider hover:bg-indigo-800 hover:text-white transition"
            >
              Send
            </motion.button>
          </form>
        </motion.section>
      </div>
    </div>
  );
}
