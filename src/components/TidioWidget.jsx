import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function TidioWidget() {
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const excludedPaths = ["/login", "/register"];

  useEffect(() => {
    if (excludedPaths.includes(location.pathname)) return;

    if (window.tidioScriptLoaded) {
      hideTidioBubble();
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "//code.tidio.co/dlcg4d10vqk3juvlsfmh9e7figbdvllf.js";
    script.async = true;
    document.body.appendChild(script);
    window.tidioScriptLoaded = true;

    const checkInterval = setInterval(() => {
      if (window.tidioChatApi) {
        hideTidioBubble();
        setLoaded(true);
        clearInterval(checkInterval);
      }
    }, 300);

    return () => {
      clearInterval(checkInterval);
      const tidioIframe = document.querySelector('iframe[src*="tidio"]');
      if (tidioIframe) tidioIframe.remove();
      script.remove();
      window.tidioScriptLoaded = false;
      setLoaded(false);
    };
  }, [location.pathname]);

  // Helper to hide default Tidio bubble completely
  const hideTidioBubble = () => {
    try {
      window.tidioChatApi?.hide();

      // Additional CSS-based hiding (in case API fails silently)
      const style = document.createElement("style");
      style.innerHTML = `
        .tidio-chat-launcher,
        .tidio-chat {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    } catch (e) {
      console.warn("Tidio hide failed:", e);
    }
  };

  if (!loaded || excludedPaths.includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          window.tidioChatApi?.show();
          setExpanded(false);
        }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className="w-14 h-14 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden hover:bg-indigo-700 transition duration-300"
      >
        {/* Emoji speech bubble */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: -70 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              className="absolute right-16 bg-white text-indigo-700 px-4 py-2 rounded-2xl shadow-md font-medium text-sm whitespace-nowrap"
            >
              Chat with us 👋
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat icon emoji */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: expanded ? 10 : 0 }}
          transition={{
            repeat: expanded ? Infinity : 0,
            repeatType: "reverse",
            duration: 0.4,
          }}
          className="text-white text-xl"
        >
          💬
        </motion.div>
      </motion.button>
    </div>
  );
}
