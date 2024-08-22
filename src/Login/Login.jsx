import React, { useState } from "react";
import "./Login.css"; // Import the CSS file
import logo from "../assets/iips_logo2.png"; // Corrected the import statement

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate a login process
    if (email && password) {
      alert("Login successful!");
      // Proceed with your login logic here
    } else {
      alert("Please enter both email and password.");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" /> {/* Corrected image tag */}
      <h2>Student: Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
