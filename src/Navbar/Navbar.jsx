import React, { useState, useEffect } from "react";
import { FaPlay, FaBars } from "react-icons/fa6";
import { FcUpload } from "react-icons/fc";
import { CgSandClock } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import axios from "axios"; // For API call
import "./Navbar.css";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Initially, time left is 0
  const paperId = localStorage.getItem("paperId"); // Assuming paperId is stored in local storage

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Format seconds into hh:mm:ss
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")} : ${mins
      .toString()
      .padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
  };

  // Fetch paper details from API and calculate remaining time
  const fetchPaperDetails = async () => {
    try {
      const response = await axios.post('http://localhost:5000/paper/getReadyPaperDetailsByPaperId', { paperId });
      const paper = response.data[0]; // Assuming the paper data is returned in an array
      const endTime = new Date(paper.endTime); // Fetch and convert the endTime to Date object
      const currentTime = new Date(); // Get current time
      
      const remainingTime = Math.floor((endTime - currentTime) / 1000); // Remaining time in seconds
      setTimeLeft(remainingTime > 0 ? remainingTime : 0); // Set the remaining time or 0 if the time has passed
    } catch (error) {
      console.error("Error fetching paper details:", error);
    }
  };

  useEffect(() => {
    fetchPaperDetails(); // Fetch paper details on component mount

    // Update the timer every second
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      <div className="navbar">
        <div className="navbar-left-margin">
          <FaBars onClick={toggleSidebar} className="hamburger-icon" />
          <div className="problem-list-text">Problem List</div>
        </div>
        <div className="navbar-name">
          <div>IT-2k21-35</div>
          <div>Niko Vajradanti</div>
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
    </>
  );
};

export default Navbar;
