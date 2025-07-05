import React from "react";
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
    <footer className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 text-white pt-32 pb-4 px-6 md:px-16 overflow-hidden">

      {/* Diagonal Top Cut */}
      <svg
        className="absolute top-0 left-0 w-full h-20 text-white fill-current rotate-180 z-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon points="0,100 100,0 100,100" />
      </svg>

      {/* Abstract Background Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-white rounded-full blur-[120px] opacity-30 z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-pink-500 rounded-full blur-[120px] opacity-30 z-0" />

      {/* Grid Content */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
         {/* Brand */}
        <a href="" className=" w-full h-full rounded-xl flex items-center justify-center">
          <img src={brandImg} alt="" className="bg-white rounded-xl" />
        </a>

        {/* Quick Links */}
        <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 hover:shadow-xl transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-3 text-white/90 text-sm font-medium">
            {[
              { label: "Home", href: "/", icon: FaHome },
              { label: "About Us", href: "/about", icon: FaInfoCircle },
              { label: "Listings", href: "/view-properties", icon: FaThList },
              { label: "Contact", href: "/contact", icon: FaPhone },
              { label: "Cancellation & Refund", href: "/cancellation-refund", icon: FaUndoAlt },
              { label: "Terms & Conditions", href: "/terms-conditions", icon: FaFileContract },
              { label: "Privacy Policy", href: "/privacy-policy", icon: FaUserShield },
            ].map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  className="flex items-center gap-2 relative group hover:text-white transition transform hover:scale-105"
                  title={label}
                >
                  <Icon className="text-indigo-400 w-4 h-4 flex-shrink-0" />
                  {label}
                  <span className="block h-0.5 bg-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left absolute bottom-0 left-0 right-0"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 hover:shadow-xl transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Contact</h2>
          <ul className="text-white/80 text-sm space-y-3">
            <li className="flex gap-4 items-start ml-2">
              <span className="inline-block w-2 h-2 mt-1 bg-green-400 rounded-full animate-pulse" />
              <span>hello@easemyspace.in</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-lg">📞</span>
              <span>+91 9867637509, +91 9004463371</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-lg">🌐</span>
              <span>WeWork, 1st Floor, 264–265, Dr Annie Besant Rd, Worli, Mumbai 400025</span>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div className="backdrop-blur-md p-6 rounded-xl flex items-center justify-center flex-col transition-shadow max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-white mb-5">Connect With Us</h2>
          <div className="flex items-center gap-4">
            {icons.map(({ Icon, color, url }, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ clipPath: "url(#squircleClip)" }}
                className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg cursor-pointer border transform transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
              >
                <Icon className="text-white text-2xl" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider & Copyright */}
      <div className="mt-16 border-t border-white/20 pt-5 text-center text-sm text-white/60 relative z-10">
        © {new Date().getFullYear()} EaseMySpace.in — All rights reserved.
      </div>
    </footer>
  );
}
