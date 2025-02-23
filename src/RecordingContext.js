import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const RecordingContext = createContext(null);

export const RecordingProvider = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recordingStarted = useRef(false);
  const [isVideoFeedActive, setIsVideoFeedActive] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const startRecording = async (paperId, teacherId, studentId) => {
    if (recordingStarted.current) return;
    console.log("start recording",setIsVerified);
    try {
      recordingStarted.current = true;
      const response = await fetch('https://iipsexamstudentportal-production-d95c.up.railway.app//start_test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperId, teacherId, studentId })
      });

      if (response.ok) {
        setIsRecording(true);
        console.log('Recording started');
      } else {
        recordingStarted.current = false;
        console.error('Failed to start recording');
      }
    } catch (error) {
      recordingStarted.current = false;
      console.error('Error starting recording:', error);
    }
  };

const stopRecording = async () => {
    try {
      const response = await fetch('https://iipsexamstudentportal-production-d95c.up.railway.app//stop_recording', {
        method: 'POST'
      });

      if (response.ok) {
        setIsRecording(false);
        recordingStarted.current = false;
        console.log('Recording stopped');
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  // Function to validate localStorage and control recording state
  const checkAndControlRecording = () => {
    const paperId = localStorage.getItem('paperId');
    const teacherId = localStorage.getItem('teacherId');
    const studentId = localStorage.getItem('studentId');
    const verified = localStorage.getItem('verified') === 'true';

    if (!paperId || !teacherId || !studentId || !verified) {
      if (isRecording) {
        stopRecording();
      }
    } else if (verified && !isRecording && !recordingStarted.current) {
      startRecording(paperId, teacherId, studentId);
    }
  };

  // Monitor verification status and start recording when verified
  useEffect(() => {
    // Initial check
    checkAndControlRecording();

    // Interval check every second
    const checkInterval = setInterval(checkAndControlRecording, 1000);

    // Handle localStorage changes from other tabs
    const handleStorageChange = () => checkAndControlRecording();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(checkInterval);
      window.removeEventListener('storage', handleStorageChange);
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isRecording]);

  return (
    <RecordingContext.Provider
      value={{
        isRecording,
        isVideoFeedActive,
        isVerified,
        setIsVideoFeedActive,
        startRecording,
        stopRecording,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
};

RecordingProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useRecording = () => {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error('useRecording must be used within a RecordingProvider');
  }
  return context;
};

// VideoFeed component to manage video feed state
export const VideoFeed = () => {
  const { setIsVideoFeedActive } = useRecording();

  useEffect(() => {
    setIsVideoFeedActive(true);
    return () => setIsVideoFeedActive(false);
  }, [setIsVideoFeedActive]);

  return <img src="https://iipsexamstudentportal-production-d95c.up.railway.app//video_feed" className="webcam_navbar" id="webcam_navbar" alt="Video feed" />;
};
