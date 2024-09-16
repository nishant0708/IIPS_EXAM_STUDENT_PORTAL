import React, { useState, useEffect } from 'react';
import "./verification.css"

const Verification = () => {
  const [testStatus, setTestStatus] = useState('Not Started');

  // Start webcam feed
  useEffect(() => {
    const videoElement = document.getElementById('verification_webcam');
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          videoElement.srcObject = stream;
        })
        .catch(function (error) {
          console.log('Error accessing the webcam: ' + error);
        });
    }
  }, []);

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
                clearInterval(intervalId);
              }
            });
        }, 1000);
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
          <li>Allow webcam permission to check if your webcam is functioning.</li>
          <li>Both the webcam and audio tests will be conducted automatically.</li>
          <li>Once both tests are complete, you will be ready to take the test.</li>
        </ul>
      </div>

      <h3 className="verification_webcam_heading">Webcam Feed</h3>
      <video id="verification_webcam" className="verification_webcam" autoPlay></video>

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
