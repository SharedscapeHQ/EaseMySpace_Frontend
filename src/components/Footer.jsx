import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaHome,
  FaInfoCircle,
  FaThList,
  FaPhone,
  FaUndoAlt,
  FaFileContract,
  FaUserShield,
  FaMapMarkerAlt,
  FaEnvelope,
  FaBriefcase
} from "react-icons/fa";
import brandImg from "/navbar-assets/brand-logo.png";

const icons = [
  {
    Icon: FaFacebookF,
    color: "from-blue-600 to-blue-800 border-blue-500/50",
    url: "https://www.facebook.com/people/easemyspace/61574790907231/",
  },
  {
    Icon: FaYoutube,
    color: "from-red-500 to-red-700 border-red-400/50",
    url: "https://www.youtube.com/@easemyspace",
  },
  {
    Icon: FaInstagram,
    color: "from-pink-500 to-yellow-500 border-pink-400/50",
    url: "https://www.instagram.com/easemyspace.in/",
  },
  {
    Icon: FaLinkedin,
    color: "from-indigo-600 to-indigo-800 border-indigo-500/50",
    url: "https://www.linkedin.com/company/easemyspace",
  },
  {
    Icon: FaWhatsapp,
    color: "from-green-400 to-green-600 border-green-500/50",
    url: "https://wa.me/919004463371", },
];

export default function Footer() {
  return (
<footer
  style={{ fontFamily: "para_font" }}
  className="bg-white border-t border-zinc-200 py-10 overflow-x-hidden text-zinc-800"
  itemScope
  itemType="https://schema.org/Organization"
>
  <div className="mx-auto lg:px-20 px-3 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 items-start">

    {/* Brand Section */}
    <div className="flex flex-col justify-center lg:w-[80%] w-auto items-center gap-4">
      <img
        src={brandImg}
        alt="EaseMySpace – Verified Flatmates, PGs, Rental Flats, and Shared Rooms in Mumbai"
        className="w-40 lg:mr-10"
        itemProp="logo"
      />
      <p className="text-sm leading-relaxed" itemProp="description">
        EaseMySpace connects users with verified flatmates, rental flats, shared accommodations, and PGs in Mumbai. Find your next home quickly, hassle-free.
      </p>
      <meta itemProp="name" content="EaseMySpace" />
      <meta itemProp="url" content="https://easemyspace.in" />
      <meta itemProp="founder" content="EaseMySpace Team" />
      <meta itemProp="address" content="WeWork, 1st Floor, 264–265, Dr Annie Besant Rd, Worli, Mumbai 400025" />
    </div>

    {/* Quick Links Section */}
    <nav className="grid grid-cols-2 gap-6 text-sm font-medium" aria-label="Footer Navigation">
      <div>
        <h3 className="text-base font-semibold mb-3">Quick Links</h3>
        <ul className="space-y-3">
          {[
            { label: "Home ", to: "/", icon: FaHome },
            { label: "About Us ", to: "/about", icon: FaInfoCircle },
            { label: "Listings ", to: "/view-properties", icon: FaThList },
            { label: "Contact ", to: "/contact", icon: FaPhone },
            { label: "Careers", to: "/careers", icon: FaBriefcase }
          ].map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex items-center gap-2 hover:text-blue-500 transition"
              >
                <Icon className="text-blue-500 w-4 h-4" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-base font-semibold mb-3">Legal & Policies</h3>
        <ul className="space-y-3">
          {[
            { label: "Cancellation & Refund Policy", to: "/cancellation-refund", icon: FaUndoAlt },
            { label: "Terms & Conditions", to: "/terms-conditions", icon: FaFileContract },
            { label: "Privacy Policy ", to: "/privacy-policy", icon: FaUserShield },
          ].map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex items-center gap-2 hover:text-blue-500 transition"
              >
                <Icon className="text-blue-500 w-4 h-4" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>

    {/* Contact + Social Icons */}
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="flex gap-4">
        {icons.map(({ Icon, color, url }, idx) => (
          <a
            key={idx}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg border cursor-pointer transition hover:scale-110 hover:-translate-y-2`}
            itemProp="sameAs"
            aria-label={`Follow EaseMySpace on ${url.split(".")[1]}`}
          >
            <Icon className="text-white text-xl" />
          </a>
        ))}
      </div>

      {/* Contact Info */}
      <div className="text-sm space-y-4 ml-32 max-w-xs w-full" itemProp="contactPoint" itemScope itemType="https://schema.org/ContactPoint">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <a href="mailto:support@easemyspace.in" className="hover:underline" itemProp="email">
            support@easemyspace.in
          </a>
        </div>

        <div className="flex items-center gap-2">
          <FaPhone className="text-blue-500 w-4 h-4 mt-1" />
          <a href="tel:+919004463371" className="hover:underline" itemProp="telephone">
            +91 9004463371
          </a>
        </div>

        <div className="flex items-center gap-2 ">
          <FaMapMarkerAlt className="text-blue-500 w-5 h-5 mt-1" />
          <span>
            WeWork, 1st Floor, 264–265,<br />
            Dr Annie Besant Rd,<br />
            Worli, Mumbai 400025
          </span>
        </div>
      </div>
    </div>
  </div>

  {/* Hidden keyword-rich internal links (for SEO, not visible) */}
  <div className="sr-only">
    <Link to="/pgs">PG Listings Mumbai</Link>
    <Link to="/flatmates">Flatmate Finder Mumbai</Link>
    <Link to="/flats">Rental Flats in Mumbai</Link>
    <Link to="/shared-rooms">Shared Rooms in Mumbai</Link>
  </div>

  <div className="mt-10 pt-4 flex justify-center items-center border-t text-center text-sm text-zinc-600">
    © {new Date().getFullYear()} EaseMySpace.in — All rights reserved.
  </div>
</footer>


  );
}
