import React, { useState } from "react";
import "./Login.css"; // Import the CSS file
import logo from "../assets/iips_logo2.png"; // Corrected the import statement
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rollno, setRollNo] = useState("");
  const [enrollno,setEnrollNo] = useState("");
  const [subcode,setSubcode] = useState("");
  const [date,setDate] = useState("");
  const [d,setDisplay] = useState("none");

  const toggled=()=>
  {
      d === "block" ? setDisplay("none") : setDisplay("block");
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate a login process
    if (name && password && rollno && enrollno && subcode && date) {
      alert("Login successful!");
      // Proceed with your login logic here
    } else {
      alert("Please enter all fields!!!");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" /> {/* Corrected image tag */}
      <h2>Student: Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          />
        </div>
        <div>
          <label>
            Password:
            <div className="password-eye-container">
              <input
                id="password-eye"
                type={d === "block" ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaEye className="eyes-login" onClick={() => toggled()} style={{display: d}}/>
              <FaEyeSlash className="eyes-login" onClick={() => toggled()} style={{display: (d === "block" ? "none" : "block")}}/>
            </div>
          </label>
        </div>
        <div>
            <label>Roll Number:</label>
            <input 
            type="text"
            value={rollno}
            onChange={(e) => setRollNo(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Enrollment Number:</label>
            <input 
            type="text"
            value={enrollno}
            onChange={(e) => setEnrollNo(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Subject Code:</label>
            <input 
            type="text"
            value={subcode}
            onChange={(e) => setSubcode(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Date:</label>
            <input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
