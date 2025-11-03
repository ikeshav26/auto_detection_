import os
import time
import cv2
from ultralytics import YOLO
from alert import send_alert
import config


os.makedirs(config.SNAPSHOT_DIR, exist_ok=True)
os.makedirs(os.path.dirname(config.LOG_FILE), exist_ok=True)


print("Loading YOLO model...")
model = YOLO("yolov8n.pt")
print("Model loaded successfully!") 


print("Initializing camera...")
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open camera!")
    exit()
print("Camera initialized successfully!")

empty_start_time = None

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to read frame from camera!")
        break

  
    results = model(frame)
    boxes = results[0].boxes
    person_count = sum([1 for cls in boxes.cls if int(cls) == 0])  

   
    for box in boxes:
        if int(box.cls) == 0:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)


    cv2.putText(frame, f"People Count: {person_count}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    if config.FAN_STATUS:
        cv2.putText(frame, f"Fan Status: ON", (10, 60),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    else:
        cv2.putText(frame, f"Fan Status: OFF", (10, 60),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    fan_status = config.FAN_STATUS
    current_time = time.time()

    
    if person_count == 0 and fan_status:
        if empty_start_time is None:
            empty_start_time = current_time
        elif current_time - empty_start_time >= config.ALERT_DELAY:
            timestamp = int(current_time)
            snapshot_path = os.path.join(config.SNAPSHOT_DIR, f"empty_{timestamp}.jpg")
            cv2.imwrite(snapshot_path, frame)

            send_alert(
                "⚠️ Fans ON but no one is in the classroom!",
                snapshot_path,
                people_count=person_count,
                fan_status=fan_status
            )
            print(f"Alert sent! Snapshot saved: {snapshot_path}")

            with open(config.LOG_FILE, "a") as f:
                f.write(f"{time.ctime()} - Alert sent. Snapshot: {snapshot_path}\n")

            
            empty_start_time = current_time
    else:
    
        empty_start_time = None


    cv2.imshow("Classroom Monitor", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
