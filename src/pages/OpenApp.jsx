import { useEffect } from "react";

export default function OpenApp() {
  useEffect(() => {
    // Optional: try opening app via custom scheme (extra safety)
    window.location.href = "easemyspace://open-app";

    // After 1.5s, stay on website (if app not installed)
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2 style={{ fontFamily: "para_font" }}>Opening EaseMySpace App…</h2>
    </div>
  );
}
