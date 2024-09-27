import React, { useState } from 'react';
import "./verification.css";

const Verification = () => {
  const [testStatus, setTestStatus] = useState('Not Started');

  // Start the test and check the status periodically
  const startTest = () => {
    fetch('http://127.0.0.1:5000/start_test')
      .then((response) => response.json())
      .then((data) => {
        setTestStatus('In Progress');
        console.log(data);

        const intervalId = setInterval(() => {
          fetch('http://127.0.0.1:5000/check_test_status')
            .then((response) => response.json())
            .then((data) => {
              if (data.test_ready) {
                setTestStatus('Ready. You can start the test!');
                clearInterval(intervalId);  // Stop checking once the test is ready
              }
            });
        }, 1000);  // Check test status every 1 second
      });
  };

  return (
    <div className="verification_container">
      <div className="verification_instructions">
        <h2 className="verification_instructions_heading">Instructions :</h2>
        <p className="verification_instructions_text">
          Follow the steps below to ensure your webcam and audio are working properly:
        </p>
        <ul className="verification_instructions_list">
          <li>Allow permission for webcam access.</li>
          <li>Both webcam and audio tests will be conducted automatically.</li>
          <li>Once the tests are complete, you will be ready to take the test.</li>
        </ul>
      </div>

      <h3 className="verification_webcam_heading">Webcam Feed</h3>
      {/* Directly stream the video feed from Flask */}
      <img
        id="verification_webcam"
        className="verification_webcam"
        src="http://127.0.0.1:5000/video_feed"  // Directly set the stream URL
        alt="Webcam feed"
      />

      <button className="verification_start_test_btn" onClick={startTest}>
        Start Webcam and Audio Test
      </button>
      <div className="verification_test_status">
        Test Status: {testStatus}
      </div>
    </div>
  );
};

export default Verification;
