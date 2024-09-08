import React, { useState } from "react";
import { FaPlay, FaBars} from "react-icons/fa6";
import { FcUpload } from "react-icons/fc";
import { CgSandClock } from "react-icons/cg";
import "./Navbar.css";
import { RxCross2 } from "react-icons/rx";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
          <p>00 : 00 : 00</p>
        </div>
      </div>
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <RxCross2  onClick={toggleSidebar} className="slidebar-back-icon" />
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
