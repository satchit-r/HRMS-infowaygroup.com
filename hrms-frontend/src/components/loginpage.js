import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/loginpage.css";
import companyLogo from "../styles/Picture1.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const myRef = useRef(null); // Ref for Vanta.js Waves effect

  useEffect(() => {
    if (window.VANTA) {
      window.VANTA.WAVES({
        el: myRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xc4357,
        shininess: 84.0,
        waveHeight: 32.0,
        waveSpeed: 1.3,
        zoom: 0.96,
      });
    }

    return () => {
      if (myRef.current && myRef.current.VANTA) {
        myRef.current.VANTA.destroy();
      }
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      setSuccess("Login successful!");
      console.log("Login successful:", response.data);

      const userRole = response.data.userRole;

      // Pass emailId along with userRole
      navigate("/employee-data", { state: { userRole, emailId: email } });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-page" ref={myRef}>
      <div className="login-container">
        <h2 style={{ color: "white" }}>HRMS</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email" style={{ color: "white" }}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your Email Id"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" style={{ color: "white" }}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
      <div className="logo-container">
        <img src={companyLogo} alt="Company Logo" className="company-logo" />
        <p style={{ color: "white" }}> 2024 Infoway Solutions LLC</p>
      </div>
    </div>
  );
};

export default LoginPage;
