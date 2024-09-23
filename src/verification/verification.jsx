import React, { useState, useEffect } from 'react';
import "./verification.css";

const Verification = () => {
  const [testStatus, setTestStatus] = useState('Not Started');

  // Fetch the video feed from Flask
  const getVideoFeed = () => {
    const videoElement = document.getElementById('verification_webcam');
    if (videoElement) {
      videoElement.src = '/video_feed';  // This will fetch the stream served by Flask
    }
  };

  // Start the test and check the status periodically
  const startTest = () => {
    fetch('/start_test')
      .then((response) => response.json())
      .then((data) => {
        setTestStatus('In Progress');
        console.log(data);

        const intervalId = setInterval(() => {
          fetch('/check_test_status')
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

  // On component mount, start fetching the video feed
  useEffect(() => {
    getVideoFeed();
  }, []);

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
      {/* Video feed streamed from Flask */}
      <video id="verification_webcam" className="verification_webcam" autoPlay muted />

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
