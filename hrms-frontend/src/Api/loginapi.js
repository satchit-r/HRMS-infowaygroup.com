//src/Api/loginapi.js
import React, { useState } from "react";
import { login } from "../Api/loginapi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await login(email, password);
      console.log("Login successful:", response.message);
      // Redirect to dashboard or home page on successful login
      window.location.href = "/home"; // Replace with actual home page route
    } catch (error) {
      setError(error || "An unexpected error occurred.");
    }
  };

  return (
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
