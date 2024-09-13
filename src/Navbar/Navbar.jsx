import React, { useState, useEffect } from "react";
import { FaPlay, FaBars } from "react-icons/fa6";
import { FcUpload } from "react-icons/fc";
import { CgSandClock } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { useParams } from "react-router-dom"; // For fetching questionId from URL
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [studentDetails, setStudentDetails] = useState({ fullName: "", rollNumber: "" });
  const paperId = localStorage.getItem("paperId");
  const studentId = localStorage.getItem("studentId");
  const { questionId } = useParams(); // Extract questionId from the URL

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")} : ${mins
      .toString()
      .padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
  };

  // Fetch paper details and calculate remaining time
  const fetchPaperDetails = async () => {
    try {
      const response = await axios.post('http://localhost:5000/paper/getReadyPaperDetailsByPaperId', { paperId });
      const paper = response.data[0];
      const endTime = new Date(paper.endTime);
      const currentTime = new Date();
      const remainingTime = Math.floor((endTime - currentTime) / 1000);
      setTimeLeft(remainingTime > 0 ? remainingTime : 0);
    } catch (error) {
      console.error("Error fetching paper details:", error);
    }
  };

  // Fetch student details using studentId
  const fetchStudentDetails = async () => {
    try {
      const response = await axios.post('http://localhost:5000/student/getStudentDetailsByStudentId', { studentId });
      const { student } = response.data;
      setStudentDetails(student[0]); // Assuming student is an array, take the first element
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  // Navigate to the next or previous question
  const handleNavigation = async (direction) => {
    try {
      const response = await axios.post('http://localhost:5000/student/getQuestionNavigation', {
        questionId,
        direction,
      });
      const { question } = response.data;
      // Update the URL with the new questionId (this requires proper routing setup)
      window.location.href = `/compiler/${question._id}`;
    } catch (error) {
      console.error("Error navigating question:", error);
    }
  };

  useEffect(() => {
    fetchPaperDetails();
    fetchStudentDetails();

    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  return (
    <>
      <div className="navbar">
        <div className="navbar-left-margin">
          <FaBars onClick={toggleSidebar} className="hamburger-icon" />
          <div className="problem-list-text">Problem List</div>
        </div>
        <div className="navbar-name">
          <div>{studentDetails.rollNumber}</div> {/* Display student roll number */}
          <div>{studentDetails.fullName}</div>   {/* Display student name */}
        </div>
        <div className="navbar-contents">
          <div className="navbar-run">
            <FaPlay />
            <p>Run</p>
          </div>
          <div className="navbar-submit">
            <FcUpload />
            <p>Submit</p>
          </div>
        </div>
        <div className="navbar-timer navbar-right-margin">
          <CgSandClock />
          <p>{formatTime(timeLeft)}</p>
        </div>
        <div className="question-navigation">
        <button onClick={() => handleNavigation('previous')}>Previous</button>
        <button onClick={() => handleNavigation('next')}>Next</button>
      </div>
      </div>
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <RxCross2 onClick={toggleSidebar} className="slidebar-back-icon" />
        <ul className="question-list">
          <div className="slidebar-ele">Question 1</div>
          <div className="slidebar-ele">Question 2</div>
          <div className="slidebar-ele">Question 3</div>
        </ul>
      </div>
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      {/* Navigation Buttons */}
     
    </>
  );
};

export default Navbar;
