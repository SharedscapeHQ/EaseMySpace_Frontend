import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.message}>
        Oops! The page you are looking for doesn't exist.
      </p>
      <button style={styles.button} onClick={goHome}>
        Go to Home
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#f5f5f5',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '10px',
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default NotFound;
