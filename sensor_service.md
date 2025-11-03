# Auto Detection Sensor Service# Fan Monitor - Classroom Occupancy & Fan Status Alert System



A Python-based computer vision service that monitors classroom occupancy using YOLOv8 object detection. Sends real-time alerts when fans are left running in empty classrooms.## Overview

This project monitors a classroom using a webcam and detects the presence of people using the YOLOv8 object detection model. If the classroom is empty but the fan is ON for a specified duration, it sends an alert to a Telegram chat and saves a snapshot of the empty room. All alerts are logged for record-keeping.

## 🚀 Features

## Features

- **Real-time Person Detection**: Uses YOLOv8 for accurate people counting- Real-time person detection using YOLOv8

- **Smart Alerting**: Sends notifications when fans are ON but room is empty- Alerts via Telegram when fans are ON but no one is present

- **Configurable Delay**: Set custom time before alert is triggered- Automatic snapshot saving when alert is triggered

- **Snapshot Capture**: Takes photos and sends them with alerts- Activity logging

- **Visual Monitoring**: Live camera feed with overlay information

- **Server Integration**: Sends notifications to Node.js server API## How It Works

- **Logging**: Maintains detailed logs of all alerts1. The webcam captures frames and runs YOLOv8 to detect people.

2. If no person is detected and the fan is ON for more than 10 minutes (default), an alert is sent to Telegram with a snapshot.

## 🛠️ Tech Stack3. Alerts and snapshots are saved in the `logs/` and `snapshots/` folders respectively.



- **Computer Vision**: OpenCV (opencv-python)## Setup

- **Object Detection**: YOLOv8 (ultralytics)### Prerequisites

- **HTTP Client**: requests- Python 3.8+

- **Language**: Python 3.8+- Webcam



## 📋 Prerequisites### Installation

1. Clone the repository:

- Python 3.8 or higher   ```powershell

- Webcam or USB camera   git clone https://github.com/ikeshav26/fan_detection_system.git

- pip package manager   cd fan_detection_system

- Node.js server running (for notifications)   ```

2. Install dependencies:

## 🛠️ Installation   ```powershell

   pip install -r requirements.txt

1. **Navigate to sensor service directory:**   ```

3. Download the YOLOv8n model (`yolov8n.pt`) and place it in the project directory.

   ```bash4. Update `config.py` with your Telegram bot token and chat ID.

   cd sensor_service

   ```## Usage

Run the main script:

2. **Create virtual environment (recommended):**```powershell

python main.py

   ```bash```

   # WindowsPress `q` to quit the application.

   python -m venv venv

   venv\Scripts\activate## Configuration

Edit `config.py` to set:

   # macOS/Linux- `TOKEN`: Telegram bot token

   python3 -m venv venv- `CHAT_ID`: Telegram chat ID

   source venv/bin/activate- `ALERT_DELAY`: Time in seconds before sending alert (default: 600 seconds)

   ```- `FAN_STATUS`: Set to `True` if fan is ON

- `SNAPSHOT_DIR`: Directory for snapshots

3. **Install dependencies:**- `LOG_FILE`: Path for activity log



   ```bash## File Structure

   pip install -r requirements.txt- `main.py`: Main monitoring script

   ```- `config.py`: Configuration settings

- `telegram_alert.py`: Telegram alert logic

   This will install:- `requirements.txt`: Python dependencies

   - `ultralytics` - YOLOv8 model- `yolov8n.pt`: YOLOv8 model file

   - `opencv-python` - Computer vision library- `logs/`: Activity logs

   - `requests` - HTTP client- `snapshots/`: Saved snapshots



4. **Download YOLOv8 model:**## License

This project is for educational purposes.

   The YOLOv8 nano model will be automatically downloaded on first run.
   Model file: `yolov8n.pt` (~6MB)

## 🎯 Running the Service

### Basic Usage

```bash
python main.py
```

### With Virtual Environment

```bash
# Windows
venv\Scripts\activate
python main.py

# macOS/Linux
source venv/bin/activate
python main.py
```

### Quit the Application

Press `q` while the camera window is in focus to quit.

## 🔧 Configuration

Edit `config.py` to customize settings:

```python
# Server Configuration
SERVER_URL = "http://localhost:4000/api/notifications/create"

# Alert Configuration
ALERT_DELAY = 600  # seconds (10 minutes)

# Fan Status (True = ON, False = OFF)
FAN_STATUS = True

# Directories and Files
SNAPSHOT_DIR = "snapshots"
LOG_FILE = "logs/logfile.log"
```

### Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| `SERVER_URL` | API endpoint for notifications | http://localhost:4000/api/notifications/create |
| `ALERT_DELAY` | Time before alert (seconds) | 600 (10 minutes) |
| `FAN_STATUS` | Current fan status | True (ON) |
| `SNAPSHOT_DIR` | Directory for snapshots | snapshots |
| `LOG_FILE` | Path to log file | logs/logfile.log |

## 📁 Project Structure

```text
sensor_service/
├── main.py                  # Main application file
├── config.py                # Configuration settings
├── telegram_alert.py        # Alert sending module
├── requirements.txt         # Python dependencies
├── README.md               # This file
├── logs/                   # Log files directory
│   └── logfile.log        # Alert logs
├── snapshots/             # Snapshot images directory
│   └── empty_*.jpg        # Captured snapshots
└── __pycache__/           # Python cache files
```

## 🎥 How It Works

1. **Camera Initialization**: Connects to camera and starts video capture
2. **Frame Processing**: Runs YOLOv8 detection on each frame
3. **People Counting**: Counts people detected (class 0 = person)
4. **Alert Logic**: If room is empty and fan is ON for configured time, sends alert
5. **Notification Delivery**: Sends snapshot and metadata to server API

## 📸 Snapshots

Snapshots are automatically saved when alerts are triggered:

**Format**: `empty_<timestamp>.jpg`

**Location**: `snapshots/` directory

## 📊 Logs

All alerts are logged to `logs/logfile.log`:

**Format**: `<date> - Alert sent. Snapshot: <path>`

## 🔌 API Integration

The service sends POST requests to the server:

```json
{
  "message": "⚠️ Fans ON but no one is in the classroom!",
  "type": "alert",
  "snapshot": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "peopleCount": 0,
  "fanStatus": true
}
```

## 🐛 Common Issues

**Camera Not Found:**

- Check if camera is connected
- Try different camera index
- Check camera permissions

**Server Connection Failed:**

- Ensure server is running on port 4000
- Check `SERVER_URL` in `config.py`
- Verify network connectivity

**YOLOv8 Model Not Found:**

- Model should auto-download on first run
- Check internet connection

## 📦 Dependencies

```text
ultralytics      # YOLOv8 model and utilities
opencv-python    # Computer vision operations
requests         # HTTP requests
```

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

- Check camera permissions
- Verify server connectivity
- Review log files
- Open an issue in the repository
