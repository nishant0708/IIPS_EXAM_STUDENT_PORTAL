import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // For API calls
import './rules.css';

const RulesPage = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [paper ,setpaper] = useState("");
  const paperId = localStorage.getItem("paperId"); 

  // Fetch paper details from API
  const fetchPaperDetails = async () => {
    try {
      const response = await axios.post('http://localhost:5000/paper/getReadyPaperDetailsByPaperId', { paperId });
     setpaper( response.data[0]); 

      // Extract the start time from the fetched data
      const fetchedStartTime = new Date(paper.startTime);
      setStartTime(fetchedStartTime);
    } catch (error) {
      console.error('Error fetching paper details:', error);
      alert('Failed to load paper details');
    }
  };

  useEffect(() => {
    fetchPaperDetails(); // Fetch paper details on component mount

    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (startTime && currentTime) {
      const timeDiff = (startTime - currentTime) / 1000; // Difference in seconds
      if (timeDiff > 0) {
        setTimeRemaining(timeDiff); // Update time remaining
        setTimerActive(true); // Disable start button until start time is reached
      } else {
        setTimerActive(false); // Enable start button once start time is reached
        setTimeRemaining(0);
      }
    }
  }, [currentTime, startTime]);

  const handleNextClick = () => {
    if (isChecked && !timerActive) {
      navigate('/compiler'); // Redirect to the compiler page
    } else if (!isChecked) {
      alert('Please accept the rules before proceeding.');
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const formatCountdown = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rules-container">
      <div className="rules_title">Test Guidelines</div>
      <div className="rules-list">
        <div className="rules_item">
          1. <strong>Paper Details:</strong> The paper is worth a total of {paper.marks} marks and should be completed in {paper?.duration?.hours} hours and {paper?.duration.minutes} minutes.
        </div>
        <div className="rules_item">
          2. <strong>Camera and Microphone:</strong> Your camera and microphone must remain on at all times during the test. The test is being monitored, and you may be disqualified if there is any suspicious activity.
        </div>
        <div className="rules_item">
          3. <strong>No External Help:</strong> You are not allowed to consult any materials or external devices (such as phones, tablets, or other computers) during the test.
        </div>
        <div className="rules_item">
          4. <strong>No Cheating:</strong> Any form of cheating, including looking at external devices, books, or seeking help from another person, will result in immediate disqualification.
        </div>
        <div className="rules_item">
          5. <strong>Do Not Exit:</strong> You must stay on the test screen at all times. Exiting the screen or opening other tabs or windows may trigger a warning or result in termination of the test.
        </div>
        <div className="rules_item">
          6. <strong>Internet Connection:</strong> Ensure a stable internet connection throughout the test. Any disconnection may affect your test and could lead to disqualification.
        </div>
        <div className="rules_item">
          7. <strong>Termination Warning:</strong> The teacher or invigilator reserves the right to terminate your test if there is any suspicious behavior, such as leaving the test area or engaging with other individuals.
        </div>
        <div className="rules_item">
          8. <strong>Timing:</strong> Complete the test within the given time limit. Failure to submit within the allotted time will result in the test being automatically submitted.
        </div>
      </div>

      <div className="checkbox-container">
        <input 
          type="checkbox" 
          id="accept-rules" 
          checked={isChecked} 
          onChange={handleCheckboxChange} 
        />
        <label className="rules_line" htmlFor="accept-rules">I have read and accept the rules</label>
      </div>

      <div className="start-time-info rules_line">
        {timerActive ? `Test starts in: ${formatCountdown(timeRemaining)}` : 'You can start the test now.'}
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
