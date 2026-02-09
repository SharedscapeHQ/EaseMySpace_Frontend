import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AppRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(ua)) {
      window.location.href = "https://play.google.com/store/apps/details?id=com.easemyspace.app";
    } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      window.location.href = "https://apps.apple.com/in/app/easemyspace/id6758399361";
    } else {
      navigate("/");
    }
  }, [navigate]);

  return <div>Redirecting to the app...</div>;
}
