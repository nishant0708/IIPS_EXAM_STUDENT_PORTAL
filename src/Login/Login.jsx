import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Login.css";
import logo from "../assets/iips_logo2.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import AlertModal from "../AlertModal/AlertModal";


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
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State to store modal message
  const [isError, setIsError] = useState(false); // State to track if the modal is for an error

  const navigate = useNavigate(); // Hook to navigate programmatically

  // Automatically navigate to /rules if studentId, paperId, and teacherId exist in localStorage
  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    const paperId = localStorage.getItem("paperId");
    const teacherId = localStorage.getItem("teacherId");

    if (studentId && paperId && teacherId) {
      // Redirect to /rules if all IDs are present and not undefined or null
      navigate("/rules");
    }
  }, [navigate]);

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
        setModalMessage("Roll Number is in an incorrect format. It should be like IT-2K21-35.");
        setIsError(true);
        setModalIsOpen(true);
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
          localStorage.setItem("paperId", data.paperId);
          localStorage.setItem("studentId", data.studentId);
          localStorage.setItem("teacherId", data.teacherId);

          // Show success modal and redirect to /rules
          setModalMessage("Login successful!");
          setIsError(false);
          setModalIsOpen(true);
          
          // Redirect to /rules after the modal closes
          setTimeout(() => {
            setModalIsOpen(false);
            navigate("/rules");
          }, 2000);
        } else {
          const errorData = await response.json();
          setModalMessage(errorData.message);
          setIsError(true);
          setModalIsOpen(true);
        }
      } catch (error) {
        setModalMessage("An error occurred during login.");
        setIsError(true);
        setModalIsOpen(true);
      }
    } else {
      setModalMessage("Please enter all fields!!!");
      setIsError(true);
      setModalIsOpen(true);
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
            <div className="password-eye-container">
              <input
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

        {/* Alert Modal */}
        <AlertModal
          isOpen={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          message={modalMessage}
          iserror={isError}
        />
      </div>
    </div>
  );
}

export default Login;
