import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    // Get or create visitor ID
    let visitorId = localStorage.getItem("visitor_id");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("visitor_id", visitorId);
    }

    // Function to send tracking data
    const sendTrack = (extraData = {}) => {
      fetch("https://api.easemyspace.in/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitor_id: visitorId,
          ...extraData, // merges latitude/longitude + is_precise
        }),
      }).catch((err) => console.error("Tracking failed:", err));
    };

    // Try to get precise geolocation from browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // ✅ Precise location allowed
          sendTrack({ latitude, longitude, is_precise: true });
        },
        (err) => {
          // console.warn("Geolocation denied, fallback to IP:", err);
          // ✅ Fallback: IP-based location only
          sendTrack({ is_precise: false });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      // ✅ No geolocation support → fallback
      sendTrack({ is_precise: false });
    }
  }, []);

  return null;
}
