import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaUpload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { CgSandClock } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currques, setCurrQues] = useState(null);
  const [studentDetails, setStudentDetails] = useState({
    fullName: "",
    rollNumber: "",
  });
  const paperId = localStorage.getItem("paperId");
  const [questionList, setQuestionList] = useState([]);
  const studentId = localStorage.getItem("studentId");

  const { questionId } = useParams();
  const location = useLocation();

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

  const fetchPaperDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/paper/getReadyPaperDetailsByPaperId",
        { paperId }
      );
      const paper = response.data[0];
      const endTime = new Date(paper.endTime);
      const currentTime = new Date();
      const remainingTime = Math.floor((endTime - currentTime) / 1000);
      setTimeLeft(remainingTime > 0 ? remainingTime : 0);
    } catch (error) {
      console.error("Error fetching paper details:", error);
    }
  };

  const fetchQuestionDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/student/getQuestionByPaperId",
        { paperId }
      );
      const sortedQuestions = response.data.questions.sort(
        (a, b) => a.marks - b.marks
      );
      setQuestionList(sortedQuestions);
    } catch (error) {
      console.error("Error fetching question details:", error);
    }
  };

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/student/getStudentDetailsByStudentId",
        { studentId }
      );
      const { student } = response.data;
      setStudentDetails(student[0]);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const fetchCurrentQuestion = () => {
    if (questionList.length === 0 || !questionId) {
      setCurrQues(null);
      return;
    }
    const currentQuestion = questionList.find((q) => q._id === questionId);
    if (currentQuestion) {
      setCurrQues({
        question: currentQuestion,
        message: "Found Navigated Question",
      });
    } else {
      setCurrQues(null);
    }
  };

  const handleNavigation = async (direction) => {
    if (!currques || !currques.question) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/student/getQuestionNavigation",
        {
          questionId,
          direction,
        }
      );
      const { question } = response.data;
      setCurrQues(response.data);
      window.location.href = `/compiler/${question._id}`;
    } catch (error) {
      console.error("Error navigating question:", error);
    }
  };

  useEffect(() => {
    fetchCurrentQuestion();
  }, [questionId, questionList]);

  useEffect(() => {
    fetchPaperDetails();
    fetchStudentDetails();
    fetchQuestionDetails();
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleSubmit = () => {
    if (timeLeft > 0) {
      window.location.href = "/submit";
    } else {
      alert("Time is up!");
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-left-margin">
          <FaBars onClick={toggleSidebar} className="hamburger-icon" />
          <div className="problem-list-text">Problem List</div>
        </div>
        <div className="navbar-name">
          <div>{studentDetails.rollNumber}</div>
          <div>{studentDetails.fullName}</div>
        </div>
        <div className="navbar-contents">
          <div className="navigation-display-flex">
            {/* Hide the navigation buttons when on '/submit' */}
            {location.pathname !== "/submit" && (
              <button
                onClick={() => handleNavigation("previous")}
                disabled={!currques?.question?.previousQuestionId}
                className={`nav-button ${
                  !currques?.question?.previousQuestionId ? "disabled" : ""
                }`}
              >
                <FaChevronLeft size={15} />
                <div>Previous</div>
              </button>
            )}
            <div className="navbar-submit" onClick={handleSubmit}>
              <FaUpload size={15} />
              <div>Submit</div>
            </div>
            {location.pathname !== "/submit" && (
              <button
                onClick={() => handleNavigation("next")}
                disabled={!currques?.question?.nextQuestionId}
                className={`nav-button ${
                  !currques?.question?.nextQuestionId ? "disabled" : ""
                }`}
              >
                <div>Next</div>
                <FaChevronRight size={15} />
              </button>
            )}
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
          {questionList.map((question) => (
            <div
              onClick={() =>
                (window.location.href = `/compiler/${question._id}`)
              }
              className="slidebar-ele"
              key={question._id}
            >
              <span
                style={{ float: "right" }}
                className="navbar_question-marks"
              >
                Marks: {question?.marks}
              </span>
              <p className="navbar_question-description">
                {question?.questionheading
                  ? question?.questionheading
                  : question?.questionDescription}
              </p>
            </div>
          ))}
        </ul>
      </div>
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Navbar;
