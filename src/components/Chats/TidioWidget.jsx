// components/TidioWidget.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function TidioWidget() {
  const location = useLocation();

  useEffect(() => {

    // 1️⃣ Remove old Tidio script + iframe
    document.querySelectorAll('script[src*="tidio.co"]').forEach((s) => s.remove());
    document.querySelectorAll('iframe[id^="tidio-chat"]').forEach((iframe) => iframe.remove());
    delete window.tidioChatApi;

    // 2️⃣ Inject fresh Tidio script
    const script = document.createElement("script");
    script.src = "//code.tidio.co/dlcg4d10vqk3juvlsfmh9e7figbdvllf.js";
    script.async = true;
    document.body.appendChild(script);
  }, [location.pathname]);

  return null;
}
