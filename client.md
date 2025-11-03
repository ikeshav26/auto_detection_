# Auto Detection Client# Welcome to your Expo app 👋



A React Native mobile application built with Expo for monitoring classroom occupancy and receiving real-time notifications when fans are left on in empty classrooms.This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).



## 🚀 Features## Get started



- **User & Admin Roles**: Separate dashboards for staff and administrators1. Install dependencies

- **Real-time Notifications**: Get instant alerts when fans are on in empty rooms

- **Notification Management**:    ```bash

  - View notification history with timestamps   npm install

  - Mark notifications as read/unread   ```

  - Delete notifications (admin only)

  - Auto-refresh every 10 seconds2. Start the app

  - Pull-to-refresh functionality

- **Rich Notification Display**:   ```bash

  - Snapshot images from camera   npx expo start

  - People count   ```

  - Fan status

  - Visual unread indicatorsIn the output, you'll find options to open the app in a

- **Authentication**: Secure login and signup system

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)

## 📱 Tech Stack- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)

- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

- **Framework**: React Native with Expo (~54.0.20)- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

- **Navigation**: Expo Router (~6.0.13)

- **State Management**: React HooksYou can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

- **HTTP Client**: Axios (^1.13.1)

- **UI Components**: React Native built-in components## Get a fresh project

- **Storage**: AsyncStorage for local data

When you're ready, run:

## 📋 Prerequisites

```bash

- Node.js (v16 or higher)npm run reset-project

- npm or yarn```

- Expo CLI (`npm install -g expo-cli`)

- iOS Simulator / Android Emulator / Physical Device with Expo Go appThis command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.



## 🛠️ Installation## Learn more



1. **Navigate to client directory:**To learn more about developing your project with Expo, look at the following resources:



   ```bash- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).

   cd client- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

   ```

## Join the community

2. **Install dependencies:**

Join our community of developers creating universal apps.

   ```bash

   npm install- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.

   ```- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


3. **Configure API endpoint:**

   Edit `constants/config.js` to point to your server:

   ```javascript
   export const API_URI = "http://localhost:4000/api"
   ```

   **Note**: For physical devices, replace `localhost` with your computer's IP address.

## 🎯 Running the App

### Start Development Server

```bash
npm start
```

### Run on Specific Platform

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

### Using Expo Go App

1. Install Expo Go on your mobile device
2. Scan the QR code from the terminal
3. Wait for the app to load

## 📁 Project Structure

```text
client/
├── app/                          # Main application code
│   ├── _layout.jsx              # Root layout
│   ├── index.jsx                # Entry point
│   ├── (admin)/                 # Admin-only screens
│   │   ├── _layout.jsx
│   │   ├── home.jsx
│   │   ├── notifications.jsx   # Admin notification management
│   │   └── register-user.jsx
│   ├── (auth)/                  # Authentication screens
│   │   ├── _layout.jsx
│   │   ├── login.jsx
│   │   └── signup.jsx
│   └── (user)/                  # User screens
│       ├── _layout.jsx
│       ├── home.jsx
│       └── notifications.jsx    # User notifications view
├── assets/                      # Static assets (images, fonts)
├── components/                  # Reusable components
│   └── ui/                      # UI components
├── constants/                   # Constants and configuration
│   ├── config.js               # API configuration
│   └── theme.js                # Theme settings
├── context/                     # React Context
│   └── AuthContext.jsx         # Authentication context
└── hooks/                       # Custom React hooks
```

## 🔧 Configuration

### API Configuration (`constants/config.js`)

```javascript
export const API_URI = "http://your-server-ip:4000/api"
```

## 📡 API Integration

The app connects to the following endpoints:

### Notifications

- `GET /api/notifications` - Fetch all notifications
- `GET /api/notifications/unread` - Fetch unread notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification (admin)

### Authentication

- `POST /api/user/login` - User login
- `POST /api/user/signup` - User registration
- `POST /api/admin/register` - Admin user registration

## 📝 Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint

## 🆘 Support

For issues and questions:

- Check the [Expo documentation](https://docs.expo.dev/)
- Review [React Native docs](https://reactnative.dev/)
- Open an issue in the repository

## 📄 License

This project is licensed under the MIT License.
