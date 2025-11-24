import React from "react";
import { useNavigate } from "react-router-dom";
import NotFoundVid from "/not-found-page.mov";

function NotFound() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* Background Video */}
      <video
        src={NotFoundVid}
        autoPlay
        loop
        muted
        playsInline
        style={styles.video}
      />

      {/* Overlay Content */}
      <div style={styles.overlay}>
        <h1 style={styles.heading}>404 - Page Not Found</h1>
        <p style={styles.message}>
          Oops! The page you are looking for doesn't exist.
        </p>
        <button style={styles.button} onClick={goHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    objectFit: "cover",
    zIndex: -1,
  },
  overlay: {
    position: "relative",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "20px",
  },
  heading: {
    fontSize: "3rem",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  message: {
    fontSize: "1.2rem",
    marginBottom: "20px",
    maxWidth: "600px",
  },
  button: {
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
    transition: "all 0.2s ease-in-out",
  },
};

export default NotFound;
