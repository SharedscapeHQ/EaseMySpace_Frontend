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
  FaBriefcase,
  FaUsers,
  FaTrashAlt
} from "react-icons/fa";
import playBadge from "/app_assets/GetItOnGooglePlay_Badge_Web_color_English.svg";
import AppleBadge from "/app_assets/AppleStoreButton.png";
import { FaApple } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { FaXTwitter } from "react-icons/fa6";
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
    {
    Icon: FaXTwitter,
    color: "from-zinc-700 to-black border-zinc-700/50",
    url: "https://twitter.com/easemyspace",
  },
];

export default function Footer() {
  return (
<footer
  style={{ fontFamily: "para_font" }}
  className="bg-white dark:bg-zinc-200 border-t border-zinc-200  py-10 overflow-x-hidden text-zinc-800 "
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
      <p className="text-sm leading-relaxed text-zinc-700 " itemProp="description">
        EaseMySpace™ connects users with verified flatmates, rental flats, shared accommodations, and PGs in Mumbai. Find your next home quickly, hassle-free.
      </p>
    {/* App Download Section */}
<div className="mt-6 flex items-center gap-6">

  {/* Buttons */}
  <div className="flex flex-col gap-4">

    {/* Play Store */}
    <a
      href="https://play.google.com/store/apps/details?id=com.easemyspace.app"
      target="_blank"
      rel="noreferrer"
    >
      <img
        src={playBadge}
        alt="Get it on Google Play"
        className="h-10"
      />
    </a>

    {/* Apple Store (Disabled) */}
    <div className="relative w-fit cursor-not-allowed">
      <img
        src={AppleBadge}
        alt="Download on the App Store"
        className="h-10 grayscale opacity-60"
      />

      {/* Coming Soon Tag (full opacity) */}
      <span className="absolute -top-3 -right-2 bg-black text-white text-[10px] px-2 py-[2px] rounded-full whitespace-nowrap">
        Coming Soon
      </span>
    </div>

  </div>

  {/* QR Code */}
  <div className="hidden sm:flex flex-col items-center bg-gray-50 border rounded-lg p-2 shadow-sm">
    <QRCodeCanvas
      value="https://play.google.com/store/apps/details?id=com.easemyspace.app"
      size={80}
    />
    <span className="text-[11px] text-gray-500 mt-1 whitespace-nowrap">
      Scan to get the app
    </span>
  </div>

</div>



      <meta itemProp="name" content="EaseMySpace" />
      <meta itemProp="url" content="https://easemyspace.in" />
      <meta itemProp="founder" content="EaseMySpace Team" />
      <meta
  itemProp="address"
  content="WeWork Vaswani Chambers, Plot 264/265, Dr Annie Besant Road, Worli Shivaji Nagar, Worli Colony, Mumbai, Maharashtra 400030"
/>

    </div>

    {/* Quick Links Section */}
    <nav className="grid grid-cols-2 gap-6 text-sm font-medium" aria-label="Footer Navigation">
      <div>
        <h3 className="text-base font-semibold mb-3 text-zinc-900 ">Quick Links</h3>
        <ul className="space-y-3">
          {[
            { label: "Home ", to: "/", icon: FaHome },
            { label: "About Us ", to: "/about", icon: FaInfoCircle },
            { label: "Listings ", to: "/view-properties", icon: FaThList },
            { label: "Contact ", to: "/contact", icon: FaPhone },
            { label: "Careers", to: "/careers", icon: FaBriefcase },
            { label: "Life at EMS", to: "/life-at-ems", icon: FaUsers }
          ].map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex items-center gap-2 hover:text-blue-500  transition"
              >
                <Icon className="text-blue-500  w-4 h-4" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-base font-semibold mb-3 text-zinc-900 ">Legal & Policies</h3>
        <ul className="space-y-3">
          {[
            { label: "Cancellation & Refund Policy", to: "/cancellation-refund", icon: FaUndoAlt },
            { label: "Terms & Conditions", to: "/terms-conditions", icon: FaFileContract },
            { label: "Privacy Policy ", to: "/privacy-policy", icon: FaUserShield },
             {
      label: "Account Deletion",
      to: "/account-deletion",
      icon: FaTrashAlt, 
    },
          ].map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex items-center gap-2 hover:text-blue-500  transition"
              >
                <Icon className="text-blue-500  w-4 h-4" />
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
            className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg border border-zinc-200  cursor-pointer transition hover:scale-110 hover:-translate-y-2`}
            itemProp="sameAs"
            aria-label={`Follow EaseMySpace™ on ${url.split(".")[1]}`}
          >
            <Icon className="text-white text-xl" />
          </a>
        ))}
      </div>

      {/* Contact Info */}
      <div className="text-sm space-y-4 ml-32 max-w-xs w-full text-zinc-700 " itemProp="contactPoint" itemScope itemType="https://schema.org/ContactPoint">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <a href="mailto:support@easemyspace.in" className="hover:underline" itemProp="email">
            support@easemyspace.in
          </a>
        </div>

        <div className="flex items-center gap-2">
          <FaPhone className="text-blue-500  w-4 h-4 mt-1" />
          <a href="tel:+919004463371" className="hover:underline" itemProp="telephone">
            +91 9004463371
          </a>
        </div>

        <div className="flex items-center gap-2 ">
          <FaMapMarkerAlt className="text-blue-500  w-5 h-5 mt-1" />
         <span>
  WeWork Vaswani Chambers, Plot 264/265,<br />
  Dr Annie Besant Road,<br />
  Worli Shivaji Nagar, Worli Colony,<br />
  Mumbai 400030
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

  <div className="mt-10 pt-4 flex justify-center items-center border-t border-zinc-200  text-center text-sm text-zinc-600 ">
    © {new Date().getFullYear()} EaseMySpace™ — All rights reserved.
  </div>
</footer>



  );
}
