import React, { useState, useEffect } from "react";
import { FaPlay, FaBars } from "react-icons/fa6";
import { FcUpload } from "react-icons/fc";
import { CgSandClock } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import "./Navbar.css";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // Set sample time as 1 hour (3600 seconds)

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

  // Update the timer every second
  useEffect(() => {
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
