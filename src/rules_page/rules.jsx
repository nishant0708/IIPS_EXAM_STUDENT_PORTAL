import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './rules.css'; 

const RulesPage = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [startTime, setStartTime] = useState(null); // Start time fetched from the server
  const [currentTime, setCurrentTime] = useState(new Date()); // Current time
  const [timeRemaining, setTimeRemaining] = useState(0); // Countdown time in seconds
  const [timerActive, setTimerActive] = useState(false); // To track if we are waiting for start time

  // Example array containing exam information
  const examDetails = {
    totalQuestions: 10,
    marksPerQuestion: 5,
    totalMarks: 50,
    durationMinutes: 60, // Paper duration in minutes
  };

  useEffect(() => {
    // Simulate fetching the start time (for now, 1 minute from now)
    const fetchStartTime = () => {
      const fetchedStartTime = new Date();
      fetchedStartTime.setMinutes(fetchedStartTime.getMinutes() + 1); // Start time set 1 minute from now
      setStartTime(fetchedStartTime);
    };

    fetchStartTime();

    // Update current time and calculate time remaining every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (startTime && currentTime) {
      const timeDiff = (startTime - currentTime) / 1000; // Time difference in seconds
      if (timeDiff > 0) {
        setTimeRemaining(timeDiff); 
        setTimerActive(true); 
      } else {
        setTimerActive(false); 
        setTimeRemaining(0); 
      }
    }
  }, [currentTime, startTime]);

  const handleNextClick = () => {
    if (isChecked && !timerActive) {
      navigate('/compiler'); 
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
          1. <strong>Paper Details:</strong> The test contains {examDetails.totalQuestions} questions, each carrying {examDetails.marksPerQuestion} marks. The paper is worth a total of {examDetails.totalMarks} marks and should be completed in {examDetails.durationMinutes} minutes.
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
        {/* New rule dynamically generated based on examDetails */}
        
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
