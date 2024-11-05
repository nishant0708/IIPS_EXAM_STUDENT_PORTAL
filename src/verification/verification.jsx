import React, { useState, useEffect } from 'react';
import "./verification.css";

const Verification = () => {
  const [deviceStatus, setDeviceStatus] = useState({
    camera: false,
    audio: false,
    checking: true
  });
  const [testStatus, setTestStatus] = useState('Checking devices...');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    checkDevices();
  }, []);

  const checkDevices = () => {
    fetch('http://127.0.0.1:5000/initialize_devices')
      .then((response) => response.json())
      .then((data) => {
        setDeviceStatus({
          camera: data.camera_ready,
          audio: data.audio_ready,
          checking: false
        });
        
        if (data.camera_ready && data.audio_ready) {
          setTestStatus('Devices ready! You can start the test.');
        } else {
          setTestStatus('Some devices are not ready. Please check your camera and microphone permissions.');
        }
      })
      .catch((error) => {
        console.error('Error checking devices:', error);
        setTestStatus('Error checking devices. Please refresh the page.');
        setDeviceStatus(prev => ({ ...prev, checking: false }));
      });
  };

  const startTest = () => {
    if (!deviceStatus.camera || !deviceStatus.audio) {
      alert('Please ensure both camera and microphone are working before starting the test.');
      return;
    }

    setIsRecording(true);
    setTestStatus('Recording in progress...');

    fetch('http://127.0.0.1:5000/start_test')
      .then(() => {
        // Start polling for test status
        const intervalId = setInterval(() => {
          fetch('http://127.0.0.1:5000/check_test_status')
            .then((response) => response.json())
            .then((statusData) => {
              if (statusData.recording_in_progress) {
                setTestStatus('Recording in progress... Please wait');
              } else if (statusData.test_ready) {
                setTestStatus('Recording completed! You can now proceed with the test.');
                setIsRecording(false);
                clearInterval(intervalId);
              }
            });
        }, 1000);
      })
      .catch((error) => {
        console.error('Error starting test:', error);
        setTestStatus('Error starting test. Please try again.');
        setIsRecording(false);
      });
  };

  return (
    <div className="verification_container">
      <div className="verification_instructions">
        <h2 className="verification_instructions_heading">Instructions:</h2>
        <p className="verification_instructions_text">
          System will check your devices and prepare for the test:
        </p>
        <ul className="verification_instructions_list">
          <li>Camera Status: {deviceStatus.camera ? '✅ Ready' : '⏳ Checking...'}</li>
          <li>Microphone Status: {deviceStatus.audio ? '✅ Ready' : '⏳ Checking...'}</li>
          <li>Once both devices are ready, you can start the test</li>
          <li>The system will record 5 seconds of video and audio</li>
        </ul>
      </div>

      <h3 className="verification_webcam_heading">Webcam Feed</h3>
      <img
        id="verification_webcam"
        className="verification_webcam"
        src="http://127.0.0.1:5000/video_feed"
        alt="Webcam feed"
      />

      {!deviceStatus.checking && deviceStatus.camera && deviceStatus.audio && (
        <button 
          className="verification_start_test_btn"
          onClick={startTest}
          disabled={isRecording}
        >
          {isRecording ? 'Recording in Progress...' : 'Start Test'}
        </button>
      )}

      {!deviceStatus.checking && (!deviceStatus.camera || !deviceStatus.audio) && (
        <button 
          className="verification_retry_btn"
          onClick={checkDevices}
        >
          Retry Device Check
        </button>
      )}

      <div className="verification_test_status">
        Status: {testStatus}
      </div>
    </div>
  );
};

export default Verification;