import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./verification.css";
import logo from "../assets/iips_logo2.png";

const Verification = () => {
  const [deviceStatus, setDeviceStatus] = useState({
    camera: false,
    audio: false,
    checking: true
  });
  const [verificationStatus, setVerificationStatus] = useState('Checking devices...');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [videoError, setVideoError] = useState(false);
  const [buttonState, setButtonState] = useState('start');
  const navigate = useNavigate();

  useEffect(() => {
    checkDevices();
  }, []);
  useEffect(() => {
    // Check if already verified
    if (localStorage.getItem("verified") === "true") {
      navigate('/rules');
    } else {
      checkDevices();
    }
  }, [navigate]);

  const showNotification = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const checkDevices = async () => {
    setDeviceStatus(prev => ({ ...prev, checking: true }));
    setVideoError(false);
    setVerificationStatus('Checking devices...');
    setButtonState('start');
    
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      cameraStream.getTracks().forEach(track => track.stop());
      audioStream.getTracks().forEach(track => track.stop());
      
      setDeviceStatus({
        camera: true,
        audio: true,
        checking: false
      });
      setVerificationStatus('Devices ready! Please wait for video feed and then  Click Start Verification to begin.');
      
    } catch (err) {
      console.error("Error accessing devices:", err);
      setDeviceStatus({
        camera: false,
        audio: false,
        checking: false
      });
      setButtonState('retry');
      setVerificationStatus('Error accessing devices. Please check permissions and try again.');
      showNotification('Failed to access devices. Please check permissions and try again.');
    }
  };

  const handleVideoLoad = () => {
    if (!deviceStatus.camera) {
      setDeviceStatus(prev => ({
        ...prev,
        camera: true,
        checking: false
      }));
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    setDeviceStatus(prev => ({
      ...prev,
      camera: false,
      checking: false
    }));
    setButtonState('retry');
    setVerificationStatus('Camera access failed. Please check permissions and try again.');
  };

  const startVerification = async () => {
    if (!deviceStatus.camera || !deviceStatus.audio) {
      showNotification('Please ensure both camera and microphone are working properly.');
      return;
    }

    setButtonState('verifying');
    setVerificationStatus('Starting verification...');

    try {
      const response = await fetch('https://iipsexamstudentportal-production-d95c.up.railway.app//start_verification', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to start verification');
      }

      setVerificationStatus('Please look at the camera...');
      checkVerificationStatus();
    } catch (error) {
      console.error('Error:', error);
      setButtonState('retry');
      setVerificationStatus('Error starting verification. Please try again.');
      showNotification('Failed to start verification. Please try again.');
    }
  };

  const checkVerificationStatus = () => {
    const statusCheck = setInterval(async () => {
      try {
        const response = await fetch('https://iipsexamstudentportal-production-d95c.up.railway.app//check_verification_status');
        const data = await response.json();
        
        switch (data.status) {
          case 'complete':
            clearInterval(statusCheck);
            setVerificationStatus('Verification successful! Proceeding to test...');
            localStorage.setItem("verified", true);
            setTimeout(() => navigate('/rules'), 2000);
            break;
            
          case 'failed':
            clearInterval(statusCheck);
            setButtonState('retry');
            setVerificationStatus('Verification failed. Please try again.');
            showNotification('Verification failed. Please ensure you are visible in the camera.');
            break;
            
          case 'in_progress':
            setVerificationStatus('Please look at the camera...');
            break;
            
          default:
            break;
        }
      } catch (error) {
        console.error('Error:', error);
        clearInterval(statusCheck);
        setButtonState('retry');
        setVerificationStatus('Error during verification. Please try again.');
      }
    }, 1000);
  };

  const getButtonText = () => {
    switch (buttonState) {
      case 'verifying':
        return 'Verifying...';
      case 'retry':
        return 'Retry';
      default:
        return 'Start Verification';
    }
  };

  const handleButtonClick = () => {
    if (buttonState === 'retry') {
      checkDevices();
    } else {
      startVerification();
    }
  };

  return (
    <div className="verify_container">
      <div className="verify_status_panel">
        <img src={logo} alt="Logo" className="verify_logo" />
        <h2 className="verify_heading">Camera & Mic Verification</h2>
        
        <div className="verify_status_indicators">
          <div className={`verify_status_item ${deviceStatus.camera ? 'verify_ready' : 'verify_not_ready'}`}>
            <span className="verify_status_icon">📷</span>
            <span>Camera: {deviceStatus.camera ? 'Ready' : 'Not Ready'}</span>
          </div>
          <div className={`verify_status_item ${deviceStatus.audio ? 'verify_ready' : 'verify_not_ready'}`}>
            <span className="verify_status_icon">🎤</span>
            <span>Microphone: {deviceStatus.audio ? 'Ready' : 'Not Ready'}</span>
          </div>
        </div>

        <div className="verify_status_message">{verificationStatus}</div>
      </div>

      <div className="verify_webcam_section">
        {!videoError && (
          <div className="verify_webcam_container">
            <img
              className="verify_webcam_feed"
              src="https://iipsexamstudentportal-production-d95c.up.railway.app//video_feed"
              alt="Webcam feed"
              onLoad={handleVideoLoad}
              onError={handleVideoError}
            />
          </div>
        )}
        {videoError && (
          <div className="verify_error_message">
            Camera feed unavailable. Please check permissions and try again.
          </div>
        )}
      </div>

      <div className="verify_control_panel">
        {!deviceStatus.checking && (
          <button 
            className={`verify_control_button ${
              buttonState === 'retry' ? 'verify_retry' : 
              buttonState === 'verifying' ? 'verify_verifying' : 
              'verify_start'
            }`}
            onClick={handleButtonClick}
            disabled={buttonState === 'verifying'}
          >
            {getButtonText()}
          </button>
        )}
      </div>

      {showSnackbar && (
        <div className="verify_snackbar">
          {snackbarMessage}
        </div>
      )}
    </div>
  );
};

export default Verification;