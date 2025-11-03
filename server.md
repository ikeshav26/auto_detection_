# Auto Detection Server

A Node.js/Express backend server for the classroom monitoring system. Handles user authentication, notification management, and provides RESTful API endpoints for the mobile client and sensor service.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Notification System**: Complete CRUD operations for notifications
- **Database**: MongoDB integration with Mongoose ODM
- **CORS Enabled**: Cross-origin resource sharing for client apps
- **RESTful API**: Well-structured API endpoints
- **Security**: Password hashing with bcrypt

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (^5.1.0)
- **Database**: MongoDB with Mongoose (^8.19.2)
- **Authentication**: JSON Web Tokens (^9.0.2)
- **Password Hashing**: bcrypt (^6.0.0) / bcryptjs (^3.0.3)
- **Environment Variables**: dotenv (^17.2.3)
- **CORS**: cors (^2.8.5)
- **Session Management**: cookie-parser (^1.4.7)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or pnpm

## 🛠️ Installation

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Create environment file:**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/auto_detection
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   
   Make sure MongoDB is running:
   ```bash
   # Windows
   mongod

   # macOS (with Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

## 🎯 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
node index.js
```

The server will start on `http://localhost:4000`

## 📁 Project Structure

```
server/
├── index.js                     # Main server file
├── package.json                 # Dependencies and scripts
├── .env                         # Environment variables (create this)
└── src/
    ├── config/
    │   └── Db.js               # Database connection
    ├── models/
    │   ├── user.model.js       # User schema
    │   └── notification.model.js # Notification schema
    ├── controller/
    │   ├── user.controller.js   # User logic
    │   ├── admin.controller.js  # Admin logic
    │   └── notification.controller.js # Notification logic
    ├── middlewares/
    │   └── auth.js             # Authentication middleware
    └── routes/
        ├── user.routes.js      # User routes
        ├── admin.routes.js     # Admin routes
        └── notification.routes.js # Notification routes
```

## 📡 API Endpoints

### Base URL
```
http://localhost:4000/api
```

### User Routes (`/api/user`)

#### Register User
```http
POST /api/user/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "staff"
}
```

#### Login
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "staff"
  }
}
```

### Admin Routes (`/api/admin`)

#### Register New User (Admin Only)
```http
POST /api/admin/register
Content-Type: application/json
Authorization: Bearer <admin-jwt-token>

{
  "username": "new_user",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "staff"
}
```

### Notification Routes (`/api/notifications`)

#### Create Notification (Sensor Service)
```http
POST /api/notifications/create
Content-Type: application/json

{
  "message": "⚠️ Fans ON but no one is in the classroom!",
  "type": "alert",
  "snapshot": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "peopleCount": 0,
  "fanStatus": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification created successfully",
  "notification": {
    "_id": "notification-id",
    "message": "⚠️ Fans ON but no one is in the classroom!",
    "type": "alert",
    "peopleCount": 0,
    "fanStatus": true,
    "isRead": false,
    "createdAt": "2025-11-04T10:30:00.000Z"
  }
}
```

#### Get All Notifications
```http
GET /api/notifications
```

**Response:**
```json
{
  "success": true,
  "notifications": [...]
}
```

#### Get Unread Notifications
```http
GET /api/notifications/unread
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "notifications": [...]
}
```

#### Mark Notification as Read
```http
PATCH /api/notifications/:id/read
```

#### Mark All Notifications as Read
```http
PATCH /api/notifications/read-all
```

#### Delete Notification
```http
DELETE /api/notifications/:id
```

#### Delete All Notifications
```http
DELETE /api/notifications
```

## 🗄️ Database Models

### User Model
```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['staff', 'admin'], default: 'admin')
}
```

### Notification Model
```javascript
{
  message: String (required),
  type: String (enum: ['alert', 'warning', 'info'], default: 'alert'),
  snapshot: String (base64 encoded image),
  peopleCount: Number (default: 0),
  fanStatus: Boolean (default: false),
  isRead: Boolean (default: false),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## 🔒 Authentication & Authorization

### JWT Authentication
- JWT tokens are issued upon successful login
- Tokens are stored in cookies and sent with requests
- Protected routes require valid JWT token

### Role-Based Access Control
- **Admin**: Full access to all endpoints
- **Staff**: Limited access to user endpoints

### Authentication Middleware
```javascript
// Protected route example
router.get('/protected', authMiddleware, controller)
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 4000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/auto_detection |
| `JWT_SECRET` | Secret key for JWT | (required) |
| `NODE_ENV` | Environment mode | development |

### CORS Configuration
By default, CORS is enabled for all origins in development:
```javascript
app.use(cors({
  origin: true,
  credentials: true,
}))
```

For production, update to specific origins:
```javascript
app.use(cors({
  origin: ['http://your-client-url.com'],
  credentials: true,
}))
```

## 🧪 Testing

### Test Server Connection
```bash
curl http://localhost:4000/
```

**Expected Response:**
```
Hello, World!
```

### Test Database Connection
Check server console for:
```
MongoDB Connected Successfully
Server is running on port 4000
```

### Test API Endpoints
Use tools like:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)
- curl commands

## 🐛 Debugging

### Enable Debug Logging
Add to `.env`:
```env
DEBUG=express:*
```

### Common Issues

**MongoDB Connection Failed:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service

**Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::4000
```
**Solution:** Change PORT in `.env` or kill process using port 4000

**JWT Token Invalid:**
```
Error: jwt malformed
```
**Solution:** Check JWT_SECRET in `.env` and token format

## 📦 Dependencies

### Production Dependencies
```json
{
  "bcrypt": "^6.0.0",
  "bcryptjs": "^3.0.3",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.19.2"
}
```

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure specific CORS origins
- [ ] Use MongoDB Atlas or hosted database
- [ ] Enable HTTPS
- [ ] Set up logging
- [ ] Configure rate limiting
- [ ] Add request validation
- [ ] Set up monitoring

### Deploy to Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your-mongo-uri
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Deploy to Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push

## 📊 Performance Optimization

### Database Indexing
```javascript
// Add indexes to frequently queried fields
userSchema.index({ email: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ isRead: 1 });
```

### Pagination
```javascript
// Limit query results
const notifications = await Notification.find()
  .sort({ createdAt: -1 })
  .limit(50);
```

## 🔮 Future Enhancements

- [ ] WebSocket support for real-time notifications
- [ ] Rate limiting for API endpoints
- [ ] Request validation middleware
- [ ] Logging system (Winston/Morgan)
- [ ] API documentation (Swagger)
- [ ] Unit and integration tests
- [ ] Database migrations
- [ ] Notification pagination
- [ ] Image storage service (AWS S3, Cloudinary)
- [ ] Email notifications
- [ ] Analytics endpoints

## 📝 Scripts

- `npm run dev` - Start server with nodemon (auto-reload)
- `npm test` - Run tests (to be implemented)

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Check MongoDB connection
- Verify environment variables
- Review server logs
- Open an issue in the repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request
