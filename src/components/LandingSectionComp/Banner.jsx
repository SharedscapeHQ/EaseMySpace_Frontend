import React, { useState } from "react";
import { saveRequest } from "../../api/requestApi";
import leftImg from "/CTA-assets/cta2.png";
import rightImg from "/CTA-assets/cta.png";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { IoSparklesOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa"

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
      <Helmet>
        <title>Find Flatmates, PGs & Vacant Flats in Mumbai | EaseMySpace™</title>
        <meta
          name="description"
          content="Looking for a flatmate or vacant flats in Mumbai? Talk to our experts for verified options in Andheri, Bandra, Juhu and more. Zero brokerage and personalized assistance by EaseMySpace."
        />
        <meta
          name="keywords"
          content="flatmate in Mumbai, PG in Andheri, flats for rent Mumbai, paying guest Mumbai, shared flats Mumbai"
        />
        {/* Open Graph */}
        <meta property="og:title" content="Find Flatmates, PGs & Vacant Flats in Mumbai | EaseMySpace™" />
        <meta
          property="og:description"
          content="Looking for a flatmate or vacant flats in Mumbai? Get personalized assistance and verified listings with EaseMySpace™."
        />
        <meta property="og:image" content="/CTA-assets/cta2.png" />
        <meta property="og:url" content="https://easemyspace.in" />
        <meta property="og:type" content="website" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Find Flatmates, PGs & Vacant Flats in Mumbai | EaseMySpace™" />
        <meta
          name="twitter:description"
          content="Looking for a flatmate or vacant flats in Mumbai? Get personalized assistance and verified listings with EaseMySpace™."
        />
        <meta name="twitter:image" content="/CTA-assets/cta2.png" />
        {/* Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "EaseMySpace",
              "url": "https://easemyspace.in",
              "logo": "https://easemyspace.in/navbar-assets/brand-logo.png"
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://easemyspace.in"
                }
              ]
            }
          `}
        </script>
      </Helmet>

      {/* Banner Section */}
      <div
  style={{ fontFamily: "universal_font" }}
  className="flex justify-between items-center bg-blue-200 dark:bg-zinc-600 gap-6 px-3 lg:px-10 border-2 border-transparent dark:border-zinc-700 rounded-2xl py-5 lg:max-w-7xl mx-auto overflow-hidden relative transition-colors duration-300"
>
  <img
    src={leftImg}
    alt="Search flatmates in Mumbai"
    className="hidden absolute -left-10 md:block w-80 object-contain opacity-80 dark:opacity-60"
  />

  <div className="flex flex-col items-center text-center gap-4 flex-1 z-10">
    <h1 style={{ fontFamily: "para_font" }} className="text-lg md:text-xl font-medium text-zinc-900 dark:text-white">
      Looking for a flatmate or have a room to rent in Mumbai?
    </h1>
    <h2 style={{ fontFamily: "para_font" }} className="text-sm text-zinc-700 dark:text-zinc-300 max-w-md mx-auto">
      Talk to our experts for complete guidance and get the best verified options tailored to your needs
    </h2>

    <div className="flex items-center justify-center gap-5">
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Talk to an expert"
        className="bg-blue-800 dark:bg-blue-600 text-white px-6 py-3 rounded-lg lg:text-base text-xs shadow hover:bg-blue-900 dark:hover:bg-blue-700 transition"
      >
        Talk to an expert
      </button>
      <Link
        to="/add-properties"
        className="bg-green-600 dark:bg-green-500 text-white px-6 py-3 rounded-lg lg:text-base text-xs shadow hover:bg-green-700 dark:hover:bg-green-600 transition"
        aria-label="List Property"
      >
        List Property
      </Link>
    </div>
  </div>

  <img
    src={rightImg}
    alt="Room rental assistance in Mumbai"
    className="hidden absolute -right-7 md:block w-80 object-contain opacity-80 dark:opacity-60"
  />
</div>


      {/* Popup Modal */}
      {isOpen && (
       

<div className="fixed inset-0 bg-black  bg-opacity-70 flex justify-center items-center z-50 px-4">
  <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl relative overflow-hidden flex flex-col md:flex-row">
    <button
      onClick={() => setIsOpen(false)}
      className="absolute top-3 right-3 text-zinc-500 hover:text-black dark:hover:text-white text-lg"
      aria-label="Close popup"
    >
      ✕
    </button>

    {/* Left Section */}
    <div className="bg-blue-50 p-6 md:w-1/2 dark:bg-zinc-700 dark:text-white border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-center text-center md:text-left">
      <h3 className="text-zinc-800 dark:text-zinc-200  font-semibold text-lg mb-4 flex items-center justify-center md:justify-start gap-1">
        Why Choose EaseMySpace™? <IoSparklesOutline className="text-blue-500 dark:text-blue-100 text-lg" />
      </h3>

      <ul className="space-y-2 text-sm text-zinc-600 text-left mx-auto md:mx-0 w-fit">
        <li className="flex items-center gap-2 dark:text-zinc-200">
          <IoCheckmarkCircleOutline className="text-green-600 dark:text-green-200" />
          Zero Brokerage – Direct Connect with Owners
        </li>
        <li className="flex items-center gap-2 dark:text-zinc-200">
          <IoCheckmarkCircleOutline className="text-green-600 dark:text-green-200" />
          Largest Network of Flatmates & Vacant Rooms
        </li>
        <li className="flex items-center gap-2 dark:text-zinc-200">
          <IoCheckmarkCircleOutline className="text-green-600 dark:text-green-200" />
          Verified & Active Listings Only
        </li>
        <li className="flex items-center gap-2 dark:text-zinc-200">
          <IoCheckmarkCircleOutline className="text-green-600 dark:text-green-200" />
          Personalized Assistance by EMS Experts
        </li>
      </ul>

      <div className="mt-6 text-sm text-zinc-500 dark:text-zinc-200 text-center md:text-left flex items-center justify-center md:justify-start gap-1">
        <FaStar className="text-yellow-500" />
        India’s Fastest Growing Urban Living Platform
        <FaStar className="text-yellow-500" />
      </div>
    </div>

    {/* Right Section */}
    <div className="p-6 md:w-1/2 dark:bg-zinc-900 dark:text-white flex flex-col justify-center items-center text-center">
      {!submitted ? (
        <>
          <h2 style={{ fontFamily: "para_font" }} className="text-xl font-semibold text-zinc-800 dark:text-white mb-2">
            How can we help you?
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">
            Speak with a space solution expert.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3 dark:text-zinc-900 w-full max-w-sm">
            <input
              type="text"
              name="name"
              placeholder="*Enter your name"
              aria-label="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="tel"
              name="phone"
              placeholder="*Enter your mobile number"
              aria-label="Enter your mobile number"
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
              placeholder="*Enter your email"
              aria-label="Enter your email"
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
        <div className="text-center text-green-600 dark:text-green-200 font-medium text-lg">
          ✅ We’ve received your request!
          <p className="text-zinc-600 text-sm mt-2">
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
