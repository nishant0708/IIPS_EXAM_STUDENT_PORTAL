import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./rules.css";

const RulesPage = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [paper, setPaper] = useState({});
  const paperId = localStorage.getItem("paperId");

  // Fetch paper details from API
  const fetchPaperDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/paper/getReadyPaperDetailsByPaperId",
        { paperId }
      );
      setPaper(response.data[0]);

      // Extract the start time from the fetched data and adjust to local timezone
      const fetchedStartTime = new Date(response.data[0].startTime);
      setStartTime(fetchedStartTime);
    } catch (error) {
      console.error("Error fetching paper details:", error);
      alert("Failed to load paper details");
    }
  };

  useEffect(() => {
    fetchPaperDetails();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (startTime && currentTime) {
      const timeDiff = (startTime.getTime() - currentTime.getTime()) / 1000;
      if (timeDiff > 0) {
        setTimeRemaining(timeDiff);
        setTimerActive(true);
      } else {
        setTimerActive(false);
        setTimeRemaining(0);
      }
    }
  }, [currentTime, startTime]);

  useEffect(() => {
    if (localStorage.getItem("start")) {
      navigate("/compiler");
    }
  }, [navigate]);

  const handleNextClick = async () => {
    if (isChecked && !timerActive) {
      try {
        // Call the API to get the first question
        const response = await axios.post(
          `http://localhost:5000/student/getFirstQuestionByPaperId`,
          { paperId }
        );
        const firstQuestion = response.data.question;

        if (firstQuestion) {
          localStorage.setItem("start", "true");
          navigate(`/compiler/${firstQuestion._id}`);
        }
      } catch (error) {
        console.error("Error fetching the first question:", error);
        alert("Failed to fetch the first question.");
      }
    } else if (!isChecked) {
      alert("Please accept the rules before proceeding.");
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const formatCountdown = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rules-container">
      <div className="rules_title">Test Guidelines</div>
      <div className="rules-list">
        <div className="rules_item">
          1. <strong>Paper Details:</strong> The paper is worth a total of{" "}
          <b>{paper.marks} marks</b> and should be completed in{" "}
          <b>
            {paper?.duration?.hours} hours and {paper?.duration?.minutes}{" "}
            minutes.
          </b>
        </div>
        <div className="rules_item">
          2. <strong>Camera and Microphone:</strong> Your camera and microphone
          must remain on at all times during the test. The test is being
          monitored, and you may be disqualified if there is any suspicious
          activity.
        </div>
        <div className="rules_item">
          3. <strong>No External Help:</strong> You are not allowed to consult
          any materials or external devices (such as phones, tablets, or other
          computers) during the test.
        </div>
        <div className="rules_item">
          4. <strong>No Cheating:</strong> Any form of cheating, including
          looking at external devices, books, or seeking help from another
          person, will result in immediate disqualification.
        </div>
        <div className="rules_item">
          5. <strong>Do Not Exit:</strong> You must stay on the test screen at
          all times. Exiting the screen or opening other tabs or windows may
          trigger a warning or result in termination of the test.
        </div>
        <div className="rules_item">
          6. <strong>Internet Connection:</strong> Ensure a stable internet
          connection throughout the test. Any disconnection may affect your test
          and could lead to disqualification.
        </div>
        <div className="rules_item">
          7. <strong>Termination Warning:</strong> The teacher or invigilator
          reserves the right to terminate your test if there is any suspicious
          behavior, such as leaving the test area or engaging with other
          individuals.
        </div>
        <div className="rules_item">
          8. <strong>Timing:</strong> Complete the test within the given time
          limit. Failure to submit within the allotted time will result in the
          test being automatically submitted.
        </div>
      </div>

      <div className="checkbox-container">
        <input
          type="checkbox"
          id="accept-rules"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label className="rules_line" htmlFor="accept-rules">
          I have read and accept the rules
        </label>
      </div>

      <div className="start-time-info rules_line">
        {timerActive
          ? `Test starts in: ${formatCountdown(timeRemaining)}`
          : "You can start the test now."}
      </div>

      <button
        className="next-button rules_line"
        onClick={handleNextClick}
        disabled={!isChecked || timerActive}
      >
        Start Now
      </button>
    </div>
  );
};

export default RulesPage;
