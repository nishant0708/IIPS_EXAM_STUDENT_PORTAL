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
import io
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Initialize the webcam
cap = cv2.VideoCapture(0)

# Initialize the MTCNN face detector
detector = MTCNN()

# Initialize the speech recognizer
recognizer = sr.Recognizer()

# Lock for thread-safe webcam access
lock = threading.Lock()

# Global flag to track whether tests are completed
test_ready = False

# Cloudinary configuration
cloudinary.config(
    cloud_name="duxvbwdf3",
    api_key=282754191399316,
    api_secret="4NYTt_3v2JK7-O0KUN9UwKrAWiE"
)

def generate_three_digit_number():
    return str(random.randint(100, 999))

# Function to record video and upload directly to Cloudinary
def record_video_and_capture_photo():
    # Set the codec for the video writer
    fourcc = cv2.VideoWriter_fourcc(*'MP4V')
    
    # Create an in-memory stream instead of writing to disk
    video_stream = io.BytesIO()

    # Initialize video writer for in-memory buffer
    out = cv2.VideoWriter('appsrc ! videoconvert ! x264enc ! mp4mux ! filesink location=/dev/stdout', fourcc, 20.0, (640, 480))

    # Record video for 10 seconds
    for _ in range(200):  # Approx 10 seconds at 20 FPS
        with lock:
            ret, frame = cap.read()
            if not ret:
                break
            # Write frame to video writer
            out.write(frame)
        time.sleep(0.05)

    out.release()

    # Generate a random three-digit number for Cloudinary public ID
    three_digit_number = generate_three_digit_number()

    # Upload the video directly to Cloudinary from the in-memory stream
    video_stream.seek(0)  # Ensure we're at the start of the stream
    cloudinary_response = cloudinary.uploader.upload_large(
        video_stream, 
        resource_type="video",
        public_id=f"video_{three_digit_number}",
        folder="media"
    )

    print("Uploaded video to Cloudinary:", cloudinary_response['secure_url'])

# Function to capture audio using pyaudio
def record_audio(filename, duration=10, sample_rate=16000):
    p = pyaudio.PyAudio()

    stream = p.open(format=pyaudio.paInt16,
                    channels=1,
                    rate=sample_rate,
                    input=True,
                    frames_per_buffer=1024)

    frames = []

    for _ in range(int(sample_rate / 1024 * duration)):
        data = stream.read(1024)
        frames.append(data)

    stream.stop_stream()
    stream.close()
    p.terminate()

    # Save the recorded audio to a file
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
        wf.setframerate(sample_rate)
        wf.writeframes(b''.join(frames))

# Function to start the webcam and audio test
def run_tests():
    global test_ready
    try:
        # Record video and upload directly to Cloudinary
        record_video_and_capture_photo()

        # Record audio (if you want to keep audio locally)
        audio_filename = 'test_audio.wav'
        record_audio(audio_filename, duration=10)

        test_ready = True
    except Exception as e:
        print(f"Error during tests: {e}")
        # Even if there's an error, set test_ready to True to allow completion
        test_ready = True


# Route to start the webcam and audio tests
@app.route('/start_test')
def start_test():
    global test_ready
    test_ready = False

    # Start the tests in a separate thread
    test_thread = threading.Thread(target=run_tests)
    test_thread.start()

    return jsonify({'message': 'Webcam and audio tests started'})

# Route to check the test status
@app.route('/check_test_status')
def check_test_status():
    return jsonify({'test_ready': test_ready})

# Route to stream the webcam feed
def generate_frames():
    while True:
        with lock:
            success, frame = cap.read()
            if not success:
                break
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)
