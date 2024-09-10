import React, { useState } from "react";
import "./Login.css";
import logo from "../assets/iips_logo2.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rollno, setRollNo] = useState("");
  const [enrollno, setEnrollNo] = useState("");
  const [subcode, setSubcode] = useState("");
  const [subname, setSubname] = useState("");
  const [className, setClassName] = useState(""); // New field
  const [semester, setSemester] = useState(""); // New field
  const [d, setDisplay] = useState(false);

  // Function to check if the roll number is in the correct format
  const validateRollNo = (rollno) => {
    const rollNoPattern = /^[A-Z]{2}-\d{1}[A-Z]{1}\d{2}-\d{2}$/;
    return rollNoPattern.test(rollno);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      name &&
      password &&
      rollno &&
      enrollno &&
      subcode &&
      subname &&
      className &&
      semester
    ) {
      if (!validateRollNo(rollno)) {
        alert(
          "Roll Number is in an incorrect format. It should be like IT-2K21-35."
        );
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/student/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            password,
            rollno,
            enrollno,
            subcode,
            subname,
            className,
            semester,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          alert("Login successful!");
          console.log("Paper:", data.paper);
          console.log("Questions:", data.questions);
        } else {
          const errorData = await response.json();
          alert(errorData.message);
        }
      } catch (error) {
        alert("An error occurred during login.");
      }
    } else {
      alert("Please enter all fields!!!");
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <img src={logo} alt="Logo" />
        <h2>Student Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Name :</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="Enter the Name"
              required
            />
          </div>
          <div className="form-field">
            <label>Password : <br/>
             
            <span className="pass-warn">*Your password is the first 4 letters of your name and last 4 digits of your phone number.</span>
              
              </label>
            <div className="password-eye-container">              <input
                type={d ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                placeholder="Enter the Password"
                required
              />
              {d ? (
                <FaEye
                  className="eyes-login"
                  color="white"
                  onClick={() => setDisplay(false)}
                />
              ) : (
                <FaEyeSlash
                  className="eyes-login"
                  color="white"
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
                onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                placeholder="Ex. IT-2K21-35"
                required
              />
            </div>
            <div className="form-field">
              <label>Enrollment Number :</label>
              <input
                type="text"
                value={enrollno}
                onChange={(e) => setEnrollNo(e.target.value.toUpperCase())}
                placeholder="Ex. DExxxxxxx"
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
                onChange={(e) => setSubcode(e.target.value.toUpperCase())}
                placeholder="Ex. IT-xxx"
                required
              />
            </div>
            <div className="form-field">
              <label>Subject :</label>
              <input
                type="text"
                value={subname}
                onChange={(e) => setSubname(e.target.value.toUpperCase())}
                placeholder="Enter the Subject"
                required
              />
            </div>
          </div>
          <div className="display-flex">
            <div className="form-field">
              <label>Class :</label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value.toUpperCase())}
                required
              >
                <option value="">Select Class</option>
                <option value="MTECH">MTech</option>
                <option value="MCA">MCA</option>
              </select>
            </div>
            <div className="form-field">
              <label>Semester :</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
              >
                <option value="">Select Semester</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
