import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ANDROID_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.easemyspace.app";
const IOS_APPLE_URL = "https://apps.apple.com/in/app/easemyspace/id6758399361";

export default function InstallAppBanner({ onClose, onHeightChange }) {
  const [visible, setVisible] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const [storeUrl, setStoreUrl] = useState(ANDROID_PLAY_URL);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("install_banner_dismissed");
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (!dismissed && isMobile) {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      if (/android/i.test(userAgent)) {
        setStoreUrl(ANDROID_PLAY_URL);
      } else if (/iPad|iPhone|iPod|Macintosh/i.test(userAgent)) {
        setStoreUrl(IOS_APPLE_URL);
      } else {
        // Default to Android if unsure
        setStoreUrl(ANDROID_PLAY_URL);
      }

      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      const height = document.getElementById("install-banner")?.offsetHeight || 48;
      setBannerHeight(height);
      onHeightChange?.(height);
    } else {
      onHeightChange?.(0);
    }
  }, [visible, onHeightChange]);

  if (!visible) return null;

  const closeBanner = () => {
    sessionStorage.setItem("install_banner_dismissed", "true");
    setVisible(false);
    onClose?.();
  };

  return (
    <motion.div
      id="install-banner"
      className="w-full z-[60] h-auto bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between px-3 h-12 max-w-screen-xl mx-auto">
        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={closeBanner}
            className="text-gray-500 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>

          <img
            src="/navbar-assets/brand_favicon_new.jpeg"
            alt="EaseMySpace"
            className="w-8 h-8 rounded"
          />

          <div className="leading-tight truncate">
            <div className="text-xs text-gray-900">Get the app</div>
            <div className="text-[8px] text-gray-500 truncate">
              Easiest way to access all features at your fingertips
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-md whitespace-nowrap"
        >
          Install
        </a>
      </div>
    </motion.div>
  );
}