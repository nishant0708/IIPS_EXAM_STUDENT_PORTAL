import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaUpload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { CgSandClock } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import { submitResponse } from "../SubmitFunction/Submit";
import AlertModal from "../AlertModal/AlertModal";
import { useRecording, VideoFeed } from "../RecordingContext";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // Initialize to null
  const [currques, setCurrQues] = useState(null);
  const [studentDetails, setStudentDetails] = useState({
    fullName: "",
    rollNumber: "",
  });
  const paperId = localStorage.getItem("paperId");
  const [questionList, setQuestionList] = useState([]);
  const studentId = localStorage.getItem("studentId");
  const [timeOutModalIsOpen, setTimeOutModalIsOpen] = useState(false);
  const [submitModalIsOpen, setSubmitModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { stopRecording } = useRecording();
  const { questionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

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
        `${process.env.REACT_APP_BACKEND_URL}/paper/getReadyPaperDetailsByPaperId`,
        { paperId }
      );
      const paper = response.data[0];
      const endTime = new Date(paper?.endTime);
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
        `${process.env.REACT_APP_BACKEND_URL}/student/getQuestionByPaperId`,
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
        `${process.env.REACT_APP_BACKEND_URL}/student/getStudentDetailsByStudentId`,
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
        `${process.env.REACT_APP_BACKEND_URL}/student/getQuestionNavigation`,
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

  const handleSubmit = async ({ timeup = false }) => {
    if (timeLeft === null) return; // Prevent submission if timeLeft isn't initialized
    console.log("Handle submit called, timeup:", timeup); // Debug log
    console.log("tttt",timeup,timeLeft);
    if (timeup) {
      console.log("Checking submitt");
      // If time is up, submit and show the modal
      
      setModalMessage(
        "Test time is up, your paper is submitted automatically, please exit!!"
      );
      setTimeOutModalIsOpen(true);
      await onSubmit({ timeup: true });
    } else {
      if (location.pathname !== "/submit") {
        // Navigate to the /submit page if not already there
        navigate("/submit");
      } else {
        // If already on /submit, confirm submission
        setModalMessage("Are you sure you want to submit?");
        setSubmitModalIsOpen(true);
      }
    }
  };

  const onSubmit = async ({ timeup = false } = {}) => {
    console.log("Submitting responses, timeup:", timeup); // Debug log
    try {
      await submitResponse({ ontimeOut: timeup }); // Call submission API
  
      // After submission, display modal and redirect to home
      if (timeup) {
        setModalMessage(
          "Test time is up, your paper is submitted automatically, please exit!!"
        );
        setTimeOutModalIsOpen(true);
        setTimeout(async() => {
          await stopRecording();
          navigate("/");
          localStorage.clear();
        }, 3000); // Delay for 3 seconds to show modal
      } else {
        navigate("/"); // Redirect immediately after manual submission
      }
  
      // Close modals
      setTimeOutModalIsOpen(false);
      setSubmitModalIsOpen(false);
    } catch (error) {
      console.error("Error during submission:", error);
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
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else if (prevTime === 0) {
          clearInterval(countdown);
          console.log("Time is up! Submitting paper..."); // Debug log
          handleSubmit({ timeup: true }); // Auto-submit when time is up
        }
        return prevTime;
      });
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
          <div>{studentDetails.rollNumber}</div>
          <div>{studentDetails.fullName}</div>
        </div>
        <div>
        <VideoFeed/>
        </div>
        <div className="navbar-contents">
          <div className="navigation-display-flex">
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
          <p>{timeLeft !== null ? formatTime(timeLeft) : "Loading..."}</p>
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
      <AlertModal
        isOpen={submitModalIsOpen}
        isConfirm={true}
        onConfirm={() => onSubmit()}
        onClose={() => setSubmitModalIsOpen(false)}
        message={modalMessage}
        iserror={false}
      />
      <AlertModal
        isOpen={timeOutModalIsOpen}
        isConfirm={false}
        onClose={() => {
          setTimeOutModalIsOpen(false);
          localStorage.clear();
          navigate("/");
        }}
        message={modalMessage}
        iserror={false}
      />
    </>
  );
};

export default Navbar;
