import React, { useState, useEffect } from "react";
import LandingPopup from "../components/LandingSectionComp/LandingPopup";
import AppInstallPopup from "../components/LandingSectionComp/AppInstallPopup";

export default function GlobalPopups() {
  const [showLanding, setShowLanding] = useState(false);
  const [showAppInstall, setShowAppInstall] = useState(false);

 useEffect(() => {
  console.log("GlobalPopups mounted"); // 🔹 check if component mounts

  const landingShown = sessionStorage.getItem("landingPopupShown");
  console.log("Landing popup already shown?", landingShown);

  let landingTimer;
  let appTimer;

  if (!landingShown) {
    landingTimer = setTimeout(() => {
      console.log("Showing LandingPopup now"); // 🔹 check if timer fires
      setShowLanding(true);
      sessionStorage.setItem("landingPopupShown", "true");
    }, 3000);
  }

  return () => {
    clearTimeout(landingTimer);
    clearTimeout(appTimer);
  };
}, []);


 const handleLandingClose = () => {
  console.log("LandingPopup closed"); // 🔹 check if onClose fires
  setShowLanding(false);

  if (!sessionStorage.getItem("appInstallPopupShown")) {
    const appTimer = setTimeout(() => {
      console.log("Showing AppInstallPopup now"); // 🔹 check if app install timer fires
      setShowAppInstall(true);
      sessionStorage.setItem("appInstallPopupShown", "true");
    }, 20000);

    window.__appInstallTimer = appTimer;
  }
};

const handleAppInstallClose = () => {
  console.log("AppInstallPopup closed"); // 🔹 check if onClose fires
  setShowAppInstall(false);
  clearTimeout(window.__appInstallTimer);
};


  return (
    <>
      {showLanding && <LandingPopup onClose={handleLandingClose} />}
      {showAppInstall && <AppInstallPopup onClose={handleAppInstallClose} />}
    </>
  );
}
