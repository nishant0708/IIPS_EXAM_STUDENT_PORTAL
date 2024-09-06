import React, { useState } from "react";
import "./Login.css"; // Import the CSS file
import logo from "../assets/iips_logo2.png"; // Corrected the import statement
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rollno, setRollNo] = useState("");
  const [enrollno, setEnrollNo] = useState("");
  const [subcode, setSubcode] = useState("");
  const [subname, setSubname] = useState("");
  const [date, setDate] = useState("");
  const [d, setDisplay] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate a login process
    if (name && password && rollno && enrollno && subcode && subname && date) {
      alert("Login successful!");
      // Proceed with your login logic here
    } else {
      alert("Please enter all fields!!!");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" /> {/* Corrected image tag */}
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label >Name :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter the Name"
            required
          />
        </div>
        <div className="form-field">
          <label>Password :</label>
          <div className="password-eye-container">
              <input
                type={d ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the Password"
                required
              />
              {d ? (
                <FaEye
                  className="eyes-login"
                  onClick={() => setDisplay(false)}
                />
              ) : (
                <FaEyeSlash
                  className="eyes-login"
                  onClick={() => setDisplay(true)}
                />
              )}
            </div>
        </div>
        <div className="display-flex">
          <div className="form-field">
            <label>Roll Number :</label>
            <input
              type="text"
              value={rollno}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="Enter the Roll No"
              required
            />
          </div>
          <div className="form-field">
            <label>Enrollment Number :</label>
            <input
              type="text"
              value={enrollno}
              onChange={(e) => setEnrollNo(e.target.value)}
              placeholder="Enter the Enrollment No"
              required
            />
          </div>
        </div>
        <div className="display-flex">
          <div className="form-field">
            <label>Subject Code :</label>
            <input
              type="text"
              value={subcode}
              onChange={(e) => setSubcode(e.target.value)}
              placeholder="Enter the Subject Code"
              required
            />
          </div>
          <div className="form-field">
            <label>Subject :</label>
            <input
              type="text"
              value={subname}
              onChange={(e) => setSubname(e.target.value)}
              placeholder="Enter the Subject"
              required
            />
          </div>
        </div>
        <div className="form-field">
          <label>Date :</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ colorScheme: "dark" }}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
