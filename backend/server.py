from flask import Flask, render_template, Response, jsonify
import cv2
from mtcnn.mtcnn import MTCNN
import pyaudio
import wave
import threading
import speech_recognition as sr
import cloudinary
import cloudinary.uploader
import random
import os
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Initialize global variables
cap = None
audio = None
detector = MTCNN()
recognizer = sr.Recognizer()
lock = threading.Lock()

# Status flags
camera_ready = False
audio_ready = False
recording_in_progress = False
test_ready = False

# Cloudinary configuration
cloudinary.config(
    cloud_name="duxvbwdf3",
    api_key=282754191399316,
    api_secret="4NYTt_3v2JK7-O0KUN9UwKrAWiE"
)

def initialize_devices():
    global cap, audio, camera_ready, audio_ready
    
    try:
        # Initialize camera
        if cap is None:
            cap = cv2.VideoCapture(0)
            if cap.isOpened():
                camera_ready = True
                print("Camera initialized successfully")
            else:
                print("Failed to initialize camera")
                return False
        
        # Initialize audio
        if audio is None:
            audio = pyaudio.PyAudio()
            try:
                # Test audio input
                stream = audio.open(
                    format=pyaudio.paInt16,
                    channels=1,
                    rate=16000,
                    input=True,
                    frames_per_buffer=1024,
                    start=False
                )
                stream.close()
                audio_ready = True
                print("Audio initialized successfully")
            except Exception as e:
                print(f"Failed to initialize audio: {e}")
                return False
        
        return camera_ready and audio_ready
    
    except Exception as e:
        print(f"Error initializing devices: {e}")
        return False

def generate_three_digit_number():
    return str(random.randint(100, 999))

def record_video(duration=5):
    global recording_in_progress
    
    try:
        recording_in_progress = True
        
        # Define the output video file
        temp_filename = f'temp_video_{generate_three_digit_number()}.mp4'
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        # Use MP4V codec for MP4 format
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(temp_filename, fourcc, 20.0, (frame_width, frame_height))
        
        start_time = time.time()
        while time.time() - start_time < duration:
            with lock:
                ret, frame = cap.read()
                if ret:
                    out.write(frame)
                    
        out.release()
        
        # Upload to Cloudinary
        response = cloudinary.uploader.upload(
            temp_filename,
            resource_type="video",
            public_id=f"video_{generate_three_digit_number()}",
            folder="media"
        )
        
        # Clean up temporary file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
            
        recording_in_progress = False
        return response['secure_url']
    
    except Exception as e:
        print(f"Error recording video: {e}")
        recording_in_progress = False
        return None

def record_audio(duration=5):
    try:
        filename = f'temp_audio_{generate_three_digit_number()}.wav'
        
        stream = audio.open(
            format=pyaudio.paInt16,
            channels=1,
            rate=16000,
            input=True,
            frames_per_buffer=1024
        )
        
        frames = []
        for _ in range(0, int(16000 / 1024 * duration)):
            data = stream.read(1024)
            frames.append(data)
            
        stream.stop_stream()
        stream.close()
        
        with wave.open(filename, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
            wf.setframerate(16000)
            wf.writeframes(b''.join(frames))
            
        # Upload to Cloudinary
        response = cloudinary.uploader.upload(
            filename,
            resource_type="raw",
            public_id=f"audio_{generate_three_digit_number()}",
            folder="media"
        )
        
        # Clean up temporary file
        if os.path.exists(filename):
            os.remove(filename)
            
        return response['secure_url']
        
    except Exception as e:
        print(f"Error recording audio: {e}")
        return None

def run_test_recording():
    global test_ready
    
    try:
        video_url = record_video()
        audio_url = record_audio()
        
        if video_url and audio_url:
            test_ready = True
            return {'status': 'success', 'video_url': video_url, 'audio_url': audio_url}
        else:
            return {'status': 'error', 'message': 'Failed to record video or audio'}
            
    except Exception as e:
        print(f"Error during recording: {e}")
        return {'status': 'error', 'message': str(e)}

@app.route('/initialize_devices')
def check_devices():
    success = initialize_devices()
    return jsonify({
        'success': success,
        'camera_ready': camera_ready,
        'audio_ready': audio_ready
    })

@app.route('/start_test')
def start_test():
    global test_ready
    test_ready = False
    
    # Start recording in a separate thread
    test_thread = threading.Thread(target=run_test_recording)
    test_thread.start()
    
    return jsonify({'message': 'Recording started'})

@app.route('/check_test_status')
def check_test_status():
    return jsonify({
        'camera_ready': camera_ready,
        'audio_ready': audio_ready,
        'recording_in_progress': recording_in_progress,
        'test_ready': test_ready
    })

def generate_frames():
    while True:
        with lock:
            if cap is not None and cap.isOpened():
                success, frame = cap.read()
                if not success:
                    break
                ret, buffer = cv2.imencode('.jpg', frame)
                frame = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), 
                   mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)