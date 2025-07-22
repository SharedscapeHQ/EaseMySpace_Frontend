import React from "react";
import { Link } from "react-router-dom";
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
  FaUserShield
} from "react-icons/fa";
import brandImg from "/navbar-assets/brand-logo.png";

const icons = [
  { Icon: FaFacebookF, color: "from-blue-600 to-blue-800 border-blue-500/50", url: "https://www.facebook.com/people/easemyspace/61574790907231/" },
  { Icon: FaYoutube, color: "from-red-500 to-red-700 border-red-400/50", url: "https://www.youtube.com/@easemyspace" },
  { Icon: FaInstagram, color: "from-pink-500 to-yellow-500 border-pink-400/50", url: "https://www.instagram.com/easemyspace.in/" },
  { Icon: FaLinkedin, color: "from-indigo-600 to-indigo-800 border-indigo-500/50", url: "https://www.linkedin.com/company/easemyspace" },
];

export default function Footer() {
  return (
    <footer className="relative border-t text-zinc-800 pb-6 px-6 md:px-16 overflow-hidden">
      <div className="relative z-10 max-w-7xl py-10 mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="flex flex-col text-center items-center justify-center">
          <img src={brandImg} alt="EaseMySpace" />
          <p>EaseMySpace simplifies urban living by connecting people with flatmates and rental spaces in metro cities. Hassle-free & seamless.</p>
        </div>

        <div className="col-span-2 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-5">
            <ul className="space-y-3 text-sm font-medium">
              {[
                { label: "Home", to: "/", icon: FaHome },
                { label: "About Us", to: "/about", icon: FaInfoCircle },
                { label: "Listings", to: "/view-properties", icon: FaThList },
                { label: "Contact", to: "/contact", icon: FaPhone },
              ].map(({ label, to, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 group hover:text-blue-500 transition transform hover:scale-105"
                  >
                    <Icon className="text-indigo-400 w-4 h-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="space-y-3 text-sm font-medium">
              {[
                { label: "Cancellation & Refund", to: "/cancellation-refund", icon: FaUndoAlt },
                { label: "Terms & Conditions", to: "/terms-conditions", icon: FaFileContract },
                { label: "Privacy Policy", to: "/privacy-policy", icon: FaUserShield },
              ].map(({ label, to, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 group hover:text-blue-500 transition transform hover:scale-105"
                  >
                    <Icon className="text-indigo-400 w-4 h-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-4">
            {icons.map(({ Icon, color, url }, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ clipPath: "url(#squircleClip)" }}
                className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg cursor-pointer border transform transition duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
              >
                <Icon className="text-white text-xl" />
              </a>
            ))}
          </div>

          <ul className="text-center text-zinc-800 text-sm space-y-3 mt-2">
            <li className="flex gap-2 justify-center items-center">
              <span className="inline-block w-2 h-2 mt-1 bg-green-400 rounded-full animate-pulse" />
              <span>hello@easemyspace.in</span>
            </li>
            <li className="flex gap-2 justify-center items-center">
              <span className="text-lg">📞</span>
              <span>+91 9867637509, +91 9004463371</span>
            </li>
            <li className="flex gap-2 justify-center items-center">
              <span className="text-lg">🌐</span>
              <span>WeWork, 1st Floor, 264-265, Dr Annie Besant Rd, Worli, Mumbai 400025</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-white/20 pt-4 text-center text-sm text-zinc-800">
        © {new Date().getFullYear()} EaseMySpace.in — All rights reserved.
      </div>
    </footer>
  );
}
