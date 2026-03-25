import React, { useState } from "react";
import axios from "axios";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Save token
      localStorage.setItem("token", res.data.token);

      alert("✅ Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message || // backend message
        err.response?.data ||          // plain string response
        "❌ Login failed"
      );
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <Link to="/signup" className="link">
        Don't have an account? Sign up
      </Link>
    </div>
  );
}