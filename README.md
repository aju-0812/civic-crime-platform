# 🚨 Real-Time Crime Reporting System

A comprehensive civic engagement platform designed to enable instant crime reporting with real-time updates, anonymous reporting options, and administrative oversight. This system aims to enhance community safety and improve communication between the public and authorities.

## 🎯 Project Overview

**"Technology becomes meaningful when it protects lives"**

The Real-Time Crime Reporting System is a full-stack web application that facilitates rapid crime reporting through an intuitive interface, real-time map visualization, and administrative dashboard for authorities to monitor and respond to incidents.

### Key Features

- 📍 **Geolocation-based Reporting**: Report crimes with precise GPS coordinates
- 📸 **Media Upload**: Attach photos and videos as evidence
- 🕵️ **Anonymous Reporting**: Report safely without revealing identity
- 🗺️ **Live Crime Map**: Real-time visualization of incidents
- 🔔 **Real-time Alerts**: Instant notifications for new reports
- 🛡️ **Admin Review System**: Authority verification and status updates
- ⚡ **Socket.IO Integration**: Live updates across all connected clients

## 🏗️ Technology Stack

### Frontend
- **Framework**: React.js 18
- **Routing**: React Router v6
- **Maps**: Leaflet + React Leaflet
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Styling**: CSS3

### Backend
- **Framework**: Express.js
- **Runtime**: Node.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## 📁 Project Structure

```
Real-Time Crime Reporting System/
├── server/                 # Backend application
│   ├── models/            # MongoDB schemas
│   ├── controllers/       # Business logic
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, file upload
│   ├── uploads/           # Media files storage
│   ├── server.js          # Main server file
│   └── package.json       # Dependencies
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API & Socket utilities
│   │   ├── styles/        # Component styles
│   │   ├── App.js         # Main component
│   │   └── index.js       # Entry point
│   ├── public/            # Static assets
│   └── package.json       # Dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas cluster)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
npm install
```

2. Create `.env` file with configuration:
```env
MONGODB_URI=mongodb://localhost:27017/crime-reporting
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
CLIENT_URL=http://localhost:3000
```

3. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
npm install
```

2. Create `.env` file (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📝 API Documentation

### Reports Endpoints

#### Create Report
```
POST /api/reports
Content-Type: multipart/form-data

Body:
- description (string, required)
- crimeType (string, required)
- severity (string: low, medium, high, critical)
- latitude (number, required)
- longitude (number, required)
- address (string)
- isAnonymous (boolean)
- reporterName (string)
- reporterEmail (string)
- reporterPhone (string)
- media (files)

Response: { success: true, data: Report }
```

#### Get Reports
```
GET /api/reports?status=pending&page=1&limit=20

Response: { success: true, data: Report[], pagination: {...} }
```

#### Get Report by ID
```
GET /api/reports/:id

Response: { success: true, data: Report }
```

#### Update Report Status (Admin)
```
PATCH /api/reports/:id/status
Authorization: Bearer <token>

Body:
- status (string: pending, in-progress, resolved, dismissed)
- adminNotes (string)

Response: { success: true, data: Report }
```

#### Get Crime Statistics
```
GET /api/reports/stats/all

Response: { success: true, data: { byCrimeType: [...], byStatus: [...] } }
```

### Admin Endpoints

#### Register Admin
```
POST /api/admins/register

Body:
- name (string)
- email (string)
- password (string)
- role (string: admin, moderator, responder)

Response: { success: true, token: string, admin: {...} }
```

#### Login Admin
```
POST /api/admins/login

Body:
- email (string)
- password (string)

Response: { success: true, token: string, admin: {...} }
```

#### Get Current Admin
```
GET /api/admins/me
Authorization: Bearer <token>

Response: { success: true, data: Admin }
```

## 🔌 Socket.IO Events

### Client → Server
- `joinReports` - Join reports channel
- `leaveReports` - Leave reports channel

### Server → Client
- `newReport` - Broadcast when new report is created
- `reportUpdated` - Broadcast when report status changes
- `responseAdded` - Broadcast when response is added to report

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **CORS Protection**: Cross-origin requests validation
- **File Upload Validation**: MIME type and size restrictions
- **Anonymous Reporting**: Protect reporter identity
- **Role-based Access Control**: Different permissions for admins

## 🗄️ Database Schema

### Report Model
```javascript
{
  description: String,
  location: {
    type: Point,
    coordinates: [longitude, latitude],
    address: String
  },
  crimeType: String (enum),
  severity: String (enum),
  mediaFiles: [{
    filename: String,
    path: String,
    type: String (image/video)
  }],
  isAnonymous: Boolean,
  reporterName: String,
  reporterEmail: String,
  reporterPhone: String,
  status: String (enum),
  adminNotes: String,
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 📊 Crime Types Supported

- Theft
- Assault
- Robbery
- Burglary
- Accident
- Vandalism
- Fraud
- Harassment
- Other

## 🎨 User Interface

### Public Pages
- **Home**: Landing page with features overview
- **Report Crime**: Form to submit crime reports
- **Live Map**: Interactive map showing all reports

### Admin Pages
- **Admin Login/Register**: Authentication for administrators
- **Admin Dashboard**: 
  - View all reports
  - Filter by status
  - Update report status
  - Add admin notes
  - Delete reports
  - View crime statistics

## 🌐 Deployment

### Backend Deployment (Heroku Example)
```bash
cd server
heroku create your-app-name
heroku config:set MONGODB_URI=<your-mongodb-uri>
heroku config:set JWT_SECRET=<your-secret>
git push heroku main
```

### Frontend Deployment (Vercel Example)
```bash
cd client
vercel
```

## 📱 Future Enhancements

- 🤖 AI-based fake report detection
- 🔥 Crime heatmaps and trend analysis
- 📲 Mobile app version (React Native)
- 🎙️ Voice-based reporting
- 📹 CCTV system integration
- 🔔 Push notifications
- 📧 Email alerts for subscribed users
- 🗣️ Multi-language support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Aje** - Project Lead and Developer

## 🙏 Acknowledgments

- Built for community safety
- Inspired by civic engagement initiatives
- Smart city solutions

## 📞 Support

For issues or questions, please open an issue on the repository or contact the development team.

---

**"From silence to signal — instantly."**

Made with ❤️ for safer communities
