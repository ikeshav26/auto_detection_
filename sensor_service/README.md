# Fan Monitor - Classroom Occupancy & Fan Status Alert System

## Overview
This project monitors a classroom using a webcam and detects the presence of people using the YOLOv8 object detection model. If the classroom is empty but the fan is ON for a specified duration, it sends an alert to a Telegram chat and saves a snapshot of the empty room. All alerts are logged for record-keeping.

## Features
- Real-time person detection using YOLOv8
- Alerts via Telegram when fans are ON but no one is present
- Automatic snapshot saving when alert is triggered
- Activity logging

## How It Works
1. The webcam captures frames and runs YOLOv8 to detect people.
2. If no person is detected and the fan is ON for more than 10 minutes (default), an alert is sent to Telegram with a snapshot.
3. Alerts and snapshots are saved in the `logs/` and `snapshots/` folders respectively.

## Setup
### Prerequisites
- Python 3.8+
- Webcam

### Installation
1. Clone the repository:
   ```powershell
   git clone https://github.com/ikeshav26/fan_detection_system.git
   cd fan_detection_system
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Download the YOLOv8n model (`yolov8n.pt`) and place it in the project directory.
4. Update `config.py` with your Telegram bot token and chat ID.

## Usage
Run the main script:
```powershell
python main.py
```
Press `q` to quit the application.

## Configuration
Edit `config.py` to set:
- `TOKEN`: Telegram bot token
- `CHAT_ID`: Telegram chat ID
- `ALERT_DELAY`: Time in seconds before sending alert (default: 600 seconds)
- `FAN_STATUS`: Set to `True` if fan is ON
- `SNAPSHOT_DIR`: Directory for snapshots
- `LOG_FILE`: Path for activity log

## File Structure
- `main.py`: Main monitoring script
- `config.py`: Configuration settings
- `telegram_alert.py`: Telegram alert logic
- `requirements.txt`: Python dependencies
- `yolov8n.pt`: YOLOv8 model file
- `logs/`: Activity logs
- `snapshots/`: Saved snapshots

## License
This project is for educational purposes.
