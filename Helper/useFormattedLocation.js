import { useEffect, useState } from "react";

const GOOGLE_PLACES_API_KEY = "AIzaSyARyFU8-dg2b25qj4bq8Vhp3K4-LCoL57U";

export function useFormattedLocation(location, pincode) {
  const [displayLocation, setDisplayLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pincode) {
      setDisplayLocation(location || null);
      return;
    }

    const fetchLocation = async () => {
      setLoading(true);
      try {
        const geoRes = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=${GOOGLE_PLACES_API_KEY}`
        );
        const geoData = await geoRes.json();

        if (!geoData.results?.length) return;

        const { lat, lng } = geoData.results[0].geometry.location;

        const revRes = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_PLACES_API_KEY}`
        );
        const revData = await revRes.json();

        if (!revData.results?.length) return;

        const comp = revData.results[0].address_components;

        const area =
          comp.find(
            (ac) =>
              ac.types.includes("sublocality_level_1") ||
              ac.types.includes("neighborhood") ||
              ac.types.includes("locality")
          )?.long_name || null;

        const division =
          comp.find((ac) =>
            ac.types.includes("administrative_area_level_3")
          )?.long_name ||
          comp.find((ac) =>
            ac.types.includes("administrative_area_level_2")
          )?.long_name ||
          null;

        setDisplayLocation([area, division].filter(Boolean).join(", "));
      } catch (err) {
        console.error("Location fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [location, pincode]);

  return { displayLocation, loading };
}
