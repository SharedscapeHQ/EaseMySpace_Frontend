import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { FaApple } from "react-icons/fa";



/* ✅ IMPORT IMAGES (FROM src FOLDER) */
import playBadge from "/app_assets/GetItOnGooglePlay_Badge_Web_color_English.svg";
import androidPhone from "/app_assets/android-phone/android_portrait.png";
import iphonePhone from "/app_assets/iphone/iphone-portrait.png";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.easemyspace.app";

export default function AppDownloadSection() {
  return (
  <section className="bg-white py-20 md:py-28 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 md:gap-20 items-center">

      {/* ---------------- LEFT CONTENT ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-center md:text-left"
      >
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Download the <br className="hidden md:block" /> EaseMySpace App
        </h2>

        <p className="text-gray-600 text-base md:text-lg mb-8 max-w-xl mx-auto md:mx-0">
          Book rooms, pay rent, sign agreements and manage your stay
          everything in one powerful app.
        </p>

        <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-6 md:gap-8">

          {/* PLAY STORE BADGE */}
          <motion.a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={playBadge}
              alt="Get it on Google Play"
              className="h-14 md:h-16"
            />
          </motion.a>

          {/* QR CODE (hide on very small screens) */}
          <div className="hidden sm:block bg-gray-50 border rounded-xl p-4 text-center shadow-sm">
            <QRCodeCanvas value={PLAY_STORE_URL} size={100} />
            <p className="text-gray-600 text-sm mt-2">
              Scan to download
            </p>
          </div>

          {/* IOS COMING SOON */}
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <FaApple className="text-lg" />
            <span>iOS App Coming Soon</span>
          </div>

        </div>
      </motion.div>

      {/* ---------------- RIGHT PHONES ---------------- */}
      <div className="relative flex justify-center items-center mt-14 md:mt-0">

        {/* ANDROID PHONE */}
        <motion.img
          src={androidPhone}
          alt="EaseMySpace Android App"
          className="w-52 sm:w-60 md:w-72 z-10 drop-shadow-2xl"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          animate={{ y: [0, -10, 0] }}
          style={{
            animationDuration: "5s",
            animationIterationCount: "infinite",
          }}
        />

        {/* IPHONE PHONE (hide on small screens) */}
        <motion.img
          src={iphonePhone}
          alt="EaseMySpace iOS App Coming Soon"
          className="hidden sm:block w-44 md:w-64 absolute -right-6 md:-right-10 top-10 md:top-14 opacity-90 drop-shadow-xl"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          viewport={{ once: true }}
          animate={{ y: [0, -14, 0] }}
          style={{
            animationDuration: "6s",
            animationIterationCount: "infinite",
          }}
        />

        {/* COMING SOON TAG */}
        <span className="absolute bottom-2 sm:bottom-8 right-1 sm:right-2 bg-black text-white px-3 py-1 text-xs rounded-full">
          iOS Coming Soon
        </span>
      </div>

    </div>
  </section>
);

}
