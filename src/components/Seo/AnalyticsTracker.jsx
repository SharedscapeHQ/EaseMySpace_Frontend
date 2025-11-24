import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    window.gtag("config", "G-HL68GPC3EL", {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null;
}

export default AnalyticsTracker;
