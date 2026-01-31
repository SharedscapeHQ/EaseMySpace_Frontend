import React, { useState, useEffect } from "react";
import LandingPopup from "../components/LandingSectionComp/LandingPopup";
import AppInstallPopup from "../components/LandingSectionComp/AppInstallPopup";

export default function GlobalPopups() {
  const [showLanding, setShowLanding] = useState(false);
  const [showAppInstall, setShowAppInstall] = useState(false);

 useEffect(() => {

  const landingShown = sessionStorage.getItem("landingPopupShown");

  let landingTimer;
  let appTimer;

  if (!landingShown) {
    landingTimer = setTimeout(() => {
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
  setShowLanding(false);

  if (!sessionStorage.getItem("appInstallPopupShown")) {
    const appTimer = setTimeout(() => {
      setShowAppInstall(true);
      sessionStorage.setItem("appInstallPopupShown", "true");
    }, 15000);

    window.__appInstallTimer = appTimer;
  }
};

const handleAppInstallClose = () => {
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
