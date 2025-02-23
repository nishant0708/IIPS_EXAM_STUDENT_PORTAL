from flask import Flask, Response, jsonify, request
import cv2
import threading
import time
import cloudinary
import cloudinary.uploader
from flask_cors import CORS
from ultralytics import YOLO
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Disable caching
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024  # 1GB max upload size

# Cloudinary configuration
cloudinary.config(
    cloud_name="duxvbwdf3",
    api_key="282754191399316",
    api_secret="4NYTt_3v2JK7-O0KUN9UwKrAWiE"
)

# Global variables
camera = None
model = YOLO('yolov8l.pt')
verification_complete = False
verification_status = "not_started"
is_recording = False
recording_thread = None
camera_lock = threading.Lock()
frame_buffer = None
buffer_lock = threading.Lock()
buffer_thread = None
is_streaming = False


def initialize_camera():
    global camera
    try:
        with camera_lock:
            if camera is not None:
                camera.release()
            
            camera = cv2.VideoCapture(0)
            if not camera.isOpened():
                return False
                
            camera.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            camera.set(cv2.CAP_PROP_FPS, 10)
            
            ret, frame = camera.read()
            if not ret:
                camera.release()
                camera = None
                return False
                
            return True
    except Exception as e:
        print(f"Camera initialization error: {e}")
        if camera is not None:
            camera.release()
            camera = None
        return False

def detect_face(frame):
    results = model(frame)
    for result in results:
        for box in result.boxes:
            if box.conf[0] > 0.5 and box.cls[0] == 0:  # class 0 is person in COCO
                return True
    return False

def verify_person():
    global verification_complete, verification_status, is_streaming
    frame_count = 0
    person_visible_frames = 0
    verification_status = "in_progress"
    
    while frame_count < 30 and not verification_complete:
        with camera_lock:
            if camera is None or not camera.isOpened():
                verification_status = "failed"
                return False
                
            ret, frame = camera.read()
            if not ret:
                verification_status = "failed"
                return False
            
            if detect_face(frame):
                person_visible_frames += 1
            
            frame_count += 1
            
            if person_visible_frames >= 10:
                verification_complete = True
                verification_status = "complete"
                # Keep streaming active after verification
                is_streaming = True
                return True
                
            time.sleep(0.1)
    
    verification_status = "failed"
    return False

def update_frame_buffer():
    global frame_buffer, camera, is_streaming
    
    while is_streaming and camera and camera.isOpened():
        try:
            with camera_lock:
                ret, frame = camera.read()
                if ret:
                    frame = cv2.flip(frame, 1)
                    with buffer_lock:
                        ret, buffer = cv2.imencode('.jpg', frame)
                        if ret:
                            frame_buffer = buffer.tobytes()
            
        except Exception as e:
            print(f"Error in update_frame_buffer: {e}")
            break
    
    print("Frame buffer update stopped")

def generate_frames():
    global frame_buffer, is_streaming, buffer_thread
    
    if not initialize_camera():
        return
    
    is_streaming = True
    
    # Start frame buffer update thread
    buffer_thread = threading.Thread(target=update_frame_buffer)
    buffer_thread.daemon = True
    buffer_thread.start()
    
    while is_streaming:
        try:
            with buffer_lock:
                if frame_buffer is None:
                    time.sleep(0.01)
                    continue
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_buffer + b'\r\n')
            time.sleep(0.1)
        except Exception as e:
            print(f"Error in generate_frames: {e}")
            break
    
    print("Frame generation stopped")

def record_video(student_id, paper_id, teacher_id):
    global camera, is_recording
    
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        video_path = f'exam_recording_{timestamp}.mp4'
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(video_path, fourcc, 10.0,
                            (int(camera.get(3)), int(camera.get(4))))
        
        while is_recording and camera and camera.isOpened():
            with camera_lock:
                ret, frame = camera.read()
                if ret:
                    frame = cv2.flip(frame, 1)
                    out.write(frame)
            time.sleep(0.1)
        
        out.release()
        
        if os.path.exists(video_path) and os.path.getsize(video_path) > 0:
            public_id = f"exam_recording_{student_id}_{paper_id}_{teacher_id}_{timestamp}"
            response = cloudinary.uploader.upload(
                video_path,
                resource_type="video",
                public_id=public_id,
                chunk_size=6000000
            )
            os.remove(video_path)
            return response['secure_url']
        else:
            print("No video file created or empty file")
            return None
            
    except Exception as e:
        print(f"Error recording video: {e}")
        if os.path.exists(video_path):
            os.remove(video_path)
        return None

def cleanup_camera():
    global camera, is_streaming, is_recording, buffer_thread
    
    is_streaming = False
    is_recording = False
    
    if buffer_thread and buffer_thread.is_alive():
        buffer_thread.join(timeout=1)
    
    with camera_lock:
        if camera is not None:
            camera.release()
            camera = None

@app.route('/video_feed')
def video_feed():
    global is_streaming
    
    if camera is None or not camera.isOpened():
        if not initialize_camera():
            return Response('Camera initialization failed', status=500)
    
    return Response(generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start_verification', methods=['POST'])
def start_verification():
    global verification_complete, verification_status
    
    verification_complete = False
    verification_status = "not_started"
    
    if not initialize_camera():
        return jsonify({
            'status': 'error',
            'message': 'Failed to initialize camera'
        }), 500
    
    verification_thread = threading.Thread(target=verify_person)
    verification_thread.start()
    
    return jsonify({
        'status': 'success',
        'message': 'Verification started'
    })

@app.route('/check_verification_status')
def check_verification_status():
    return jsonify({
        'status': verification_status,
        'verification_complete': verification_complete
    })

@app.route('/start_test', methods=['POST'])
def start_test():
    global is_recording, recording_thread
    
    if is_recording:
        return jsonify({
            'status': 'error',
            'message': 'Recording already in progress'
        }), 400
    
    data = request.json
    student_id = data.get('studentId')
    paper_id = data.get('paperId')
    teacher_id = data.get('teacherId')
    
    if not all([student_id, paper_id, teacher_id]):
        return jsonify({
            'status': 'error',
            'message': 'Missing required parameters'
        }), 400
    
    if not initialize_camera():
        return jsonify({
            'status': 'error',
            'message': 'Failed to initialize camera'
        }), 500
    
    is_recording = True
    recording_thread = threading.Thread(
        target=record_video,
        args=(student_id, paper_id, teacher_id)
    )
    recording_thread.start()
    
    return jsonify({
        'status': 'success',
        'message': 'Recording started'
    })

@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    global is_recording, recording_thread
    
    is_recording = False
    
    if recording_thread and recording_thread.is_alive():
        recording_thread.join(timeout=2)  # Wait up to 2 seconds for recording to stop
    
    cleanup_camera()

    return jsonify({
        'status': 'success',
        'message': 'Recording stopped'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)