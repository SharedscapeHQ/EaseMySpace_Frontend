import React, { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
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
    <div style={{ fontFamily: "para_font" }} className="flex flex-col lg:flex-row items-center justify-center px-6 md:px-16 py-2 gap-8">

      {/* SEO Helmet */}
      <Helmet>
        <title>Contact EaseMySpace™ | PGs, Flats & Flatmates in Mumbai</title>
        <meta
          name="description"
          content="Contact EaseMySpace™ for verified PGs, flatmates, and vacant flats in Mumbai. Post your property or find rental options in Andheri, Goregaon, Ghatkopar, and all Mumbai locations."
        />
        <link rel="canonical" href="https://easemyspace.in/contact" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "EaseMySpace",
            "url": "https://easemyspace.in",
            "logo": "https://easemyspace.in/navbar-assets/brand-logo.png",
            "description": "EaseMySpace provides verified PGs, flats, and flatmates in Mumbai – broker-free rentals.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "WeWork, 1st Floor, 264–265, Dr Annie Besant Rd, Worli",
              "addressLocality": "Mumbai",
              "addressRegion": "Maharashtra",
              "postalCode": "400030",
              "addressCountry": "IN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-9004463371",
              "contactType": "Customer Service",
              "email": "support@easemyspace.in"
            }
          }
        `}</script>
      </Helmet>

      {/* Left Info Panel */}
      <div className="lg:w-1/2 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="justify-center hidden lg:flex w-full max-w-md h-64 md:h-80"
        >
          <img
            src={heroImg}
            alt="Contact EaseMySpace™ for PGs, Flats and Flatmates in Mumbai"
            className="w-full h-full  object-contain"
          />
        </motion.div>

        {/* Info Card */}
        <motion.aside
          initial={{ opacity: 0, x: -60, rotate: -3 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-blue-600 text-white rounded-lg p-6 md:p-8 shadow-2xl flex-shrink-0 w-full max-w-md"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide drop-shadow-md text-center">
            Contact Us
          </h1>
          <div className="mt-4 space-y-2 text-sm md:text-base font-medium text-center">
            <div>
              <span style={{ fontFamily: "heading_font" }}>Address :</span>{" "}
              WeWork, 1st Floor, 264–265, Dr Annie Besant Rd, Worli, Mumbai 400030
            </div>
            <div>
              <span style={{ fontFamily: "heading_font" }}>Phone:</span> +91 9004463371
            </div>
            <div>
              <span style={{ fontFamily: "heading_font" }}>Email:</span> support@easemyspace.in
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Right Form */}
      <motion.section
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/2 flex items-center justify-center w-full"
      >
        <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-gray-200 shadow-xl flex flex-col justify-between">
          <h2 className="text-3xl font-extrabold text-blue-600 pb-8 text-center">
            Get in Touch
          </h2>

          {submitted && (
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              className="mb-4 bg-green-500 text-white px-5 py-3 rounded-xl text-center font-semibold shadow-md"
            >
              Thank you! Your message has been sent.
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white text-gray-500 text-sm px-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 outline-none py-3 px-4 rounded-xl shadow-sm focus:border-blue-500 focus:shadow-md transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white text-gray-500 text-sm px-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 outline-none py-3 px-4 rounded-xl shadow-sm focus:border-blue-500 focus:shadow-md transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white text-gray-500 text-sm px-1">
                Subject (optional)
              </label>
              <input
                type="text"
                name="subject"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 outline-none py-3 px-4 rounded-xl shadow-sm focus:border-blue-500 focus:shadow-md transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white text-gray-500 text-sm px-1">
                Your Message
              </label>
              <textarea
                name="message"
                rows="5"
                placeholder="Type your message here..."
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 outline-none py-3 px-4 rounded-xl shadow-sm focus:border-blue-500 focus:shadow-md transition-all duration-200 resize-none"
              ></textarea>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-blue-500 text-white py-3 rounded-2xl hover:shadow-xl transition-all duration-200"
            >
              Send Message
            </motion.button>
          </form>
        </div>
      </motion.section>
    </div>
  );
}
