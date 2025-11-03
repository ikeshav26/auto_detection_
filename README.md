# Auto Detection System

A comprehensive classroom monitoring system that uses computer vision to detect when fans are left running in empty classrooms and sends real-time notifications to administrators and staff.

## 📋 Overview

This system consists of three main components:

1. **Sensor Service** (Python): Computer vision service using YOLOv8 for person detection
2. **Server** (Node.js): RESTful API backend with MongoDB database
3. **Client** (React Native): Mobile application for receiving and managing notifications

## 🏗️ System Architecture

```text
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ Sensor Service  │  HTTP   │     Server      │  HTTP   │  Mobile Client  │
│   (Python)      │────────▶│   (Node.js)     │◀────────│  (React Native) │
│  - YOLOv8       │         │  - Express      │         │  - Expo         │
│  - OpenCV       │         │  - MongoDB      │         │  - Axios        │
│  - Camera       │         │  - JWT Auth     │         │  - AsyncStorage │
└─────────────────┘         └─────────────────┘         └─────────────────┘
       │                             │                            │
       │ Detects people              │ Stores data               │ Displays
       │ Sends snapshots            │ Manages users             │ notifications
       │                             │                            │
```

## ✨ Features

### Sensor Service

- Real-time person detection using YOLOv8
- Configurable alert delays
- Automatic snapshot capture
- Visual monitoring dashboard
- Alert logging

### Server

- User authentication with JWT
- Role-based access control (Admin/Staff)
- Notification management API
- MongoDB database integration
- CORS-enabled for cross-origin requests

### Client App

- Separate user and admin dashboards
- Real-time notification display
- Snapshot image viewing
- Mark as read/unread functionality
- Delete notifications (admin only)
- Auto-refresh every 10 seconds
- Pull-to-refresh support

## 🚀 Quick Start

### Prerequisites

- **Python** 3.8+ (for sensor service)
- **Node.js** 16+ (for server)
- **MongoDB** 4.4+ (for database)
- **Expo CLI** (for mobile client)
- **Webcam** (for sensor service)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ikeshav26/auto_detection_.git
   cd auto_detection_
   ```

2. **Setup Server:**

   ```bash
   cd server
   npm install
   
   # Create .env file
   echo PORT=4000 > .env
   echo MONGODB_URI=mongodb://localhost:27017/auto_detection >> .env
   echo JWT_SECRET=your-secret-key >> .env
   
   npm run dev
   ```

3. **Setup Sensor Service:**

   ```bash
   cd ../sensor_service
   pip install -r requirements.txt
   
   # Edit config.py if needed
   python main.py
   ```

4. **Setup Client:**

   ```bash
   cd ../client
   npm install
   
   # Edit constants/config.js to set server URL
   npm start
   ```

## 📁 Project Structure

```text
auto_detection_/
├── client/                    # React Native mobile app
│   ├── app/                   # App screens (admin, auth, user)
│   ├── components/            # Reusable components
│   ├── constants/             # Configuration files
│   ├── context/               # React context
│   └── README.md
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── models/           # MongoDB models
│   │   ├── controller/       # Business logic
│   │   ├── routes/           # API routes
│   │   └── middlewares/      # Auth middleware
│   ├── index.js              # Server entry point
│   └── README.md
├── sensor_service/            # Python vision service
│   ├── main.py               # Main detection script
│   ├── config.py             # Configuration
│   ├── telegram_alert.py     # Notification sender
│   ├── logs/                 # Alert logs
│   ├── snapshots/            # Captured images
│   └── README.md
└── README.md                  # This file
```

## 🔧 Configuration

### Server (.env)

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/auto_detection
JWT_SECRET=your-super-secret-key
NODE_ENV=development
```

### Sensor Service (config.py)

```python
SERVER_URL = "http://localhost:4000/api/notifications/create"
ALERT_DELAY = 600  # 10 minutes
FAN_STATUS = True
SNAPSHOT_DIR = "snapshots"
LOG_FILE = "logs/logfile.log"
```

### Client (constants/config.js)

```javascript
export const API_URI = "http://localhost:4000/api"
```

## 📡 API Endpoints

### Authentication

- `POST /api/user/signup` - Register new user
- `POST /api/user/login` - User login
- `POST /api/admin/register` - Register user (admin only)

### Notifications

- `POST /api/notifications/create` - Create notification
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread` - Get unread notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications` - Delete all notifications

## 🔄 Workflow

1. **Detection**: Sensor service monitors classroom via webcam
2. **Analysis**: YOLOv8 detects number of people in frame
3. **Alert Trigger**: If room empty + fan ON for configured time
4. **Notification**: Snapshot sent to server with metadata
5. **Storage**: Server stores in MongoDB
6. **Display**: Client polls server and displays notifications
7. **Action**: User marks as read or admin deletes

## 🛠️ Development

### Running in Development

```bash
# Terminal 1 - Start MongoDB
mongod

# Terminal 2 - Start Server
cd server
npm run dev

# Terminal 3 - Start Sensor Service
cd sensor_service
python main.py

# Terminal 4 - Start Client
cd client
npm start
```

### Testing

**Test Server:**

```bash
curl http://localhost:4000/
# Expected: Hello, World!
```

**Test Sensor Service:**

- Ensure camera is connected
- Press 'q' to quit
- Check `logs/logfile.log` for events

**Test Client:**

- Scan QR code with Expo Go app
- Login with test credentials
- Navigate to notifications screen

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed:**

```bash
# Start MongoDB service
# Windows: mongod
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Camera Not Detected:**

- Check camera permissions
- Try different camera index in main.py
- Ensure no other app is using camera

**Client Can't Connect to Server:**

- Check server is running on port 4000
- Update API_URI in client config
- For physical devices, use computer's IP instead of localhost
- Check firewall settings

**Notifications Not Appearing:**

- Verify server is running
- Check MongoDB is connected
- Ensure sensor service is sending to correct URL
- Check network connectivity

## 📊 Monitoring

### View Logs

```bash
# Server logs
cd server
tail -f logs/server.log  # if logging configured

# Sensor service logs
cd sensor_service
cat logs/logfile.log
```

### View Snapshots

```bash
cd sensor_service/snapshots
ls -lt  # View latest snapshots
```

## 🚀 Deployment

### Server Deployment (Heroku/Railway)

1. Set environment variables
2. Connect to MongoDB Atlas
3. Deploy from Git repository

### Client Deployment

Build for production:

```bash
cd client
# Android
expo build:android

# iOS
expo build:ios

# Or use EAS Build
eas build --platform all
```

### Sensor Service Deployment

Run as system service on local machine or edge device.

## 🔐 Security

- JWT authentication for API access
- Password hashing with bcrypt
- Role-based access control
- CORS configuration for production
- Environment variables for secrets

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Authors

- **Keshav** - [@ikeshav26](https://github.com/ikeshav26)

## 🆘 Support

For support, email or open an issue in the repository.

## 🔮 Future Enhancements

- [ ] WebSocket for real-time notifications
- [ ] Push notifications on mobile
- [ ] Cloud storage for snapshots (AWS S3)
- [ ] IoT integration for actual fan control
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Multiple camera support
- [ ] Dark mode in client app
- [ ] Notification search and filters
- [ ] Export reports

## 📚 Documentation

- [Client README](./client/README.md)
- [Server README](./server/README.md)
- [Sensor Service README](./sensor_service/README.md)

## 🙏 Acknowledgments

- YOLOv8 by Ultralytics
- Expo for React Native framework
- OpenCV community
- MongoDB and Express.js teams
