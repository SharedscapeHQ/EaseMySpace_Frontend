import React, { useEffect } from "react";

function LocationFetcher({ onLocationFetched, onLocationDenied }) {
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      if (onLocationDenied) onLocationDenied();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const baseLocation = { latitude, longitude, accuracy };

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const enrichedLocation = {
            ...baseLocation,
            city: data.address.city || data.address.town || data.address.village || data.address.county || null,
            region: data.address.state || data.address.region || null,
            country: data.address.country || null,
          };
          if (onLocationFetched) onLocationFetched(enrichedLocation);
        } catch (err) {
          console.error("Reverse geocode error:", err);
          if (onLocationFetched) onLocationFetched(baseLocation);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        if (onLocationDenied) onLocationDenied();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [onLocationFetched, onLocationDenied]);

  return null;
}

export default LocationFetcher;
