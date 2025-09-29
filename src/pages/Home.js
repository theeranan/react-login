import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Home Page</h1>
      <p style={styles.paragraph}>
        This is a simple React home page. You can navigate to other sections
        using the links below.
      </p>

      <div style={styles.links}>
        <Link to="/login" style={styles.link}>
          Go to Login
        </Link>
        <Link to="/profile" style={styles.link}>
          Go to Profile
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  paragraph: {
    fontSize: "1.2rem",
    marginBottom: "30px",
  },
  links: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  link: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
  },
};
