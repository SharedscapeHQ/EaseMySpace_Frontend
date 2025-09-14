import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    // Check if we already have a visitor ID
    let visitorId = localStorage.getItem("visitor_id");

    if (!visitorId) {
      // Generate a new UUID for first-time visitors
      visitorId = crypto.randomUUID();
      localStorage.setItem("visitor_id", visitorId);
    }

    // Function to send tracking data
    const sendTrack = (extraData = {}) => {
      fetch("https://api.easemyspace.in/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitor_id: visitorId, ...extraData }),
      }).catch((err) => console.error("Tracking failed:", err));
    };

    // Try to get precise geolocation from browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Send with GPS coords
          sendTrack({ latitude, longitude });
        },
        (err) => {
          console.warn("Geolocation denied, fallback to IP:", err);
          // Fallback: send without coords (server will resolve via IP)
          sendTrack({ repeat: true });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      // No geolocation support → fallback to IP
      sendTrack({ repeat: true });
    }
  }, []);

  return null;
}
